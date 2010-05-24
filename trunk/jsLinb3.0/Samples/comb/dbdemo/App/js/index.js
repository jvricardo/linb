
Class('App', 'linb.Com',{
    Instance:{
        //base Class for this com
        base:["linb.UI"], 
        required:["linb.UI.Block", "linb.UI.TreeGrid", "linb.UI.Group", "linb.UI.Input", "linb.UI.Button", "linb.UI.Label"], 
        properties:{}, 
        events:{"onReady":"_onready", "onRender":"_onrender"}, 
        iniComponents:function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append((new linb.UI.Block)
                .host(host,"block3")
                .setLeft(50)
                .setTop(50)
                .setWidth(260)
                .setHeight(290)
                .setBorder(true)
            );
            
            host.block3.append((new linb.UI.TreeGrid)
                .host(host,"treegrid")
                .setRowHandler(false)
                .setHeader([{"id":"key", "caption":"key", "width":80, "type":"label"}, {"id":"value", "caption":"value", "width":160, "type":"label"}])
                .afterRowActive("_treegrid_afterrowactive")
            );
            
            append((new linb.UI.Group)
                .host(host,"group1")
                .setLeft(360)
                .setTop(80)
                .setWidth(260)
                .setHeight(120)
                .setCaption("update")
                .setToggleBtn(false)
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"iKey")
                .setDisabled(true)
                .setLeft(70)
                .setTop(10)
                .setWidth(180)
            );
            
            host.group1.append((new linb.UI.Input)
                .host(host,"iValue")
                .setLeft(70)
                .setTop(40)
                .setWidth(180)
            );
            
            host.group1.append((new linb.UI.Button)
                .host(host,"btnU")
                .setDisabled(true)
                .setLeft(70)
                .setTop(70)
                .setWidth(180)
                .setCaption("Update")
                .onClick("_btnu_onclick")
            );
            
            host.group1.append((new linb.UI.Label)
                .host(host,"label23")
                .setLeft(10)
                .setTop(10)
                .setWidth(50)
                .setCaption("key")
            );
            
            host.group1.append((new linb.UI.Label)
                .host(host,"label24")
                .setLeft(10)
                .setTop(40)
                .setWidth(50)
                .setCaption("value")
            );
            
            append((new linb.UI.Group)
                .host(host,"group2")
                .setLeft(360)
                .setTop(220)
                .setWidth(260)
                .setHeight(120)
                .setCaption("create")
                .setToggleBtn(false)
            );
            
            host.group2.append((new linb.UI.Input)
                .host(host,"iKey2")
                .setLeft(70)
                .setTop(10)
                .setWidth(180)
            );
            
            host.group2.append((new linb.UI.Input)
                .host(host,"iValue2")
                .setLeft(70)
                .setTop(40)
                .setWidth(180)
            );
            
            host.group2.append((new linb.UI.Button)
                .host(host,"btnC")
                .setLeft(70)
                .setTop(70)
                .setWidth(180)
                .setCaption("Add a Row")
                .onClick("_btnc_onclick")
            );
            
            host.group2.append((new linb.UI.Label)
                .host(host,"label3")
                .setLeft(10)
                .setTop(10)
                .setWidth(50)
                .setCaption("key")
            );
            
            host.group2.append((new linb.UI.Label)
                .host(host,"label4")
                .setLeft(10)
                .setTop(40)
                .setWidth(50)
                .setCaption("value")
            );
            
            append((new linb.UI.Button)
                .host(host,"btnD")
                .setDisabled(true)
                .setLeft(360)
                .setTop(50)
                .setWidth(260)
                .setCaption("Delete")
                .onClick("_btnd_onclick")
            );
            
            return children;
            // ]]code created by jsLinb UI Builder
        }, 
        
        
        _onready:function (com, threadid) {
            SPA=this;
        }, 
        //to show message
        popMsg:function(msg){
            linb.UI.Dialog.pop(msg);
        }, 
        //to interact with server
        request:function(hash, callback, onStart, onEnd, file){
            _.tryF(onStart);
            linb.Thread.observableRun(function(threadid){
                var data={key:'DBProcess',para:hash}, options;
                if(file){
                    data.file=file;
                    options={method:'post'};
                }
                linb.request('request.php', data, function(rsp){
                    var obj;
                    if(typeof rsp=='string')
                        obj=_.unserialize(rsp);
                    else obj=rsp;
                    if(obj){
                        if(!obj.error)
                            _.tryF(callback,[obj]);
                        else
                            SPA.popMsg(_.serialize(obj.error));
                    }else
                        SPA.popMsg(_.serialize(rsp));
                    _.tryF(onEnd);
                },function(rsp){
                    SPA.popMsg(_.serialize(rsp));
                    _.tryF(onEnd);
                }, threadid,options)
            });
        }, 
        _onrender:function (com, threadid) {
            SPA._refreshList();
        }, 
        _treegrid_afterrowactive:function (profile, row) {
            SPA.$row=row;

            SPA.iKey.resetValue(row.cells[0].value);
            SPA.iValue.resetValue(row.cells[1].value);

            SPA.btnD.setDisabled(false);
            SPA.btnU.setDisabled(false);
        }, 
        _btnc_onclick:function (profile, e, src, value) {
            var key=SPA.iKey2.getUIValue(),
                value=SPA.iValue2.getUIValue();
            if(!key || !value){
                alert('Specify key and value please!');
                return;
            }
            SPA.iKey2.resetValue();
            SPA.iValue2.resetValue();
            SPA.request({action:'create', key:key, value:value},
            function(rsp){
                if(rsp.data=='ok'){
                    SPA._refreshList(key);
                }
            });
        }, 
        _btnd_onclick:function (profile, e, src, value) {
            if(!SPA.$row)return;

            SPA.request({action:'delete', key:SPA.$row.cells[0].value},
            function(rsp){
                if(rsp.data=='ok')
                    SPA._refreshList();
            },function(){},function(){
                delete SPA.$row;
                SPA.btnD.setDisabled(true);
                SPA.btnU.setDisabled(true);
            });
        }, 
        _btnu_onclick:function (profile, e, src, value) {
            if(!SPA.$row)return;
            var cells=SPA.$row.cells;

            var key=cells[0].value,
                value=SPA.iValue.getUIValue();
            if(value==cells[1].value){
                alert('Modify the value first!');
                return;
            }
            SPA.request({action:'update', key:key, value:value},
            function(rsp){
                if(rsp.data=='ok')
                    SPA.treegrid.updateCell(cells[1],value,false);
            });
        }, 
        _refreshList:function(rowId){
            SPA.treegrid.setRows([]);
            SPA.request({
                    action:'getlist'
                },
                function(obj){
                    _.arr.each(obj.data,function(o,i){
                        obj.data[i]={cells:o,id:o[0]};
                    });
                    SPA.treegrid.setRows(obj.data);
                    if(!rowId){
                        var rows=SPA.treegrid.getRows();
                        if(rows.length)
                            rowId=rows[0].id;
                    }
                    if(rowId)
                        SPA.treegrid.setActiveRow(rowId);
                }
            );
        }
    }
});