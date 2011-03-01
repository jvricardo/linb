Class('FormDesigner.OpenSaveDlg', 'linb.Com',{
    Instance:{
        iniComponents : function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append(
                (new linb.UI.Dialog)
                .setHost(host,"ctl_dlg")
                .setLeft(20)
                .setTop(20)
                .setWidth(440)
                .setHeight(120)
                .setCaption("Open Form")
                .setMinBtn(false)
                .setMaxBtn(false)
                .beforeClose("_ctl_dlg_beforeclose")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.ComboInput)
                .setHost(host,"ctl_inputRecord")
                .setDirtyMark(false)
                .setLeft(290)
                .setTop(10)
                .setTabindex(0)
                .setLabelCaption("ctl_inputRecord")
                .setValueFormat("^$|^[0-9a-zA-Z_]+$")
                .setCachePopWnd(false)
                .beforeComboPop("_ctl_inputrecord_beforecombopop")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.Button)
                .setHost(host,"btnCancel")
                .setLeft(110)
                .setTop(50)
                .setWidth(100)
                .setCaption("Cancel")
                .setImage("@CONF.img_app")
                .setImagePos("-16px -16px")
                .onClick("_btncancel_onclick")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.Button)
                .setHost(host,"btnOK")
                .setLeft(270)
                .setTop(50)
                .setWidth(100)
                .setCaption("OK")
                .setImage("@CONF.img_app")
                .setImagePos("-64px -16px")
                .onClick("_btnok_onclick")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.SLabel)
                .setHost(host,"ctl_slabel2")
                .setLeft(10)
                .setTop(14)
                .setWidth(74)
                .setCaption("Form ID")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.ComboInput)
                .setHost(host,"ctl_inputForm")
                .setDirtyMark(false)
                .setLeft(90)
                .setTop(10)
                .setLabelCaption("ctl_inputForm")
                .setValueFormat("^$|^[0-9a-zA-Z_]+$")
                .setCachePopWnd(false)
                .onChange("_ctl_inputform_onchange")
                .beforeComboPop("_ctl_inputform_beforecombopop")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.SLabel)
                .setHost(host,"ctl_slabel3")
                .setLeft(210)
                .setTop(14)
                .setWidth(74)
                .setCaption("Record ID")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.Block)
                .setHost(host,"ctl_block5")
                .setLeft(20)
                .setTop(41)
                .setWidth(400)
                .setHeight(2)
                .setBorderType("inset")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        _ctl_dlg_beforeclose : function (profile) {
            this.ctl_dlg.hide();
            return false;
        },
        _btncancel_onclick : function (profile, e, src, value) {
            this.ctl_dlg.close();
        },
        _btnok_onclick : function (profile, e, src, value) {
            var ns=this;
            var formId=ns.ctl_inputForm.getValue();
            var recordId=ns.ctl_inputRecord.getValue();
            formId = _.str.trim(formId);
            // formId is OK
            if(formId){
                this.fireEvent("onOK", [formId, recordId]);
                ns.ctl_dlg.close();
            }
        },
        setArgs:function(args){
            var ns=this;
            if(args.formId)
                ns.ctl_inputForm.setValue(args.formId).setCaption(args.formId);
            if(args.recordId)
                ns.ctl_inputRecord.setValue(args.recordId).setCaption(args.recordId);
        },
        setMode:function(mode){
            var ns=this;
            ns.__mode=mode;
            if(mode=="open"){
                ns.ctl_dlg.setCaption("Open");
                ns.btnOK.setCaption("Open");
                ns.ctl_inputForm.resetValue().setCaption(null).setType("listbox");
                ns.ctl_inputRecord.resetValue().setCaption(null).setType("listbox");
            }else if(mode=="delete"){
                ns.ctl_dlg.setCaption("Remove");
                ns.btnOK.setCaption("Remove");
                ns.ctl_inputForm.resetValue().setCaption(null).setType("listbox");
                ns.ctl_inputRecord.resetValue().setCaption(null).setType("listbox");                
            }else{
                ns.ctl_dlg.setCaption("Save");
                ns.btnOK.setCaption("Save");
                ns.ctl_inputForm.resetValue().setCaption(null).setType("combobox");
                ns.ctl_inputRecord.resetValue().setCaption(null).setType("combobox");
            }
        },
        _ctl_inputform_beforecombopop : function (profile, pos, e, src) {
            var ns = this;
            // default
            profile.boxing().setItems([{id:"Loading...",capiton:"Loading...",image:"img/busy.gif", imagePos:"3px 3px", disabled:true}]);
            // get forms
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
                        profile.boxing().setItems(items);
                    }else{
                        profile.boxing().setItems([]).collapse();
                    }
                },function(){
                    profile.boxing().setItems([]).collapse();
                },threadid,{method:'post'});
            });
        },
        _ctl_inputrecord_beforecombopop : function (profile, pos, e, src) {
            var ns = this,
                formId = ns.ctl_inputForm.getValue();
            if(!formId)
                return false;
            
            // default
            profile.boxing().setItems([{id:"Loading...",capiton:"Loading...",image:"img/busy.gif", imagePos:"3px 3px", disabled:true}]);
            // get forms
            _.observableRun(function(threadid){
                linb.request(CONF.phpPath, {
                    key:CONF.requestKey,
                    para:{
                        action:'fetchRecords',
                        formId:formId
                    }
                },function(txt){
                    var obj = typeof txt=='string'?_.unserialize(txt):txt;
                    if(!obj.error){
                        obj=obj.data;
                        var items=[{id:"",caption:""}];
                        if(obj && obj.length){
                            _.arr.each(obj,function(i){
                                if(i.type===1){
                                    if(/^[0-9a-zA-Z_]+\.js$/.test(i.name)){
                                        var id=i.name.replace(".js","");
                                        items.push({id:id,caption:id});
                                    }
                                }
                            });
                        }                        
                        profile.boxing().setItems(items);
                    }else{
                        profile.boxing().setItems([]).collapse();
                    }
                },function(){
                    profile.boxing().setItems([]).collapse();
                },threadid,{method:'post'});
            });

        },
        _ctl_inputform_onchange : function (profile, oldValue, newValue) {
            var ns = this;
            if(ns.__mode!="save"){
                ns.ctl_inputRecord.setItems([]).setValue(null).setCaption(null);
            }
        }
    }
});