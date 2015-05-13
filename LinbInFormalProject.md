# Linb in Formal Projects #
##### By Martin Feng #####
This article lists steps and tricks to apply linb to a formal project.
## Pre-Knowledge ##
#### Symbol Links in NTFS ####
You will need to use symbol link to make your project better organized. If you are on Windows, download <font color='#0000FF'>Junction</font> from <a href='http://technet.microsoft.com/en-CA/sysinternals/bb896768.aspx'><a href='http://technet.microsoft.com/en-CA/sysinternals/bb896768.aspx'>http://technet.microsoft.com/en-CA/sysinternals/bb896768.aspx</a></a>. It can create symbol link across partitions.

Some articles on Web talk about delete symbol link in Windows Explorer also deletes the folder pointed to by the symbol link. It is <strong>NOT TRUE</strong> on my Windows XP. I guess Microsoft fixed that. You can test at your Windows to make sure it doesn't happen.
## Prepare Environment on Your Local Machine ##
#### Install Web server + PHP at Your Local Computer ####
For Windows, an easy way is <a href='http://bitnami.org/stack/wampstack'><a href='http://bitnami.org/stack/wampstack'>http://bitnami.org/stack/wampstack</a></a>, which installs apache + PHP + MySQL.
#### Download Linb From Google Code ####
You should download using subversion: <a href='http://code.google.com/p/linb/source/checkout'><a href='http://code.google.com/p/linb/source/checkout'>http://code.google.com/p/linb/source/checkout</a></a>, so it's easy to get updated
#### Publish Downloaded Folder jsLinb[[x.y]] through Web Server ####
You can either create a symbol link (points to folder jsLinb[[x.y]]) under your web server publishing folder, or copy folder jsLinb[[x.y]] to web server publishing folder. You can also optionally create a virtual host for it too.
#### Create Symbol Link Points to Your Working Folder under Linb ####
The simple Linb UI builder is more like a tool to try out linb quickly. For a formal project, we have to use the advanced version. The advanced version can only manage projects under folder jsLinb[[x.y]]\VisualJS\projects, and in most cases our working folder is at somewhere else (for instance, in our subversion working copy folder). So we need to create a symbol link under folder jsLinb[[x.y]]\VisualJS\projects, which points to the working folder located elsewhere. For example:
> jsLinb[[x.y]]\VisualJS\projects\cloud -> working\_branch\cloud\webapp
Make sure web server has write permission to your working folder.
## Plan Web Application Layout ##
The goal is to break UI related JavaScript and logic related JavaScript into different files, so they can be modified independently by different team members easily.
#### The Default Application Layout of Linb and getCom ####
Create a new project with linb IDE (hosted at your local web server) you can see all UI related JavaScript are saved at folder <font color='#0000FF'>App\js</font>. This default layout matches the rule used by <font color='#0000FF'>linb.ComFactory.getCom</font>. You should read chapter 4 "<font color='#0000FF'>Distributed UI</font>" of <font color='#0000FF'>jsLinb[[x.y]]\cookbook\linb3.0-guide.en.doc</font> to have a basic understanding of how linb distributed UI works.
<font color='#0000FF'>Note: </font>
  * You should not take time reading the details of all the UI controls until you start to use some of them in your projects.
  * According to author of linb, linb.UI.Tag is seldom used now. Simply ignore it.
  * My experience is the conf.js can be ignored too. It's good enough to use names like <font color='#0000FF'>App.Module</font> to load distributed modules
#### Modify the Default Application Layout ####
With linb IDE, all event handling JavaScript is added to the same js file which generates the UI. Now let's break them up:
  1. Rename the App folder to AppUI. Also change class names from <font color='#0000FF'>App.Module</font> to <font color='#0000FF'>AppUI.Module</font>. Nothing breaks.
  1. Do not add any event in linb IDE.
  1. Initialize all event hooking logic in <font color='#0000FF'>onEnd</font> callback parameter of <font color='#0000FF'>linb.ComFactory.getCom </font>or<font color='#0000FF'> linb.Com.load.</font>
> Suppose you have a control whose id is "treebar\_main" (defined in IDE), in the <font color='#0000FF'>onEnd </font>callback, refer to it with:
```
  var treebar_main = this.treebar_main;
```
> To add event handler to it:
```
  treebar_main.beforeClickEffect(function(profile, item, e, src, type) { ... });
```
We can go one step further to put the business logic JavaScript into another lib.Com object:
  1. Create a new folder named <font color='#0000FF'>App</font> and subfolder <font color='#0000FF'>App\js</font>.
  1. Create file <font color='#0000FF'><font color='#0000FF'>App\js\</font>Module1.js</font> like this:
