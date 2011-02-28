Class('FormFiller', 'linb.Com',{
    Instance:{
        _oldValues:{},
        customAppend : function(parent, subId, left, top){
            var ns=this,
                para={
                    action:'openForm',
                    formId:ARGS.formId
                };
            if(ARGS.recordId){
                para.recordId=ARGS.recordId;
            }
            
            _.observableRun(function(threadid){
                linb.request(CONF.phpPath, {
                    key:CONF.requestKey,
                    para:para
                },function(txt){
                    var obj = typeof txt=='string'?_.unserialize(txt):txt;
                    if(!obj.error){
                        obj=obj.data;
                        try{
                            var fields= (_.isSet(obj.formFields) ? _.unserialize(obj.formFields) :null)||{},
                                formCode=obj.formCode,
                                fun = new Function([], formCode),
                                host={_ctrlpool:{}},
                                rootelems=fun.call(host),
                                arr=[],
                                dataBinder;
                            if(!ARGS.recordId){
                                ns.ctl_btnSave.setDisabled(true);
                                ns.ctl_btnReset.setDisabled(true);
                            }else{
                                dataBinder = new linb.DataBinder();
                                dataBinder.setHost(ns,"databinder1");
                                var values={};

                                _.each(host._ctrlpool,function(prf){
                                    if(prf.boxing()["linb.absValue"] && !prf.boxing()["linb.UI.Tabs"]){
                                        // fill values
                                        values[prf.alias] = _.isDefined(fields[prf.alias]) ? fields[prf.alias] : null;
                                        prf.boxing().setDataBinder("databinder1").setDataField(prf.alias);
                                    }
                                });

                                dataBinder.resetValue( ns._oldValues = values);
                            }                            
                            // attach UI
                            ns.mainPane.append(linb.UI.pack(rootelems,false));
                            // show UI
                            (parent||linb('body')).append(ns.getUIComponents(),subId);
                            
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
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append(
                (new linb.UI.Pane)
                .setHost(host,"mainPane")
                .setDock("fill")
            );
            
            append(
                (new linb.UI.Block)
                .setHost(host,"ctl_block2")
                .setDock("bottom")
                .setHeight(40)
            );
            
            host.ctl_block2.append(
                (new linb.UI.Pane)
                .setHost(host,"ctl_pane20")
                .setDock("center")
                .setLeft(140)
                .setTop(2)
                .setWidth(381)
                .setHeight(34)
            );
            
            host.ctl_pane20.append(
                (new linb.UI.SButton)
                .setHost(host,"ctl_btnReset")
                .setLeft(140)
                .setTop(10)
                .setWidth(90)
                .setCaption("Reset Form")
                .onClick("_ctl_btnreset_onclick")
            );
            
            host.ctl_pane20.append(
                (new linb.UI.SButton)
                .setHost(host,"ctl_btnSave")
                .setLeft(260)
                .setTop(10)
                .setWidth(90)
                .setCaption("Save Form")
                .onClick("_ctl_btnsave_onclick")
            );
            
            host.ctl_pane20.append(
                (new linb.UI.SButton)
                .setHost(host,"ctl_btnEmpty")
                .setLeft(20)
                .setTop(10)
                .setWidth(90)
                .setCaption("Empty Form")
                .onClick("_ctl_btnempty_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        disbleCmd:function(bool){
            var ns=this;
            ns.ctl_btnEmpty.setDisabled(!!bool);
            ns.ctl_btnReset.setDisabled(!!bool);
            ns.ctl_btnSave.setDisabled(!!bool);
        },
        _ctl_btnempty_onclick : function (profile, e, src, value) {
             this.databinder1.resetValue();
        },
        _ctl_btnreset_onclick : function (profile, e, src, value) {
            var ns = this;
            ns.databinder1.resetValue(ns._oldValues);
        },
        _ctl_btnsave_onclick : function (profile, e, src, value) {
            var ns=this;
            // invalid value exists
            if(!ns.databinder1.checkValid()){
                linb.alert("Invalid value exists!");
                return false;
            }
            // No change
            if(_.isEmpty(ns.databinder1.getValue(true,false))){
                linb.message("No Change Yet!");
                return false;
            }
            // exchange data
            var values=ns.databinder1.getValue(),
                para={
                    action:'saveForm',
                    formId:ARGS.formId,
                    recordId:ARGS.recordId,
                    formFields:_.serialize(values)
                },
                ctrls,arr=[];
            
            _.each(ns._widgets,function(prf){
                arr.push(prf);
            });
            ctrls = linb.absValue.pack(arr, false);
            
            ns.disbleCmd(true);
            _.observableRun(function(threadid){
                linb.request(CONF.phpPath, {
                    key:CONF.requestKey,
                    para:para
                },function(txt){
                    var obj = typeof txt=='string'?_.unserialize(txt):txt;
                    if(!obj.error){
                        ns._oldValues = values;
                        ns.disbleCmd(false);
                        linb.message("Saved!");
                    }else
                        linb.message(obj.error.message);
                },function(txt){
                    linb.message(txt);
                },threadid,{method:'post'});
            });
        }
    }
});