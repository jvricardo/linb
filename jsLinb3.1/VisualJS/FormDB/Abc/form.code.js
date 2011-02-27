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
            
            return children;