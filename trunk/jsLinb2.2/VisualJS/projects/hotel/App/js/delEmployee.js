/*
* The default code is a com class (inherited from linb.Com)
*/
Class('Specify_Class_Name_Here', 'linb.Com',{
    Instance:{
        //base Class for this com
        base:["linb.UI"],
        //requried class for this com
        required:[],

        properties:{},
        events:{},
        iniResource:function(com, threadid){
        },
        iniComponents:function(com, threadid){
        },
        iniExComs:function(com, hreadid){
        }
    }
});