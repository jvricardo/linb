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
                .setWidth(330)
                .setHeight(280)
                .setCaption("Open Form")
                .setMinBtn(false)
                .setMaxBtn(false)
                .beforeClose("_ctl_dlg_beforeclose")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.Group)
                .setHost(host,"ctl_block5")
                .setLeft(10)
                .setTop(10)
                .setWidth(144)
                .setHeight(190)
                .setCaption("From ID")
                .setToggleBtn(false)
            );
            
            host.ctl_block5.append(
                (new linb.UI.Input)
                .setHost(host,"ctl_inputForm")
                .setDirtyMark(false)
                .setLeft(9)
                .setTop(0)
                .setWidth(121)
                .setLabelSize(1)
                .setLabelCaption("ctl_inputForm")
                .setValueFormat("^$|^[0-9a-zA-Z_]+$")
            );
            
            host.ctl_block5.append(
                (new linb.UI.List)
                .setHost(host,"ctl_listForm")
                .setDirtyMark(false)
                .setLeft(10)
                .setTop(22)
                .setHeight(144)
                .setSelMode("none")
                .setBorderType("inset")
                .onItemSelected("_ctl_listform_onitemselected")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.Group)
                .setHost(host,"ctl_block7")
                .setLeft(170)
                .setTop(10)
                .setWidth(144)
                .setHeight(190)
                .setCaption("Record ID")
                .setToggleBtn(false)
            );
            
            host.ctl_block7.append(
                (new linb.UI.Input)
                .setHost(host,"ctl_inputRecord")
                .setDirtyMark(false)
                .setLeft(10)
                .setTop(0)
                .setTabindex(0)
                .setLabelCaption("ctl_inputRecord")
                .setValueFormat("^$|^[0-9a-zA-Z_]+$")
            );
            
            host.ctl_block7.append(
                (new linb.UI.List)
                .setHost(host,"ctl_listRecord")
                .setDirtyMark(false)
                .setLeft(10)
                .setTop(22)
                .setHeight(144)
                .setSelMode("none")
                .setBorderType("inset")
                .setValue("")
                .onItemSelected("_ctl_listrecord_onitemselected")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.Button)
                .setHost(host,"btnCancel")
                .setLeft(30)
                .setTop(210)
                .setWidth(100)
                .setCaption("Cancel")
                .setImage("@CONF.img_app")
                .setImagePos("-16px -16px")
                .onClick("_btncancel_onclick")
            );
            
            host.ctl_dlg.append(
                (new linb.UI.Button)
                .setHost(host,"btnOK")
                .setLeft(190)
                .setTop(210)
                .setWidth(100)
                .setCaption("OK")
                .setImage("@CONF.img_app")
                .setImagePos("-64px -16px")
                .onClick("_btnok_onclick")
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
        setMode:function(mode){
            var ns=this;
            ns.ctl_listForm.clearItems();
            ns.ctl_listRecord.clearItems();
            if(mode=="open"){
                ns.ctl_dlg.setCaption("Open");
                ns.btnOK.setCaption("Open");
                ns.ctl_inputForm.resetValue().setReadonly(true);
                ns.ctl_inputRecord.resetValue().setReadonly(true);
            }else{
                ns.ctl_dlg.setCaption("Save");
                ns.btnOK.setCaption("Save");
                ns.ctl_inputForm.resetValue().setReadonly(false);
                ns.ctl_inputRecord.resetValue().setReadonly(false);                
            }
        },
        setFormItems:function(items){
            this.ctl_listForm.setItems(items);
        },
        _ctl_listform_onitemselected : function (profile, item, e, src, type) {
            var ns = this;
            ns.ctl_inputForm.setValue(item.id);
            ns.ctl_inputRecord.resetValue();
            ns.ctl_listRecord.clearItems().busy();

            _.observableRun(function(threadid){
                linb.request(CONF.phpPath, {
                    key:CONF.requestKey,
                    para:{
                        action:'fetchRecords',
                        formId: item.id
                    }
                },function(txt){
                    var obj = typeof txt=='string'?_.unserialize(txt):txt;
                    if(!obj.error){
                        obj=obj.data;
                        var items=[];
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
                        ns.ctl_listRecord.insertItems(items);
                        ns.ctl_listRecord.free();
                    }else
                        linb.message(obj.error.message);
                });
            });
        },
        _ctl_listrecord_onitemselected : function (profile, item, e, src, type) {
            var ns = this;
            ns.ctl_inputRecord.setValue(item.id);
        }
    }
});