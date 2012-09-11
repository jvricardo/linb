// 默认的代码是一个从 linb.Com 派生来的的类
Class('App', 'linb.Com',{
    // 要确保键值对的值不能包含外部引用
    Instance:{
        // 实例的属性要在此函数中初始化，不要直接放在Instance下
        initialize : function(){
            // 本Com是否随着第一个控件的销毁而销毁
            this.autoDestroy = true;
            // 初始化属性
            this.properties = {};
        },
        // 初始化内部控件（通过界面编辑器生成的代码，大部分是界面控件）
        // *** 如果您不是非常熟悉linb框架，请慎重手工改变本函数的代码 ***
        iniComponents : function(){
            // [[code created by jsLinb UI Builder
            var host=this, children=[], append=function(child){children.push(child.get(0))};
            
            append(
                (new linb.UI.Stacks)
                .setHost(host,"ctl_stacks1")
                .setItems([{"id":"a", "caption":"日程管理", "image":"img/demo.gif"}, {"id":"b", "caption":"应用程序", "image":"img/demo.gif"}, {"id":"c", "caption":"统计图表", "image":"img/demo.gif"}, {"id":"d", "caption":"关于我们", "image":"img/demo.gif"}])
                .setValue("d")
                .setCustomStyle({"HANDLE":"text-align:center"})
            );
            
            host.ctl_stacks1.append(
                (new linb.UI.List)
                .setHost(host,"ctl_list7")
                .setDirtyMark(false)
                .setItems([{"id":"a", "caption":"15:00 和龙老板谈项目", "image":"img/demo.gif"}, {"id":"b", "caption":"15:30 签合同， 别忘记了拿项目的方案说明书", "image":"img/demo.gif"}, {"id":"c", "caption":"17:00 答谢晚宴", "image":"img/demo.gif"}, {"id":"d", "caption":"19:00 下班，回家", "image":"img/demo.gif"}])
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
                .setHtml("<h1>关于我们</h1><p>北京龙博中科软件有限公司，是一家致力于企业级前端，Web表现层，Web控件等研发、销售、培训的高新技术企业，立足北京面向全国，致力于为软件开发业企业提供行业解决方案，并为软件开发厂商提供优良的中间件产品。</p><h1>联系我们 </h1><p> 地址：北京市海淀区西直门东北200米远洋风景9栋 <br> 邮编： 100976  <br>电话：010-82293885</p>")
            , "d");
            
            return children;
            // ]]code created by jsLinb UI Builder
        },
        // 加载其他Com可以用本函数
        iniExComs : function(com, threadid){
        },
        // 可以自定义哪些界面控件将会被加到父容器中
        customAppend : function(parent, subId, left, top){
            // "return false" 表示默认情况下所有的第一层内部界面控件会被加入到父容器
            return false;
        },
        // Com本身的事件映射
        events : {}
    }
});