```
  Class('App.Module1', 'linb.Com',{
    Instance:
    {
       initialize : function()
       {
           this.func_name = function(para1, para2)
           {
              linb.ComFactory.getCom('AppUI.Module1', function()
              {
                 this.show(function()
                 {
                     // business logic code that hooks up all events. which can refer para1, para2 too.
                     var treebar_main = this.treebar_main;
                 });
              });
           }
       }
    }
 });
```
<font color='#0000FF'>App\js\Module1.js</font> contains the code to load up <font color='#0000FF'>AppUI\js\Module1.js </font>and initialize business logic related to it. The only constraint between <font color='#0000FF'>App\js\Module1.js</font> and <font color='#0000FF'>AppUI\js\Module1.js</font> is the ID of business logic related UI controls should be consistent.

To load up and initialize <font color='#0000FF'>App\js\Module1.js </font>with parameters:
```
linb.ComFactory.getCom('App.Module1', function()
{
  this.func_name(para1, para2);
});
```
## Using Dialogs ##
#### Generate Dialog UI ####
With linb, web application doesn't have to navigate from page to page as traditional ones. It's more nature and easy to stay in one page and use JavaScript to popup a dialog for a new group of function instead of navigate to another page. However, with linb IDE you cannot generate the UI code for a dialog directly. Here is how we do it:
  1. Open the linb UI builder (the simpler version of linb IDE).
  1. Delete the button added by default and drop a dialog to the design area.
  1. Switch to code view, delete the code related to the button just deleted.
  1. Change the first code line to <font color='#0000FF'>Class("App<font color='#f00;'>UI.DlgName</font>", "linb.Com",{</font>
  1. Copy the content of the code view to a new js file <font color='#0000FF'>AppUI\js\DlgName.js</font>
  1. Reopen your project in advanced IDE so it reloads file folder list
  1. Open <font color='#0000FF'>AppUI\js\DlgName.js</font> in advanced IDE and go on adding other controls to the dialog.
#### Dialog Tricks ####
##### To create a modal dialog #####
Modify the <font color='#0000FF'>customAppend</font> function in dialog UI to:
```
this.dlg_id.show(null, true);
```
Be noted that the JavaScript actually describes a linb.Com object containing a dialog, not a dialog object. So <font color='#0000FF'>this</font> refers to the linb.Com object.
##### To reuse a dialog instance: #####
  * Hide the dialog and return <font color='#0000FF'>false </font>at the <font color='#0000FF'>beforeClose</font> event of the dialog so the dialog will not be destroied
```
  this.dlg_id.beforeClose(function()
  {
    this.dlg_id.hide();
    return false;
  });
```
  * Always use <font color='#0000FF'>linb.ComFactory.getCom</font> to loadup / show the dialog
## Deployment ##
The main tasks for deployment are:
  * Compress all JavaScript and css files, including distributed JavaScript files under <font color=' rgb(0, 0, 255); '>App\js </font>and<font color=' rgb(0, 0, 255); '> AppUI\js</font>
  * Make sure the deployed code uses compressed linb library (for example, not linb-debug.js)
  * Join all compressed JavaScript files directly loaded by page (<strong>NOT</strong> including distributed JavaScript files under <font color='#0000FF'>App\js </font>and<font color='#0000FF'> AppUI\js) </font>into one JavaScript file. Note that this will likely break the sequence of JavaScript be loaded by browser so the code need to be prepared for this. This is optional for local HTML application
  * If the user of the web application locate mainly out of China mainland, use linb library hosted on appspot instead of hosted on our own server: http://jslinb.appspot.com/runtime/jsLinb/js/linb-all.js
Examples:
  * jsLinb[[x.y]]\build\build\_linb.bat compresses and joins multiple JavaScript files into one file
  * deploy\_linbapp.pl: Deployment script running on Linux. Besides java and YUI compressor, it requires subversion command line client program <font color='#0000FF'>svn</font>, and UNIX command line program <font color='#0000FF'>rm</font> and <font color='#0000FF'>cat</font> to delete and join files. To make it work on Windows, you can install a subversion windows command line client, and modify the call to <font color='#0000FF'>rm </font>and<font color='#0000FF'> cat </font>to <font color='#0000FF'>del </font>and<font color='#0000FF'> type</font>