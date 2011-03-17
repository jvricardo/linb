#!/bin/bash
# build_visualjs.sh

#converted from batch (.bat) script by CRGreen

libPath=../../
compressTool=${libPath}tools/yuicompressor.jar
appPath=../
releasePath=../release/
version=3.0/
appname=VisualJS/
apiName=visualjs.js

# this tests for non existence of directory and non existence of file named 'release' in parent directory
# first expression specifies directory, 2nd exp. specifies file, stripping '/' from end
if [[ ! -d "$releasePath" && ! -f "${releasePath%/*}" ]]; then

# for those slow machines/impatient users
echo -e '\nPlease wait while I do some good stuff ...\n'

mkdir $releasePath
mkdir ${releasePath}${version}
mkdir ${releasePath}${version}${appname}
mkdir ${releasePath}${version}${appname}js
mkdir ${releasePath}${version}jsLinb
mkdir ${releasePath}${version}jsLinb/js
mkdir ${releasePath}${version}jsLinb/Locale
mkdir ${releasePath}${version}jsLinb/appearance

cp -R ${libPath}jsLinb/appearance/ ${releasePath}${version}jsLinb/appearance/
cp -R ${libPath}jsLinb/Locale/ ${releasePath}${version}jsLinb/Locale/

cp  ${libPath}jsLinb/ondrag.gif ${releasePath}${version}jsLinb/
cp  ${libPath}jsLinb/bg.gif ${releasePath}${version}jsLinb/
cp  ${libPath}jsLinb/busy.gif ${releasePath}${version}jsLinb/

cp -R ${appPath}Locale/ ${releasePath}${version}Locale/
cp -R ${appPath}img/ ${releasePath}${version}img/
cp -R ${appPath}css/ ${releasePath}${version}css/

cp ${appPath}${apiName} ${releasePath}${version}${apiName}

cat ${libPath}jsLinb/js/linb.js ${libPath}jsLinb/js/Event.js ${libPath}jsLinb/js/Date.js ${libPath}jsLinb/js/CSS.js ${libPath}jsLinb/js/Dom.js ${libPath}jsLinb/js/Template.js ${libPath}jsLinb/js/Com.js ${libPath}jsLinb/js/Cookies.js ${libPath}jsLinb/js/XML.js ${libPath}jsLinb/js/DragDrop.js ${libPath}jsLinb/js/History.js ${libPath}jsLinb/js/ComFactory.js ${libPath}jsLinb/Locale/en.js ${libPath}jsLinb/js/Debugger.js ${appPath}js/conf.js > linb.js

cat ${libPath}jsLinb/js/UI.js ${libPath}jsLinb/js/Coder.js ${libPath}jsLinb/js/Tips.js ${libPath}jsLinb/js/UI/Border.js ${libPath}jsLinb/js/UI/Shadow.js ${libPath}jsLinb/js/UI/Resizer.js ${libPath}jsLinb/js/UI/Image.js ${libPath}jsLinb/js/UI/Flash.js ${libPath}jsLinb/js/UI/Block.js ${libPath}jsLinb/js/UI/Label.js ${libPath}jsLinb/js/UI/ProgressBar.js ${libPath}jsLinb/js/UI/Button.js ${libPath}jsLinb/js/UI/CheckBox.js ${libPath}jsLinb/js/UI/Input.js ${libPath}jsLinb/js/UI/ComboInput.js ${libPath}jsLinb/js/UI/RichEditor.js ${libPath}jsLinb/js/UI/Group.js ${libPath}jsLinb/js/UI/ColorPicker.js ${libPath}jsLinb/js/UI/DatePicker.js ${libPath}jsLinb/js/UI/TimePicker.js ${libPath}jsLinb/js/UI/TimeLine.js ${libPath}jsLinb/js/UI/List.js ${libPath}jsLinb/js/UI/Gallery.js ${libPath}jsLinb/js/UI/IconList.js ${libPath}jsLinb/js/UI/Poll.js ${libPath}jsLinb/js/UI/Panel.js ${libPath}jsLinb/js/UI/PageBar.js ${libPath}jsLinb/js/UI/Tabs.js ${libPath}jsLinb/js/UI/Stacks.js ${libPath}jsLinb/js/UI/ButtonViews.js ${libPath}jsLinb/js/UI/RadioBox.js ${libPath}jsLinb/js/UI/StatusButtons.js ${libPath}jsLinb/js/UI/FoldingList.js ${libPath}jsLinb/js/UI/TreeBar.js ${libPath}jsLinb/js/UI/TreeView.js ${libPath}jsLinb/js/UI/PopMenu.js ${libPath}jsLinb/js/UI/MenuBar.js ${libPath}jsLinb/js/UI/ToolBar.js ${libPath}jsLinb/js/UI/Range.js ${libPath}jsLinb/js/UI/Layout.js ${libPath}jsLinb/js/UI/ColLayout.js ${libPath}jsLinb/js/UI/TreeGrid.js ${libPath}jsLinb/js/UI/Slider.js ${libPath}jsLinb/js/UI/Dialog.js ${libPath}jsLinb/js/UI/FusionChartFree.js ${libPath}jsLinb/js/UI/FusionChart3.js ${libPath}jsLinb/js/UI/TextEditor.js ${libPath}jsLinb/js/UI/Calendar.js ${appPath}Locale/en.js ${appPath}/js/exLinb/AdvResizer.js ${appPath}codemirror/js/codemirror.js ${appPath}js/index.js ${appPath}js/CodeEditor.js ${appPath}js/PageEditor.js ${appPath}js/ClassTool.js ${appPath}js/JSEditor.js ${appPath}js/EditorTool.js ${appPath}js/ObjectEditor.js ${appPath}js/ProjectPro.js ${appPath}js/ProjectSelector.js ${appPath}js/Designer.js ${appPath}js/AddFile.js ${appPath}js/DelFile.js ${appPath}js/About.js ${appPath}js/UIDesigner.js ${appPath}js/OpenFile.js ${appPath}js/FAndR.js ${appPath}js/JumpTo.js ${appPath}js/ServiceTester.js > index.js


