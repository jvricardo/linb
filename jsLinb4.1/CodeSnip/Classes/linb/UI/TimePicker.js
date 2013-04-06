 Class('App.linb_UI_TimePicker', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[Code created by CrossUI RAD Tools
            var host = this,
                children = [],
                append = function(child){
                    children.push(child.get(0))
                };
            
            append((new linb.UI.TimePicker)
                .setHost(host,"time1")
                .setLeft(100)
                .setTop(100)
                .setCloseBtn(false)
                .afterUIValueSet("_time1_aftervalueupdated")
            );
            
            append((new linb.UI.Div)
                .setHost(host,"div")
                .setLeft(100)
                .setTop(60)
                .setHeight(30)
            );
            
            return children;
            // ]]Code created by CrossUI RAD Tools
        },
        _time1_aftervalueupdated:function (profile, oldValue, newValue) {
            this.div.setHtml(newValue)
        }
    }
});