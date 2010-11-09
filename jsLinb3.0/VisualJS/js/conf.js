new function(){
    var _img_app=linb.getPath('img/','App.gif');
    var _img_widgets=linb.getPath('img/','widgets.gif');
    window.CONF={
        dftLang:'en',
        localeItems:[{"id":"en", "caption":"$VisualJS.en"}, {"id":"cn", "caption":"$VisualJS.cn"}, {"id":"tw", "caption":"$VisualJS.tw"}, {"id":"ja", "caption":"$VisualJS.ja"}],

        img_app:_img_app,
        img_widgets:_img_widgets,

        phpPath:linb.ini.appPath + 'request.php',
        testphpPath:linb.ini.appPath + 'debug.php',

        path_opendir:"../CodeSnip/Classes/",
        path_apidir:"../API/",
        
        
        prjPath:'projects/',
        requestKey:'VisualJS',
        requestKey2:'VisualJS2',

        path_link:"http://www.linb.net",
        //path_video:'http://linb.googlecode.com/files/video.html',
        path_simple:'UIBuilder.html',
        path_forum:'http://www.sigmawidgets.com/forum/',
        path_download:'http://code.google.com/p/linb/downloads/list',
        path_gpllicence:'http://www.gnu.org/licenses/lgpl-3.0-standalone.html',
        path_licence:'http://www.sigmawidgets.com/license.html',
        path_purchase:'http://www.sigmawidgets.com/buy_now2.html',
        path_video:"../video/simple.html",


        mapWidgets:{},
        widgets: [
            {id:'linb.Data',caption:'Data', group:true, image:'img/App.gif', imagePos:'-48px -48px', sub:[
                {id:'linb.DataBinder', caption:'DataBinder', image:'img/widgets.gif', imagePos:'-640px top', draggable:true}
            ]},
            {id:'linb.UI.absForm1',caption:'Simple Elements',group:true, image:_img_app, imagePos:'-48px -48px',sub:[
                {id:'linb.UI.Tag', caption:'Tag Element', image:_img_widgets, imagePos:'left top', draggable:true},
                {id:'linb.UI.Span', caption:'Span Element', image:_img_widgets, imagePos:'-544px -16px', draggable:true},
                {id:'linb.UI.Div', caption:'Div Element', image:_img_widgets, imagePos:'-544px top', draggable:true},

                {id:'linb.UI.SLabel', caption:'Simple Label', image:_img_widgets, imagePos:'-16px top', draggable:true},
                {id:'linb.UI.SButton', caption:'Simple Button', image:_img_widgets, imagePos:'-48px top', draggable:true/*, Appearances:['default','link','block']*/},
                {id:'linb.UI.SCheckBox', caption:'Simple CheckBox', image:_img_widgets, imagePos:'-96px top', draggable:true}
            ]},
            {id:'linb.UI.absForm',caption:'Form Elements',group:true, image:_img_app, imagePos:'-48px -48px',sub:[
                {id:'linb.UI.Label', caption:'Label', image:_img_widgets, imagePos:'-16px top', draggable:true},
                {id:'linb.UI.Link', caption:'Link', image:_img_widgets, imagePos:'-32px top', draggable:true},
                {id:'linb.UI.Button', caption:'Button', image:_img_widgets, imagePos:'-48px top', draggable:true/*, Appearances:['default','link','block']*/},
                {id:'linb.UI.CheckBox', caption:'CheckBox', image:_img_widgets, imagePos:'-96px top', draggable:true},
                {id:'linb.UI.Input', caption:'Input', image:_img_widgets, imagePos:'-112px top', draggable:true},
                {id:'linb.UI.List', caption:'List', image:_img_widgets, imagePos:'-192px top', draggable:true},
                {id:'linb.UI.ComboInput', caption:'ComboInput', image:_img_widgets, imagePos:'-144px top', draggable:true},
                {id:'linb.UI.RichEditor', caption:'RichEditor', image:_img_widgets, imagePos:'-128px top', draggable:true},
                {id:'linb.UI.ProgressBar', caption:'ProgressBar', image:_img_widgets, imagePos:'-608px top', draggable:true},
                {id:'linb.UI.Slider', caption:'Slider', image:_img_widgets, imagePos:'-63px -16px', draggable:true},
                {id:'linb.UI.TimePicker', caption:'TimePicker', image:_img_widgets, imagePos:'-240px top', draggable:true},
                {id:'linb.UI.DatePicker', caption:'DatePicker', image:_img_widgets, imagePos:'-256px top', draggable:true},
                {id:'linb.UI.ColorPicker', caption:'ColorPicker', image:_img_widgets, imagePos:'-272px top', draggable:true},
                {id:'linb.UI.RadioBox', caption:'RadioBox', image:_img_widgets, imagePos:'-208px top', draggable:true},
                {id:'linb.UI.StatusButtons', caption:'StatusButtons', image:_img_widgets, imagePos:'-16px -16px', draggable:true},
                {id:'linb.UI.Group', caption:'Group', image:_img_widgets, imagePos:'-224px top', draggable:true}
            ]},
            {id:'linb.UI.absContainer',caption:'Containers',group:true, image:_img_app, imagePos:'-48px -48px',sub:[
                {id:'linb.UI.Pane', caption:'Pane', image:_img_widgets, imagePos:'-288px top', draggable:true},
                {id:'linb.UI.Panel', caption:'Panel', image:_img_widgets, imagePos:'-672px top', draggable:true},
                {id:'linb.UI.Block', caption:'Block', image:_img_widgets, imagePos:'-304px top', draggable:true},
                {id:'linb.UI.Layout', caption:'Layout', image:_img_widgets, imagePos:'-336px top', draggable:true},

                {id:'linb.UI.Tabs', caption:'Tabs', image:_img_widgets, imagePos:'-352px top', draggable:true},

                {id:'linb.UI.Stacks', caption:'Stacks', image:_img_widgets, imagePos:'-368px top', draggable:true},
                {id:'linb.UI.ButtonViews', caption:'ButtonViews', image:_img_widgets, imagePos:'-384px top', draggable:true},
                {id:'linb.UI.Dialog', caption:'Dialog', image:_img_widgets, imagePos:'-320px top', draggable:true}
            ]},
            {id:'linb.UI.absNavigator',caption:'Navigators',group:true, image:_img_app, imagePos:'-48px -48px', sub:[
                {id:'linb.UI.PageBar', caption:'PageBar', image:_img_widgets, imagePos:'-48px -16px', draggable:true},

                {id:'linb.UI.PopMenu', caption:'PopMenu', image:_img_widgets, imagePos:'-400px top', draggable:true},
                {id:'linb.UI.MenuBar', caption:'MenuBar', image:_img_widgets, imagePos:'-416px top', draggable:true},
                {id:'linb.UI.ToolBar', caption:'ToolBar', image:_img_widgets, imagePos:'-432px top', draggable:true},
                {id:'linb.UI.IconList', caption:'IconList', image:_img_widgets, imagePos:'-384px top', draggable:true},
                {id:'linb.UI.Gallery', caption:'Gallery', image:_img_widgets, imagePos:'-448px top', draggable:true},
                {id:'linb.UI.TreeBar', caption:'TreeBar', image:_img_widgets, imagePos:'-464px top', draggable:true},
                {id:'linb.UI.TreeView', caption:'TreeView', image:_img_widgets, imagePos:'-464px -16px', draggable:true},
                {id:'linb.UI.TreeGrid', caption:'TreeGrid', image:_img_widgets, imagePos:'-480px top', draggable:true}
            ]},
            {id:'linb.UI.absMisc',caption:'Medias',group:true, image:_img_app, imagePos:'-48px -48px', sub:[
                {id:'linb.UI.Image', caption:'Image Element', image:_img_widgets, imagePos:'-624px top', draggable:true},

/*
                {id:'linb.UI.Media', caption:'Media', image:_img_widgets, imagePos:'-576px top', draggable:true},
                {id:'linb.UI.Shape', caption:'Shape', image:_img_widgets, imagePos:'-544px top', draggable:true},
*/                
                {id:'linb.UI.FusionChartFree', caption:'FusionChartFree', image:_img_widgets, imagePos:'-560px top', draggable:true},
                {id:'linb.UI.FusionChart3', caption:'FusionChart3', image:_img_widgets, imagePos:'-560px top', draggable:true}

            ]},
            {id:'linb.UI.absAdv',caption:'Advanced',group:true, image:_img_app, imagePos:'-48px -48px', sub:[
                {id:'linb.UI.TextEditor', caption:'TextEditor', image:_img_widgets, imagePos:'-128px top', draggable:true},
                {id:'linb.UI.Range', caption:'Range', image:_img_widgets, imagePos:'left -16px', draggable:true},
                {id:'linb.UI.Poll', caption:'Poll', image:_img_widgets, imagePos:'-208px -16px', draggable:true},
                {id:'linb.UI.FoldingList', caption:'FoldingList', image:_img_widgets, imagePos:'-32px -16px', draggable:true},
                {id:'linb.UI.Calendar', caption:'Calendar', image:_img_widgets, imagePos:'-496px top', draggable:true},
                {id:'linb.UI.TimeLine', caption:'TimeLine', image:_img_widgets, imagePos:'-528px top', draggable:true}
            ]}
        ],
        widgets_xprops:{
            'linb.UI.Div':['html','tabindex'],
            'linb.UI.Pane':['html','tabindex'],
            'linb.UI.Block':['html','tabindex'],
            'linb.UI.Tag':['tagKey','tabindex'],
            'linb.UI.SLabel':['caption','tabindex'],
            'linb.UI.Label':['caption','tabindex'],
            'linb.UI.Link':['caption','onClick','tabindex'],
            'linb.UI.SButton':['caption','onClick','tabindex'],
            'linb.UI.Button':['caption','onClick','tabindex'],
            'linb.UI.SCheckBox':['caption','onChecked','tabindex'],
            'linb.UI.CheckBox':['caption','onChecked','tabindex'],
            'linb.UI.Input':['value','tabindex'],
            'linb.UI.TextEditor':['value','tabindex'],
            'linb.UI.List':['items','value','onItemSelected','tabindex'],
            'linb.UI.ComboInput':['type','value','tabindex'],
            'linb.UI.ProgressBar':['value','tabindex'],
            'linb.UI.Range':['value','tabindex'],
            'linb.UI.RadioBox':['items','value','onItemSelected','tabindex'],
            'linb.UI.Poll':['Items','onGetContent','tabindex'],
            'linb.UI.Group':['caption','tabindex'],
            'linb.UI.Panel':['caption','tabindex'],
            'linb.UI.Layout':['type','items','tabindex'],
            'linb.UI.Tabs':['items','value','onItemSelected','tabindex'],
            'linb.UI.Stacks':['items','value','onItemSelected','tabindex'],
            'linb.UI.ButtonViews':['items','value','onItemSelected','tabindex'],
            'linb.UI.StatusButtons':['items','value','onItemClick','tabindex'],
            'linb.UI.FoldingList':['items','onGetContent','tabindex'],
            'linb.UI.IconList':['items','value','onItemSelected','tabindex'],
            'linb.UI.Dialog':['caption','tabindex'],
            'linb.UI.Gallery':['items','value','onItemSelected','tabindex'],
            'linb.UI.PageBar':['value','onClick','tabindex'],
            'linb.UI.PopMenu':['items','onMenuSelected'],
            'linb.UI.MenuBar':['items','onMenuSelected','tabindex'],
            'linb.UI.ToolBar':['items','onClick','tabindex'],
            'linb.UI.TreeBar':['items','value','onItemSelected','onGetContent','tabindex'],
            'linb.UI.TreeView':['items','value','onItemSelected','onGetContent','tabindex'],
            'linb.UI.TreeGrid':['header','rows','value','onClickCell','beforeComboPop','onRowSelected','onGetContent','tabindex'],
            'linb.UI.Image':['src','tabindex'],
            'linb.UI.TimeLine':['onGetContent','tabindex'],
            'linb.UI.FusionChartFree':['tabindex','onFCClick'],
            'linb.UI.FusionChart3':['tabindex','onFCClick']
        },
        ComFactoryProfile:{
            about:{
                cls:'VisualJS.About'
            },
            addFile:{
                cls:'VisualJS.AddFile'
            },
            delFile:{
                cls:'VisualJS.DelFile'
            },
            prjPro:{
                cls:'VisualJS.ProjectPro'
            },
            prjSel:{
                cls:'VisualJS.ProjectSelector'
            },
            
            objEditor:{
                cls:'VisualJS.ObjectEditor'
            } 
        }
    };
    var fun=function(items,hash){
        var self=arguments.callee;
        _.arr.each(items,function(o){
            hash[o.id]=o;
            if(o.sub && o.sub.length){
                self(o.sub, hash);
                o.tips='$VisualJS.designer.openwidgets';
            }else
                o.tips='$VisualJS.designer.dragwidget';
        });
    };
    CONF.mapWidgets = {};
    fun(CONF.widgets, CONF.mapWidgets);
    linb.setAppLangKey("VisualJS");
};