cat ${appPath}codemirror/js/util.js ${appPath}codemirror/js/stringstream.js ${appPath}codemirror/js/select.js ${appPath}codemirror/js/undo.js ${appPath}codemirror/js/editor.js ${appPath}codemirror/js/tokenize.js ${appPath}codemirror/js/tokenizejavascript.js ${appPath}codemirror/js/parsejavascript.js > ${appPath}codemirror/js.js
cat ${appPath}codemirror/js/util.js ${appPath}codemirror/js/stringstream.js ${appPath}codemirror/js/select.js ${appPath}codemirror/js/undo.js ${appPath}codemirror/js/editor.js ${appPath}codemirror/js/tokenize.js ${appPath}codemirror/js/parsecss.js > ${appPath}codemirror/css.js
cat ${appPath}codemirror/js/util.js ${appPath}codemirror/js/stringstream.js ${appPath}codemirror/js/select.js ${appPath}codemirror/js/undo.js ${appPath}codemirror/js/editor.js ${appPath}codemirror/js/tokenize.js ${appPath}codemirror/js/parsexml.js ${appPath}codemirror/js/parsecss.js ${appPath}codemirror/contrib/php/js/tokenizephp.js ${appPath}codemirror/js/tokenizejavascript.js ${appPath}codemirror/js/parsejavascript.js ${appPath}codemirror/contrib/php/js/parsephp.js ${appPath}codemirror/contrib/php/js/parsephphtmlmixed.js > ${appPath}codemirror/php.js
cat ${appPath}codemirror/js/util.js ${appPath}codemirror/js/stringstream.js ${appPath}codemirror/js/select.js ${appPath}codemirror/js/undo.js ${appPath}codemirror/js/editor.js ${appPath}codemirror/js/tokenize.js ${appPath}codemirror/js/parsexml.js ${appPath}codemirror/js/parsecss.js ${appPath}codemirror/js/tokenizejavascript.js ${appPath}codemirror/js/parsejavascript.js ${appPath}codemirror/js/parsehtmlmixed.js > ${appPath}codemirror/html.js
cat ${appPath}codemirror/js/util.js ${appPath}codemirror/js/stringstream.js ${appPath}codemirror/js/select.js ${appPath}codemirror/js/undo.js ${appPath}codemirror/js/editor.js ${appPath}codemirror/js/tokenize.js ${appPath}codemirror/js/parsedummy.js > ${appPath}codemirror/dummy.js

java -jar $compressTool -o ${releasePath}${version}jsLinb/js/linb.js      --nomunge   linb.js
java -jar $compressTool -o ${releasePath}${version}${appname}js/index.js   --nomunge   index.js

java -jar $compressTool -o ${appPath}codemirror/js.js   --charset utf-8   ${appPath}codemirror/js.js
java -jar $compressTool -o ${appPath}codemirror/php.js   --charset utf-8   ${appPath}codemirror/php.js
java -jar $compressTool -o ${appPath}codemirror/html.js   --charset utf-8   ${appPath}codemirror/html.js
java -jar $compressTool -o ${appPath}codemirror/css.js   --charset utf-8   ${appPath}codemirror/css.js
java -jar $compressTool -o ${appPath}codemirror/dummy.js   --charset utf-8   ${appPath}codemirror/dummy.js

rm -f linb.js
rm -f index.js

echo -e 'Done!\n'

#sleep
else
echo -e '\nScript failed. Please remove or rename "release" in parent folder first.\n'
fi