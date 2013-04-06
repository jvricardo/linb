Class('App', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[Code created by CrossUI RAD Tools
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.SLabel)
                .setHost(host,"slabel1")
                .setLeft(40)
                .setTop(44)
                .setCaption("Select your file：")
            );
            
            append((new linb.UI.ComboInput)
                .setHost(host,"upload")
                .setLeft(140)
                .setTop(40)
                .setWidth(140)
                .setType("upload")
                .setValue("Select a file ...")
            );
            
            append((new linb.UI.SButton)
                .setHost(host,"sbutton3")
                .setLeft(290)
                .setTop(40)
                .setCaption("Upload it")
                .onClick("_sbutton3_onclick")
            );
            
            return children;
            // ]]Code created by CrossUI RAD Tools
        }, 
        _sbutton3_onclick:function (profile, e, src, value) {
            var file=this.upload.getUploadObj();
            if(file){
                linb.IAjax('../request.php',{key:'upload',para:{},file:file},function(rsp){
                    linb.alert(rsp.data.message);
                },function(errMsg){
                    linb.alert(errMsg)
                }).start();
            }
        }
    }
});