if(linb.UI){try{
    (function(){
        var s=document.getElementsByTagName('script'), me=s[s.length-1], file=decodeURIComponent(linb(me).attr('src').split('?')[1]||''),html='';
        if(!file)return;

        var path='http://www.crossui.com/RAD/Builder.html';
        file=file.split('|');
        _.arr.each(file,function(v){
            html+='<div><a target=_blank style="font-weight:bold;font-size:12px;text-decoration:underline;" href="'+path+ "#url=" + encodeURIComponent(linb.ini.appPath+v)+'">'+'Open "'+v+'" in CrossUI Builder'+'</a></div>';
        });
        linb('body').append(linb.create('<div style="position:absolute;z-index:5000;top:10px;right:10px;">'+html+'</div>'));
    })()
}catch(e){}}