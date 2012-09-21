// The default code is a com class (inherited from linb.Com)
Class('{className}', 'linb.Com',{
    // Ensure that all the value of "key/value pair" does not refer to external variables
    Instance:{
        // To initialize instance(e.g. properties)
        initialize : function(){
            // To determine whether or not the com will be destroyed, when the first UI control be destroyed
            this.autoDestroy = true;
            // To initialize properties
            this.properties = {};
        },
        // To initialize internal components (mostly UI controls)
        // *** If you're not a skilled, dont modify this function manually ***
        iniComponents : function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append(
                (new linb.UI.Stacks)
                .setHost(host,"ctl_stacks1")
                .setItems([{"id":"a", "caption":"�ճ̹���", "image":"img/demo.gif"}, {"id":"b", "caption":"Ӧ�ó���", "image":"img/demo.gif"}, {"id":"c", "caption":"ͳ��ͼ��", "image":"img/demo.gif"}, {"id":"d", "caption":"��������", "image":"img/demo.gif"}])
                .setValue("d")
                .setCustomStyle({"HANDLE":"text-align:center"})
            );
            
            host.ctl_stacks1.append(
                (new linb.UI.List)
                .setHost(host,"ctl_list7")
                .setDirtyMark(false)
                .setItems([{"id":"a", "caption":"15:00 �����ϰ�̸��Ŀ", "image":"img/demo.gif"}, {"id":"b", "caption":"15:30 ǩ��ͬ�� ������������Ŀ�ķ���˵����", "image":"img/demo.gif"}, {"id":"c", "caption":"17:00 ��л����", "image":"img/demo.gif"}, {"id":"d", "caption":"19:00 �°࣬�ؼ�", "image":"img/demo.gif"}])
                .setDock("fill")
                .setValue("a")
                .setCustomStyle({"ITEM":"font-size:14pt"})
            , "a");
            
            host.ctl_stacks1.append(
                (new linb.UI.IconList)
                .setHost(host,"ctl_iconlist2")
                .setDirtyMark(false)
                .setItems([{"id":"a", "caption":"item a", "image":"img/demo.gif"}, {"id":"b", "caption":"item b", "image":"img/demo.gif"}, {"id":"c", "caption":"item c", "image":"img/demo.gif"}, {"id":"d", "caption":"item d", "image":"img/demo.gif", "disabled":true}])
                .setDock("fill")
                .setItemWidth(64)
                .setItemHeight(64)
                .setValue("a")
            , "b");
            
            host.ctl_stacks1.append(
                (new linb.UI.FusionChart3)
                .setHost(host,"ctl_fusionchart31")
                .setDock("fill")
                .setSrc("FusionCharts3/Charts/Column2D.swf")
                .setParameters({})
                .setFlashvars({})
                .setFC_attrs({"bgcolor":"transparent", "quality":"high", "allowScriptAccess":"always", "debugMode":"false", "registerWithJS":"1", "scaleMode":"noScale"})
                .setFC_labels({"PBarLoadingText":"Loading Chart. Please Wait", "XMLLoadingText":"Retrieving Data. Please Wait", "ParsingDataText":"Reading Data. Please Wait", "ChartNoDataText":"No data to display", "RenderingChartText":"Rendering Chart. Please Wait", "LoadDataErrorText":"Error in loading data", "InvalidXMLText":"Invalid XML data"})
                .setFC_data({"chart":{"@palette":"2", "@caption":"Unit Sales", "@xAxisName":"Month", "@yAxisName":"Units", "@showValues":"0", "@decimals":"0", "@formatNumberScale":"0", "@useRoundEdges":"1", "set":[{"@label":"Jan", "@value":"462"}, {"@label":"Feb", "@value":"857"}, {"@label":"Mar", "@value":"671"}, {"@label":"Apr", "@value":"494"}, {"@label":"May", "@value":"761"}, {"@label":"Jun", "@value":"960"}]}})
            , "c");
            
            host.ctl_stacks1.append(
                (new linb.UI.Pane)
                .setHost(host,"ctl_pane6")
                .setDock("width")
                .setHeight(260)
                .setPosition("relative")
                .setHtml("<h1>��������</h1><p>���������п�������޹�˾����һ����������ҵ��ǰ�ˣ�Web���ֲ㣬Web�ؼ����з������ۡ���ѵ�ĸ��¼�����ҵ�����㱱������ȫ����������Ϊ�������ҵ��ҵ�ṩ��ҵ�����������Ϊ������������ṩ�������м����Ʒ��</p><h1>��ϵ���� </h1><p> ��ַ�������к�������ֱ�Ŷ���200��Զ��羰9�� <br> �ʱࣺ 100976  <br>�绰��010-82293885</p>")
            , "d");
            
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
        events : {}
    }
});
