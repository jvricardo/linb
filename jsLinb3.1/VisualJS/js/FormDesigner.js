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
                com.setValue(com.$fetchedCode||com.$iniCode, com.$fetchedurl);
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
        setValue:function(str,url){
            var self=this;
            // TODO: need wrap
            //if(str)
                //self._Designer.refreshView(??);  
            self.$dirty=false;
        },

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
                        {id:"save","caption":"Save to server", "image":"img/App.gif", "imagePos":"-96px top"}, 
                        {id:"fill","caption":"To fill Form", "image":"img/App.gif", "imagePos":"-80px -48px"}, 
                        {id:"show","caption":"Show Form", "image":"img/App.gif", "imagePos":"-128px -48px"}]
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
                _.observableRun(function(threadid){
                    linb.request(CONF.phpPath, {
                        key:CONF.requestKey,
                        para:{
                            action:'fetchForms'
                        }
                    },function(txt){
                        var obj = typeof txt=='string'?_.unserialize(txt):txt;
                        if(!obj.error){
                            obj=obj.data;
                            var items=[];
                            if(obj && obj.length){
                                _.arr.each(obj,function(i){
                                    if(i.type===0){
                                        items.push({id:i.name,caption:i.name})
                                    }
                                });
                            }
                            linb.ComFactory.getCom("FormDesigner.OpenSaveDlg",function(){
                                var com=this;
                                com.setMode(keypara);
                                com.setFormItems(items);
                                com.setEvents({
                                    onOK:function(formId, recordId){
                                        if(keypara=="open"){
                                            ns.openForm(formId, recordId);
                                        }else{
                                            ns.saveForm(formId, recordId);
                                        }
                                    }
                                });
                                this.ctl_dlg.showModal();
                            });
                        }else
                            linb.message(obj.error.message);
                    });
                });
                break;
                case "fill":
                break;
                case "show":
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
                        
                        // build UI
                        ns._Designer.refreshView({Instance:{iniComponents:obj.formCode}});
                        
                        // fill values
                        //obj.formFields;
                    }else
                        linb.message(obj.error.message);
                });
            });            
        },
        saveForm:function(formId, recordId){
            
        }
    }
});