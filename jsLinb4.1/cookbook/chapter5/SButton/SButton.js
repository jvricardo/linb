Class("linb.Template.SButton","linb.Template",{
    Constructor:function(template,properties,events,domId){
        var self=this,arr=_.toArr(arguments);
        arr[0]=arr[0]||'<span [event] class="linbt-sbtn"><span class="linbt-sbtn-btn"><span class="linbt-sbtn-btni"><span class="linbt-sbtn-btnc"><a class="linbt-sbtn-focus" href="javascript:;">{caption}</a></span></span></span></span>';
        arr[2]=arr[2]||{
            "root":{
                onMouseover:function(profile,e,src){
                    linb.use(src).tagClass('-mouseover');
                },
                onMouseout:function(profile,e,src){
                    linb.use(src).tagClass('-mouseover',false);
                    linb.use(src).tagClass('-mousedown',false);
                },
                onMousedown:function(profile,e,src){
                    linb.use(src).tagClass('-mousedown');
                },
                onMouseup:function(profile,e,src){
                    linb.use(src).tagClass('-mousedown',false);
                },
                onClick:function(profile,e,src){
                    _.tryF(profile.handler_onClick,arguments,profile.host||profile)
                }
            }
        };
        return arguments.callee.upper.apply(self,arr);
    },
    Instance:{
        setCaption:function(caption){
            return this.setProperties('caption',caption);
        },
        onClick:function(fun){
            this.handler_onClick=fun;
            return this;
        }
    }
});
