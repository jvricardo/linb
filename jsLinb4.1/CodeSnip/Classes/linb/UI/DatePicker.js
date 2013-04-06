 Class('App.linb_UI_DatePicker', 'linb.Com',{
    Instance:{
        iniComponents:function(){
            // [[Code created by CrossUI RAD Tools
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Div)
                .setHost(host,"div")
                .setLeft(100)
                .setTop(60)
                .setWidth(290)
                .setHeight(30)
            );
            
            append((new linb.UI.DatePicker)
                .setHost(host,"date1")
                .setLeft(100)
                .setTop(100)
                .setCloseBtn(false)
                .afterUIValueSet("_date1_aftervalueupdated")
            );
            
            return children;
            // ]]Code created by CrossUI RAD Tools
        }, 
        _date1_aftervalueupdated:function (profile, oldValue, newValue) {
            this.div.setHtml(newValue)
        }
    }
});