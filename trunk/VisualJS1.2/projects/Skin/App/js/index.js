
Class('App', 'linb.Com',{
    Instance:{
        //base Class for linb.Page
        base:["linb.UI"],
        //requried class for the App
        //"linb.UI.Tips","linb.UI.Resizer","linb.UI.Edge","linb.UI.Shadow"
        required:["linb.UI.ComboInput","linb.UI.Panel","linb.UI.Button","linb.UI.Div"],
        iniComponents:function(){
            // [[code created by designer, don't change it manually
            var t=this, n=t._nodes=[], u=linb.UI, f=function(c){n.push(c.get(0))};
            
            f(
            (new u.ComboInput)
            .host(t,"comboinput2")
            .setValue("default")
            .setLeft(230)
            .setTop(210)
            .setItems([{"id":"default","caption":"default skin"},{"id":"a","caption":"skin a"},{"id":"b","caption":"skin b"},{"id":"none","caption":"no skin"}])
            .setReadonly(true)
            .afterValueUpdated("_comboinput2_aftervalueupdated")
            );
            
            f(
            (new u.Panel)
            .host(t,"panel9")
            .setDomId("panelId")
            .setLeft(190)
            .setTop(40)
            .setWidth(190)
            );
            
            t.panel9.attach(
            (new u.Button)
            .host(t,"button5")
            .setDomId("buttonId")
            .setLeft(40)
            .setTop(40)
            .setCaption("button5")
            );
            
            f(
            (new u.Div)
            .host(t,"div19")
            .setLeft(140)
            .setTop(210)
            .setWidth(80)
            .setHeight(40)
            .setHtml("Change skin")
            );
            
            return n;
            // ]]code created by designer
        },
        _onready:function () {
            SPA=this;
            SPA.ChangeSkin('default');
        },
        ChangeSkin:function(skin){
            if(SPA.skinKey)
                linb.css.remove('title', SPA.skinKey);
            if(skin){
                SPA.skinKey = skin;
                linb.css.include(linb.getPath('App','css.css','css/'+skin+'/'),skin,false);
            }
        },
        events:{"onReady":"_onready"},
        _comboinput2_aftervalueupdated:function (profile, oldValue, newValue, showValue) {
            if(newValue=='none')
                SPA.ChangeSkin();
            else
                SPA.ChangeSkin(newValue);
        }
    }
});