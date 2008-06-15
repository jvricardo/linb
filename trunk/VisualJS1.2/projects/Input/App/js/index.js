Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Com
        base:["linb.UI"],
        //requried class for the App
        required:["linb.UI.Input","linb.UI.Label","linb.UI.Div","linb.UI.Group"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.Label)
            .host(t,"label11")
            .setLeft(32)
            .setTop(336)
            .setWidth(104)
            .setCaption("number")
            );
            
            f(
            (new u.Label)
            .host(t,"label5")
            .setLeft(352)
            .setTop(136)
            .setWidth(104)
            .setCaption("disabled")
            );
            
            f(
            (new u.Label)
            .host(t,"label10")
            .setLeft(352)
            .setTop(304)
            .setWidth(104)
            .setCaption("integer")
            );
            
            f(
            (new u.Label)
            .host(t,"label3")
            .setLeft(32)
            .setTop(72)
            .setWidth(104)
            .setCaption("textarea")
            );
            
            f(
            (new u.Label)
            .host(t,"label8")
            .setLeft(352)
            .setTop(272)
            .setWidth(104)
            .setCaption("letter")
            );
            
            f(
            (new u.Label)
            .host(t,"label6")
            .setLeft(16)
            .setTop(208)
            .setWidth(168)
            .setCaption("border/resizable/shadow")
            );
            
            f(
            (new u.Label)
            .host(t,"label9")
            .setLeft(32)
            .setTop(304)
            .setWidth(104)
            .setCaption("alpha")
            );
            
            f(
            (new u.Label)
            .host(t,"label13")
            .setLeft(64)
            .setTop(370)
            .setWidth(296)
            .setCaption("Input 'allow' only, using 'onFormatCheck' event")
            );
            
            f(
            (new u.Label)
            .host(t,"label7")
            .setLeft(32)
            .setTop(272)
            .setWidth(104)
            .setCaption("email")
            );
            
            f(
            (new u.Label)
            .host(t,"label12")
            .setLeft(352)
            .setTop(336)
            .setWidth(104)
            .setCaption("MM/DD/YYYY")
            );
            
            f(
            (new u.Label)
            .host(t,"label4")
            .setLeft(32)
            .setTop(136)
            .setWidth(104)
            .setCaption("readonly")
            );
            
            f(
            (new u.Label)
            .host(t,"label1")
            .setLeft(32)
            .setTop(40)
            .setWidth(104)
            .setCaption("normal")
            );
            
            f(
            (new u.Label)
            .host(t,"label2")
            .setLeft(352)
            .setTop(40)
            .setWidth(104)
            .setCaption("password")
            );
            
            f(
            (new u.Div)
            .host(t,"div10")
            .setLeft(372)
            .setTop(453)
            .setWidth(260)
            .setHeight(30)
            );
            
            f(
            (new u.Group)
            .host(t,"group1")
            .setLeft(80)
            .setTop(490)
            .setWidth(500)
            .setCaption("mask input")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div14")
            .setLeft(233)
            .setTop(19)
            .setWidth(90)
            .setHeight(20)
            .setHtml("(111) 111-1111")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div13")
            .setLeft(20)
            .setTop(19)
            .setWidth(80)
            .setHeight(20)
            .setHtml("11/11/1111")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div15")
            .setLeft(20)
            .setTop(50)
            .setWidth(80)
            .setHeight(20)
            .setHtml("~1.11")
            );
            
            t.group1.attach(
            (new u.Div)
            .host(t,"div16")
            .setLeft(250)
            .setTop(50)
            .setWidth(80)
            .setHeight(20)
            .setHtml("(111) a-a *$*")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"iMask")
            .setLeft(100)
            .setTop(19)
            .setMask("11/11/1111")
            .setTabindex("17")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input18")
            .setLeft(330)
            .setTop(19)
            .setMask("(111) 111-1111")
            .setTabindex("18")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input19")
            .setLeft(100)
            .setTop(50)
            .setMask("~1.11")
            .setTabindex("19")
            );
            
            t.group1.attach(
            (new u.Input)
            .host(t,"input20")
            .setLeft(330)
            .setTop(50)
            .setMask("(111) a-a *$*")
            .setTabindex("20")
            );
            
            f(
            (new u.Div)
            .host(t,"div12")
            .setLeft(20)
            .setTop(450)
            .setHeight(26)
            .setHtml("Input valid (real time)")
            .setWidth(140)
            );
            
            f(
            (new u.Input)
            .host(t,"input4")
            .setLeft(144)
            .setTop(40)
            .setValue("normal")
            );
            
            f(
            (new u.Div)
            .host(t,"div11")
            .setLeft(80)
            .setTop(410)
            .setWidth(80)
            .setHeight(26)
            .setHtml("Input valid")
            );
            
            f(
            (new u.Div)
            .host(t,"div9")
            .setLeft(372)
            .setTop(413)
            .setWidth(260)
            .setHeight(30)
            );
            
            f(
            (new u.Input)
            .host(t,"input2")
            .setLeft(464)
            .setTop(40)
            .setValue("password")
            .setType("password")
            .setTabindex("2")
            );
            
            f(
            (new u.Input)
            .host(t,"input3")
            .setLeft(144)
            .setTop(72)
            .setValue("textarea")
            .setWidth(440)
            .setHeight(48)
            .setInputArea("textarea")
            .setTabindex("3")
            );
            
            f(
            (new u.Input)
            .host(t,"input6")
            .setLeft(144)
            .setTop(136)
            .setValue("readonly")
            .setReadonly(true)
            .setTabindex("4")
            );
            
            f(
            (new u.Input)
            .host(t,"input1")
            .setLeft(464)
            .setTop(130)
            .setValue("disabled")
            .setDisabled(true)
            .setTabindex("5")
            );
            
            f(
            (new u.Input)
            .host(t,"input7")
            .setLeft(192)
            .setTop(192)
            .setWidth(240)
            .setHeight(56)
            .setBorder(true)
            .setShadow(true)
            .setResizable(true)
            .setTips("border/resizable/shadow")
            .setTabindex("6")
            );
            
            f(
            (new u.Input)
            .host(t,"input8")
            .setLeft(144)
            .setTop(272)
            .setValueFormat("^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w\\.-]{2,4}$")
            .setTabindex("7")
            );
            
            f(
            (new u.Input)
            .host(t,"input10")
            .setLeft(144)
            .setTop(304)
            .setValueFormat("^\\w*$")
            .setTabindex("8")
            );
            
            f(
            (new u.Input)
            .host(t,"input12")
            .setLeft(144)
            .setTop(336)
            .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
            .setTabindex("9")
            );
            
            f(
            (new u.Input)
            .host(t,"input9")
            .setLeft(464)
            .setTop(272)
            .setValueFormat("^[a-zA-Z]*$")
            .setTabindex("10")
            );
            
            f(
            (new u.Input)
            .host(t,"input11")
            .setLeft(464)
            .setTop(304)
            .setValueFormat("^-?\\d\\d*$")
            .setTabindex("12")
            );
            
            f(
            (new u.Input)
            .host(t,"input13")
            .setLeft(464)
            .setTop(336)
            .setValueFormat("^([0-1][0-9])/([0-3][0-9])/([0-9]{4})$")
            .setTabindex("13")
            );
            
            f(
            (new u.Input)
            .host(t,"input5")
            .setLeft(370)
            .setTop(370)
            .setWidth(210)
            .setTabindex("14")
            .onFormatCheck("_input5_onformatcheck")
            );
            
            f(
            (new u.Input)
            .host(t,"input29")
            .setLeft(160)
            .setTop(410)
            .setWidth(210)
            .setTabindex("15")
            .setTips("input number")
            .setTipsErr("tipsErr : number only")
            .setTipsOK("Yeah")
            .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
            .setTipsBinder("div9")
            );
            
            f(
            (new u.Input)
            .host(t,"input15")
            .setLeft(160)
            .setTop(450)
            .setWidth(210)
            .setTabindex("16")
            .setTips("input number")
            .setTipsErr("tipsErr : number only")
            .setTipsOK("Yeah")
            .setValueFormat("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)")
            .setTipsBinder("div10")
            .setDynCheck(true)
            );
            
            return n;
            // ]]code created by designer
        },
        _input5_onformatcheck:function (profile, value) {
            return value=='allow';
        }
    }
});