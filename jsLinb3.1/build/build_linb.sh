#!/bin/bash
# build_linb.sh

#converted by CRGreen from batch (.bat) script

relPath=../
compressTool=${relPath}tools/yuicompressor.jar
outPath=runtime/
miniPath=/linb.js
allPath=/linb-all.js
rawPath=/linb-raw.js
debugPath=/linb-debug.js
advAllPath=/adv-all.js
advRawPath=/adv-raw.js
advDebugPath=/adv-debug.js

# this tests for non existence of directory and non existence of file named 'runtime' in parent directory
# first expression specifies directory, 2nd exp. specifies file, stripping '/' from end

if [[ ! -d "${relPath}${outPath}" && ! -f "${relPath}${outPath%/*}" ]]; then

echo -e '\nPlease wait while I do some good stuff ...\n'

echo -e 'Making directories ...\n'

mkdir ${outPath}
mkdir ${outPath}jsLinb
mkdir ${outPath}jsLinb/js
mkdir ${outPath}jsLinb/js/Com
mkdir ${outPath}jsLinb/Locale
mkdir ${outPath}jsLinb/appearance


# ==================
# for jsLinb source code
# ==================
# cp -R ${relPath}jsLinb\js\*.* ${outPath}jsLinb\js\

echo -e 'Copying source ...\n'

cp -R ${relPath}jsLinb/js/Com/ ${outPath}jsLinb/js/Com/
cp -R ${relPath}jsLinb/appearance/ ${outPath}jsLinb/appearance/
cp -R ${relPath}jsLinb/Locale/ ${outPath}jsLinb/Locale/
cp  ${relPath}jsLinb/ondrag.gif ${outPath}jsLinb/
cp  ${relPath}jsLinb/bg.gif ${outPath}jsLinb/
cp  ${relPath}jsLinb/busy.gif ${outPath}jsLinb/

# ==================
# for mini jsLinb code
# ==================

echo -e 'mini ...\n'

cat ${relPath}jsLinb/js/linb.js ${relPath}jsLinb/js/Event.js ${relPath}jsLinb/js/CSS.js ${relPath}jsLinb/js/Dom.js ${relPath}jsLinb/js/Template.js ${relPath}jsLinb/js/DragDrop.js ${relPath}jsLinb/js/Cookies.js ${relPath}jsLinb/js/XML.js ${relPath}jsLinb/js/History.js ${relPath}jsLinb/js/Tips.js > linb.js

echo -e 'Compressing mini ...\n'

java -jar ${compressTool} -o  ${outPath}jsLinb/js${miniPath} linb.js
 
rm -f linb.js

echo -e 'all ...\n'
# ==================
# for all jsLinb code
# ==================
cat ${relPath}jsLinb/js/linb.js ${relPath}jsLinb/Locale/en.js ${relPath}jsLinb/js/Event.js ${relPath}jsLinb/js/Date.js ${relPath}jsLinb/js/CSS.js ${relPath}jsLinb/js/Dom.js ${relPath}jsLinb/js/Template.js ${relPath}jsLinb/js/Com.js ${relPath}jsLinb/js/Cookies.js ${relPath}jsLinb/js/XML.js ${relPath}jsLinb/js/DragDrop.js ${relPath}jsLinb/js/Tips.js ${relPath}jsLinb/js/History.js ${relPath}jsLinb/js/ComFactory.js ${relPath}jsLinb/js/Debugger.js ${relPath}jsLinb/js/UI.js ${relPath}jsLinb/js/UI/Image.js ${relPath}jsLinb/js/UI/Flash.js ${relPath}jsLinb/js/UI/Border.js ${relPath}jsLinb/js/UI/Shadow.js ${relPath}jsLinb/js/UI/Resizer.js ${relPath}jsLinb/js/UI/Block.js ${relPath}jsLinb/js/UI/Label.js ${relPath}jsLinb/js/UI/ProgressBar.js ${relPath}jsLinb/js/UI/Button.js ${relPath}jsLinb/js/UI/CheckBox.js ${relPath}jsLinb/js/UI/Slider.js ${relPath}jsLinb/js/UI/Input.js ${relPath}jsLinb/js/UI/RichEditor.js ${relPath}jsLinb/js/UI/ComboInput.js ${relPath}jsLinb/js/UI/Group.js ${relPath}jsLinb/js/UI/ColorPicker.js ${relPath}jsLinb/js/UI/DatePicker.js ${relPath}jsLinb/js/UI/TimePicker.js ${relPath}jsLinb/js/UI/List.js ${relPath}jsLinb/js/UI/Gallery.js ${relPath}jsLinb/js/UI/IconList.js ${relPath}jsLinb/js/UI/Panel.js ${relPath}jsLinb/js/UI/PageBar.js ${relPath}jsLinb/js/UI/Tabs.js ${relPath}jsLinb/js/UI/Stacks.js ${relPath}jsLinb/js/UI/ButtonViews.js ${relPath}jsLinb/js/UI/RadioBox.js ${relPath}jsLinb/js/UI/StatusButtons.js ${relPath}jsLinb/js/UI/TreeBar.js ${relPath}jsLinb/js/UI/TreeView.js ${relPath}jsLinb/js/UI/PopMenu.js ${relPath}jsLinb/js/UI/MenuBar.js ${relPath}jsLinb/js/UI/ToolBar.js ${relPath}jsLinb/js/UI/Layout.js ${relPath}jsLinb/js/UI/ColLayout.js ${relPath}jsLinb/js/UI/TreeGrid.js ${relPath}jsLinb/js/UI/Slider.js ${relPath}jsLinb/js/UI/Dialog.js > linb.js

echo -e 'Compressing all ...\n'

java -jar ${compressTool} -o  ${outPath}jsLinb/js${allPath} linb.js
java -jar ${compressTool} -o  ${outPath}jsLinb/js${rawPath}   --nomunge  linb.js
cp linb.js  ${outPath}jsLinb/js${debugPath}

# ==================
# for adv code
# ==================
echo -e 'advanced ...\n'

cat ${relPath}jsLinb/js/UI/FusionChartFree.js ${relPath}jsLinb/js/UI/FusionChart3.js ${relPath}jsLinb/js/UI/TextEditor.js ${relPath}jsLinb/js/UI/TimeLine.js ${relPath}jsLinb/js/UI/Poll.js ${relPath}jsLinb/js/UI/FoldingList.js ${relPath}jsLinb/js/UI/Range.js ${relPath}jsLinb/js/UI/Calendar.js > adv.js

echo -e 'Compressing advanced ...\n'

java -jar ${compressTool} -o  ${outPath}jsLinb/js${advAllPath} adv.js
java -jar ${compressTool} -o  ${outPath}jsLinb/js${advRawPath}   --nomunge  adv.js
cp adv.js  ${outPath}jsLinb/js${advDebugPath}


# ==================
# for Coder.js
# ==================
echo -e 'Compressing Coder ...\n'

java -jar ${compressTool} -o  ${outPath}jsLinb/js/Coder.js ${relPath}jsLinb/js/Coder.js
cp ${relPath}jsLinb/js/Coder.js  ${outPath}jsLinb/js/Coder-debug.js


# =======================
# cp to other dir
# =======================

oPath=../

# rd ${oPath}${outPath} /S /Q
# mkdir ${oPath}${outPath}

echo -e 'Final copy and clean-up ...\n'

cp -R ${outPath} ${oPath}${outPath}

rm -Rd ${outPath}

rm -f linb.js
rm -f adv.js

echo -e 'Done.\n'

#sleep

else

echo -e '\nScript failed. Please remove or rename "runtime" in parent folder first.\n'

fi
