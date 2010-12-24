Class('App', 'linb.Com',{
    Instance:{
        //Com events
        events:{"onReady":"_onready"},
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new linb.DataBinder)
                .setHost(host,"databinder")
                .setName("databinder")
            );

            append((new linb.UI.Input)
                .setHost(host,"input13")
                .setLeft(40)
                .setTop(280)
                .setWidth(440)
                .setHeight(100)
                .setMultiLines(true)
                .setValue("{email:'a@a.com',web:'string'}")
            );

            append((new linb.UI.Button)
                .setHost(host,"button29")
                .setLeft(490)
                .setTop(350)
                .setCaption("setValue")
                .onClick("_button29_onclick")
            );

            append((new linb.UI.Button)
                .setHost(host,"button22")
                .setLeft(490)
                .setTop(240)
                .setCaption("getValue")
                .onClick("_button22_onclick")
            );

            append((new linb.UI.Group)
                .setHost(host,"group1")
                .setLeft(40)
                .setTop(20)
                .setWidth(440)
                .setHeight(240)
                .setCaption("group1")
            );

            host.group1.append((new linb.UI.Input)
                .setHost(host,"input2")
                .setDataBinder("databinder")
                .setDataField("email")
                .setLeft(80)
                .setTop(20)
                .setValueFormat("^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w\\.-]{2,4}$")
                .setValue("a@a.com")
            );

            host.group1.append((new linb.UI.Input)
                .setHost(host,"input6")
                .setDataBinder("databinder")
                .setDataField("Name")
                .setLeft(300)
                .setTop(20)
                .setValue("Jack")
            );

            host.group1.append((new linb.UI.RichEditor)
                .setHost(host,"richeditor1")
                .setDataBinder("databinder")
                .setDataField("Memo")
                .setLeft(20)
                .setTop(80)
                .setHeight(130)
                .setValue(" Dear <font face='Courier New'><b>All</b></font>:<br> <hr size='1' width='100%'>")
            );

            host.group1.append((new linb.UI.SLabel)
                .setHost(host,"slabel1")
                .setLeft(240)
                .setTop(25)
                .setCaption("Name:")
            );

            host.group1.append((new linb.UI.SLabel)
                .setHost(host,"slabel2")
                .setLeft(20)
                .setTop(25)
                .setCaption("Email:")
            );

            host.group1.append((new linb.UI.SLabel)
                .setHost(host,"slabel3")
                .setLeft(20)
                .setTop(60)
                .setCaption("Memo:")
            );

            return children;
            // ]]code created by jsLinb UI Builder
        },
        _button22_onclick:function (profile, e, value) {
            var data=SPA.databinder.getValue();
            if(!data)
                alert('Ensure all the fields are valid first!');
            else
                SPA.input13.setValue(_.serialize(data),true);
        },
        _onready:function () {
            SPA=this;
        },
        _button29_onclick:function (profile, e, value) {
            SPA.databinder.resetValue( _.unserialize(SPA.input13.getUIValue()) );
        }
    }
});