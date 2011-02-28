// [[code created by jsLinb UI Builder
var host=this, children=[], append=function(child){children.push(child.get(0))};

append(
    (new linb.UI.Tabs)
    .setHost(host,"ctl_tabs1")
    .setItems([{"id":"a", "caption":"page1", "image":"img/demo.gif"}, {"id":"b", "caption":"page2", "image":"img/demo.gif"}, {"id":"c", "caption":"page3", "image":"img/demo.gif"}])
    .setValue("a")
);

host.ctl_tabs1.append(
    (new linb.UI.ColorPicker)
    .setHost(host,"ctl_colorpicker1")
    .setLeft(150)
    .setTop(150)
, 'b');

host.ctl_tabs1.append(
    (new linb.UI.List)
    .setHost(host,"ctl_list1")
    .setItems([{"id":"a", "caption":"item a", "image":"img/demo.gif"}, {"id":"b", "caption":"item b", "image":"img/demo.gif"}, {"id":"c", "caption":"item c", "image":"img/demo.gif"}, {"id":"d", "caption":"item d", "image":"img/demo.gif", "disabled":true}])
    .setLeft(440)
    .setTop(170)
    .setValue(null)
, 'b');

host.ctl_tabs1.append(
    (new linb.UI.Input)
    .setHost(host,"ctl_input1")
    .setLeft(190)
    .setTop(80)
    .setLabelCaption("ctl_input1")
, 'b');

host.ctl_tabs1.append(
    (new linb.UI.Input)
    .setHost(host,"ctl_input2")
    .setLeft(260)
    .setTop(80)
    .setLabelCaption("ctl_input2")
, 'c');

host.ctl_tabs1.append(
    (new linb.UI.Slider)
    .setHost(host,"ctl_slider1")
    .setLeft(250)
    .setTop(210)
    .setIsRange(false)
    .setValue("0")
, 'a');

host.ctl_tabs1.append(
    (new linb.UI.TimePicker)
    .setHost(host,"ctl_timepicker3")
    .setLeft(310)
    .setTop(350)
, 'a');

host.ctl_tabs1.append(
    (new linb.UI.RadioBox)
    .setHost(host,"ctl_radiobox1")
    .setItems([{"id":"a", "caption":"item a", "image":"img/demo.gif"}, {"id":"b", "caption":"item b", "image":"img/demo.gif"}, {"id":"c", "caption":"item c", "image":"img/demo.gif"}, {"id":"d", "caption":"item d", "image":"img/demo.gif", "disabled":true}])
    .setLeft(550)
    .setTop(60)
, 'a');

host.ctl_tabs1.append(
    (new linb.UI.Input)
    .setHost(host,"ctl_input3")
    .setLeft(130)
    .setTop(90)
    .setLabelCaption("ctl_input3")
, 'a');

return children;
// ]]code created by jsLinb UI Builder