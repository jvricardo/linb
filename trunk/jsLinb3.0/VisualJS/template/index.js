/*
* The default code is a com class (inherited from linb.Com)
*/
Class('{className}', 'linb.Com',{
    Instance:{
        autoDestroy:true,

        iniComponents:function(com, threadid){
        },
        events:{},
        customAppend:function(parent,subId,left,top){
            return false;
        },
        iniResource:function(com, threadid){
        },
        iniExComs:function(com, hreadid){
        }
        /*,
        properties:{},
        *for loading class dynamically
        //base Class for this com
        base:["linb.UI"],
        //requried class for this com
        required:[]
        */
    }
});