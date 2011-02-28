Class('FormDesigner', 'linb.Com',{
    Instance:{
        _Designer:null,

        $fetchedCode:'',
        $iniCode:'',
        
        $dirty:false,

        onDestroy:function(){
            this._Designer.destroy();
        },
        events:{
            onReady:function(){
                SPA=this;
                linb.ComFactory.setProfile(CONF.ComFactoryProfile);
            },
            onRender:function(com, threadid){
                if(ARGS.formId){
                    this.openForm(ARGS.formId, ARGS.recordId);
                }
            },
            afterIniComponents:function(){
                var self=this;
                //self.popLang.setItems(CONF.localeItems);
            }
        },
        iniExComs:function(com, threadid){
            var com=this;
            //New an instance of VisualJS.JSEditor
            linb.ComFactory.newCom('VisualJS.Designer',function(threadid){
                var inn=this;
                inn.host = com;
                inn.setEvents('onValueChanged',function(){
                    com.$dirty=true;
                });

                //Create it first
                inn.create(function(o,threadid){
                    com.appRoot.append(inn);
                },threadid);

                com._Designer=inn;
            },threadid);
        },
        getValue:function(){
            // TODO: need wrap
            return this._Designer.getJSCode();
        },
        /*setValue:function(str,url){
            var self=this;
            // TODO: need wrap
            //if(str)
                //self._Designer.refreshView(??);  
            self.$dirty=false;
        },*/

        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append(
                (new linb.UI.Pane)
                .setHost(host,"appRoot")
                .setDock("fill")
                .setDockMinW(800)
                .setDockMinH(400)
            );
            
            host.appRoot.append(
                (new linb.UI.ToolBar)
                .setHost(host,"ctl_toolbar")
                .setItems([
                    /*{"id":"grp1", "sub":[
                        {"caption":"English", "image":"img/App.gif", "imagePos":"-96px -16px", "dropButton":true},
                        {"caption":"Default Theme", "image":"img/App.gif", "imagePos":"-208px -48px", "dropButton":true}
                    ]},
                    */
                    {"id":"grp2", "sub":[
                        {id:"open","caption":"Open Form", "image":"img/App.gif", "imagePos":"-48px top"}, 
                        {id:"save","caption":"Save Form", "image":"img/App.gif", "imagePos":"-96px top"}, 
                        {id:"delete","caption":"Remove Form", "image":"img/App.gif", "imagePos":"-16px -16px"}, 
                        {id:"fill","caption":"Fill Form", "image":"img/App.gif", "imagePos":"-80px -48px"}, 
                        {id:"show","caption":"Read Form", "image":"img/App.gif", "imagePos":"-128px -48px"}]
                    }])
                .onClick("_toolbar_onclick")
            );
            
            host.appRoot.append(
                (new linb.UI.Label)
                .setHost(host,"ctl_label1")
                .setTop(2)
                .setWidth(280)
                .setHeight(24)
                .setRight(10)
                .setCaption("jsLinb Simple Form Builder")
                .setShadowText(true)
                .setFontSize("18px")
                .setFontWeight("bold")
                .setCustomStyle({"CAPTION":"font-family:Comic Sans MS", "SCAPTION":"font-familyr:Comic Sans MS"})
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _toolbar_onclick: function(profile,item, group, e, src){
            var ns=this, keypara=item.id;
            switch(keypara){
                case "open":
                case "save":
                case "delete":
                    linb.ComFactory.getCom("FormDesigner.OpenSaveDlg",function(){
                        var com=this;
                        com.setMode(keypara);
                        com.setArgs(ARGS);
                        com.setEvents({
                            onOK:function(formId, recordId){
                                if(keypara=="open"){
                                    ns.openForm(formId, recordId);
                                }else if(keypara=="save"){
                                    ns.saveForm(formId, recordId);
                                }else{
                                    ns.delForm(formId, recordId);
                                }
                            }
                        });
                        this.ctl_dlg.showModal();
                    });
                break;
                case "fill":
                    if(ns.$dirty){
                        linb.message("Changed! Save it first!");
                        return ;
                    }
                    linb.Dom.submit(location.pathname + '#'+ _.urlEncode({
                        mode:'fill',
                        formId:ARGS.formId,
                        recordId:ARGS.recordId
                    }));
                break;
                case "show":
                    if(ns.$dirty){
                        linb.message("Changed! Save it first!");
                        return ;
                    }
                    linb.Dom.submit(location.pathname + '#'+ _.urlEncode({
                        formId:ARGS.formId,
                        recordId:ARGS.recordId
                    }));
                break;
            }
        },
        openForm:function(formId, recordId){
            var ns=this;
            // clear the UI first
            ns._Designer.refreshView({Instance:{iniComponents:""}});
            
            var para={
                action:'openForm',
                formId:formId,
                rand:_()
            };
            if(recordId)
                para.recordId=recordId;

            _.observableRun(function(threadid){
                linb.request(CONF.phpPath, {
                    key:CONF.requestKey,
                    para:para
                },function(txt){
                    var obj = typeof txt=='string'?_.unserialize(txt):txt;
                    if(!obj.error){
                        obj=obj.data;
                        try{
                            var fields=_.unserialize(obj.formFields),
                                formCode=obj.formCode,
                                fun = new Function([], formCode),
                                host={_ctrlpool:{}},
                                rootelems=fun.call(host),
                                arr=[];
                            if(fields){
                                _.each(host._ctrlpool,function(prf){
                                    if(prf.boxing()["linb.absValue"] && !prf.boxing()["linb.UI.Tabs"]){
                                        // fill values
                                        if(_.isDefined(fields[prf.alias])){
                                            prf.boxing().setValue(fields[prf.alias]);
                                        }
                                    }
                                });
                                formCode=VisualJS.Designer.prototype.getJSCode(rootelems);
                            }
    
                            // build UI
                            ns._Designer.refreshView(
                                {Instance:{
                                    iniComponents : formCode
                                }
                            }); 
                            
                            ARGS.formId=formId;
                            ARGS.recordId=recordId||"";

                            ns.$dirty=false;  
                        }catch(e){
                            linb.message(e.message);
                        }

                    }else
                        linb.message(obj.error.message);
                },function(txt){
                    linb.message(txt);
                },threadid,{method:'post'});
            }); 
        },
        saveForm:function(formId, recordId){
            var ns=this;    
            var para={
                action:'saveForm',
                formId:formId,
                rand:_()
            };
            if(recordId)
                para.recordId=recordId;
            
            var elems=ns._Designer.getWidgets(),
                // updateValue
                updateValue=function(arr){
                    _.arr.each(arr,function(prf){
                        if(prf[0] && prf[0]["linb.absProfile"])prf=prf[0];
                        
                        if(prf.boxing()["linb.absValue"] && !prf.boxing()["linb.UI.Tabs"]){
                            prf.boxing().updateValue();
                        }
                        if(prf.children && prf.children.length){
                            updateValue(prf.children);
                        }
                    });
                };
            updateValue(elems);
            
            var formCode=ns._Designer.getJSCode(elems),
                fun = new Function([], formCode),
                host={_ctrlpool:{}},
                rootelems=fun.call(host),
                fields={};
             _.each(host._ctrlpool,function(prf){
                // exclude linb.UI.Tabs
                if(prf.boxing()["linb.absValue"] && !prf.boxing()["linb.UI.Tabs"]){
                    var v=prf.boxing().getValue();
                    if(v){
                        // collect value
                        fields[prf.alias]=v;
                        // clear value
                        prf.boxing().resetValue();
                    }
                }
            });
            para.formCode=VisualJS.Designer.prototype.getJSCode(rootelems);
            para.formFields=_.serialize(fields);

            _.observableRun(function(threadid){
                linb.request(CONF.phpPath, {
                    key:CONF.requestKey,
                    para:para
                },function(txt){
                    var obj = typeof txt=='string'?_.unserialize(txt):txt;
                    if(!obj.error){
                        linb.message("Saved!");
                        
                        ns.$dirty=false;
                        ARGS.formId=formId;
                        ARGS.recordId=recordId||"";

                    }else
                        linb.message(obj.error.message);
                },function(txt){
                    linb.message(txt);
                },threadid,{method:'post'});
            });          
        },
        delForm:function(formId, recordId){
            var ns=this;    
            var para={
                action:'delForm',
                formId:formId,
                rand:_()
            };
            if(recordId)
                para.recordId=recordId;

            _.observableRun(function(threadid){
                linb.request(CONF.phpPath, {
                    key:CONF.requestKey,
                    para:para
                },function(txt){
                    // clear the UI
                    ns._Designer.refreshView({Instance:{iniComponents:""}});

                    delete ARGS.formId;
                    delete ARGS.recordId;
                    
                    linb.message("Removed!");
                },function(txt){
                    linb.message(txt);
                },threadid,{method:'post'});
            });      
        }
    }
});