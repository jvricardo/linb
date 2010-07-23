// The default code is a com class (inherited from linb.Com)
Class('App.linb_UI_TreeView', 'linb.Com',{
    // Ensure that all the value of "key/value pair" does not refer to external variables
    Instance:{
        // To initialize instance(e.g. properties)
        initialize : function(){
            this.autoDestroy = true;
        },
        // To initialize internal components (mostly UI controls)
        // *** If you're not a skilled, dont modify this function manually ***
        iniComponents : function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append(
                (new linb.UI.Panel)
                .setHost(host,"ctl_panel3")
                .setDock("none")
                .setLeft(20)
                .setTop(40)
                .setWidth(260)
                .setHeight(260)
                .setZIndex(1)
                .setCaption("TreeView Demo")
            );
            
            host.ctl_panel3.append(
                (new linb.UI.TreeView)
                .setHost(host,"ctl_treeview1")
                .setItems([{"id":"folder1", "caption":"folder1", "sub":true}, {"id":"folder2", "caption":"folder2", "sub":true}, {"id":"file1", "caption":"file1"}])
                .onGetContent("_ctl_treeview1_ongetcontent")
                .onItemSelected("_ctl_treeview1_onitemselected")
                .afterFold("_ctl_treeview1_afterfold")
                .afterExpend("_ctl_treeview1_afterexpend")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        // Give a chance to load other com
        iniExComs : function(com, threadid){
        },
        // Give a chance to determine which UI controls will be appended to parent container
        customAppend : function(parent, subId, left, top){
            // "return false" will cause all the internal UI controls will be added to the parent panel
            return false;
        },
        // This instance's events
        events : {},
        _ctl_treeview1_ongetcontent : function (profile, item, callback) {
            var ns = this,
                uictrl = profile.boxing();
            var id="temp"+_();
           
            // to simulate asyn ajax loading
            _.asyRun(function(){
                // remove first
                uictrl.removeItems([id]);
                var items=[];
                // two files
                items.push({id:'file_'+_.id(), caption:'file_'+_.id()});
                items.push({id:'file_'+_.id(), caption:'file_'+_.id()});
                // a folder
                items.push({id:item.id+'_1', caption:item.id+'_1', sub:true});
                items.push({id:item.id+'_2', caption:item.id+'_2', sub:true});
                items.push({id:item.id+'_3', caption:item.id+'_3', sub:true});
                // add new sub items
                uictrl.insertItems(items, item.id);
            },300);

            // for showing loading icon
            return [{id:id, caption:"Loading...", image:linb.ini.img_busy}];
        },
        _ctl_treeview1_onitemselected : function (profile, item, src) {
           linb.message(item.id + " was selected!");
        },
        _ctl_treeview1_afterfold : function (profile, item) {
            linb.message(item.id + " is fold!");
        },
        _ctl_treeview1_afterexpend : function (profile, item) {
             linb.message(item.id + " is expand!");
        }
    }
});