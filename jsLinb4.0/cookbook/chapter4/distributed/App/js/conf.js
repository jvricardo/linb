CONF={
    //Dynamic Injector Mechanism for linb.ComFactory
    ComFactoryProfile:{
        module1:{
            cls:'App.Module1',
            children:{
                tag_SubModule1:'submodule1'
            }
        },
        submodule1:{
            cls:'App.SubModule1'
        }
    }
};