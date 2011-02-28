Class('FormReader', 'linb.Com',{
    Instance:{
        customAppend : function(parent, subId, left, top){
            var ns=this,
                para={
                    action:'openForm',
                    formId:ARGS.formId
                };
            if(ARGS.recordId){
                para.recordId=ARGS.recordId;
            }

            _.observableRun(function(threadid){
                linb.request(CONF.phpPath, {
                    key:CONF.requestKey,
                    para:para
                },function(txt){
                    var obj = typeof txt=='string'?_.unserialize(txt):txt;
                    if(!obj.error){
                        obj=obj.data;
                        try{
                            var fields= (_.isSet(obj.formFields) ? _.unserialize(obj.formFields) :null)||{},
                                formCode=obj.formCode,
                                fun = new Function([], formCode),
                                host={_ctrlpool:{}},
                                rootelems=fun.call(host),
                                arr=[];
                            if(fields){
                                _.each(host._ctrlpool,function(prf){
                                    if(prf.boxing()["linb.absValue"] && !prf.boxing()["linb.UI.Tabs"]){
                                        // fill values
                                        if(_.isDefined(fields[prf.alias])){
                                            prf.boxing().setValue(fields[prf.alias]);
                                        }
                                        prf.boxing().setDisabled(true);
                                    }
                                });
                                
                            }
                            
                            // attach UI
                            ns.mainPane.append(linb.UI.pack(rootelems,false));
                            // show UI
                            (parent||linb('body')).append(ns.getUIComponents(),subId);

                        }catch(e){
                            linb.message(e.message);
                        }

                    }else
                        linb.message(obj.error.message);
                },function(txt){
                    linb.message(txt);
                },threadid,{method:'post'});
            }); 
        },        
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            append(
                (new linb.UI.Pane)
                .setHost(host,"mainPane")
                .setDock("fill")
            );
            return children;
            // ]]code created by jsLinb UI Builder
        }
    }
});