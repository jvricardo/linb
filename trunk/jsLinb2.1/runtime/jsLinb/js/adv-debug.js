(function(){

/*
*to do: background div
*to do: special div
*/

Class('linb.UI.TimeLine', ['linb.UI','linb.absList',"linb.absValue"], {
    Dependency:['linb.Date'],
    Instance:{
        _setCtrlValue:function(value){
            if(!value)return;
            if(value.indexOf(':')==-1)return;
            var profile=this.get(0),
                p=profile.properties,
                box=this.constructor,
                a=value.split(':'),
                from=new Date(parseInt(a[0])),
                to=new Date(parseInt(a[1])),
                pxStart=box._getX(profile,from),
                pxEnd=box._getX(profile,to),
                task;
            if(p.items.length===0)
                this.insertItems([{id:'$', caption:p.dftTaskName, from:from, to:to}],null,true);
            else
                box._resetItem(profile,{left:pxStart,width:pxEnd-pxStart},profile.getSubNodeByItemId('ITEM',p.items[0].id).get(0));
        },
        visibleTask:function(){
            var profile=this.get(0),
                p=profile.properties,
                date=linb.Date,
                items=p.items;
            if(items.length && !p.multiTasks){
                target=new Date(items[0].from);
                if(target<p.dateStart || target>date.add(p.dateStart,'ms',p.width*p._rate)){
                    p.dateStart=target;
                    var k=p.$UIvalue;
                    this.refresh().setUIValue(k);
                }
            }
            return this;
        },
        _afterInsertItems:function(profile){
           profile.box._reArrage(profile);
        },
        _afterRemoveItems:function(profile){
            profile.box._reArrage(profile);
        },
        _cache:function(){
            var profile=this.get(0),
                cls=this.constructor,
                picker=cls._picker;
            if(picker && picker.domNode)
                profile.getSubNode('POOL').append(picker.root.css('display','none'));
        },
        getTimeRange:function(){
            var profile=this.get(0), p=profile.properties;
            return [p._smallLabelStart, p._smallLabelEnd];
        },
        iniContent:function(){
            return this.each(function(profile){
                var p=profile.properties;
                profile.boxing()._getContent(p._smallLabelStart,p._smallLabelEnd,p._rate,'ini');
            });
        },

        addTasks:function(arr){
            return this.insertItems(arr,null,true);
        },
        removeTasks:function(ids){
            this.removeItems(ids);
            return this;
        },
        _getContent:function(from,to,rate,type){
            return this.each(function(profile){
                if(profile.onGetContent){
                    var ins=profile.boxing(),
                        callback=function(arr){ins.addTasks(arr)};
                    if(profile.onGetContent){
                        var r = ins.onGetContent(profile, from, to, rate, type, callback);
                        if(r)callback(r);
                    }
                }
            });
        } 
    },
    Static:{
        Templates:{
            tagName:'div',
            style:'{_style}',
            BORDER:{
                tagName:'div',
                style:'height:{_bHeight}px;width:{_bWidth}px;',
                FOCUS:{tagName:'button'},
                POOL:{
                    tagName:'div',
                    style:'position:absolute;left:0;top:0;width:0;height:0;display:none;'
                },
                BAR:{
                    tagName:'div',
                    className:'uibar-top',
                    style:'{_bardisplay};height:{_barHeight}px;',
                    BART:{
                        cellpadding:"0",
                        cellspacing:"0",
                        width:'100%',
                        border:'0',
                        tagName:'table',
                        className:'uibar-t',
                        BARTR:{
                            tagName:'tr',
                            BARTDL:{
                                tagName:'td',
                                className:'uibar-tdl'
                            },
                            BARTDM:{
                                $order:1,
                                width:'100%',
                                tagName:'td',
                                className:'uibar-tdm'
                            },
                            BARTDR:{
                                $order:2,
                                tagName:'td',
                                className:'uibar-tdr'
                            }
                        }
                    },
                    BARCMDL:{
                        tagName:'div',
                        className:'uibar-cmdl',
                        DATE:{$order:0,style:'{dateDisplay}'},
                        PRE:{$order:2},
                        'ZOOMIN':{$order:3,style:'{zoomDisplay}'},
                        'ZOOMOUT':{$order:4,style:'{zoomDisplay}'},
                        NEXT:{$order:5}
                    },
                    BARCMDR:{
                        tagName: 'div',
                        className:'uibar-cmdr',
                        onselectstart:'return false',
                        unselectable:'on',
                        OPT:{
                            className:'uicmd-opt',
                            style:'{optDisplay}',
                            $order:0
                        },
                        CLOSE:{
                            $order:4,
                            className:'uicmd-close ',
                            style:'{closeDisplay}'
                        }
                    }
                },
                BAND:{
                    $order:2,
                    tagName:'div',
                    style:'left:{_band_left}px;width:{_band_width}px;',
                    BIGLABEL:{
                        tagName:'div',
                        style:'height:{_bigLabelHeight}px;z-index:3;{_showBigLabel}',
                        text:"{_bigMarks}"
                    },
                    SMALLLABEL:{
                        $order:1,
                        tagName:'div',
                        style:'height:{_smallLabelHeight}px;z-index:4;',
                        text:"{_smallMarks}"
                    }
                },
                VIEW:{
                    $order:3,
                        tagName:'div',
                        style:'height:{_viewHeight}px;',
                        ITEMS:{
                            tagName:'div',
                            style:'left:{_band_left}px;width:{_band_width}px;',
                            text:'{items}',
                            ACTIVE:{
                                $order:3,
                                tagName:'div'
                            }
                        },
                        SCROLL:{
                            tagName:'div',
                            SCROLLI:{
                                tagName:'div'
                            }
                        }
                },
                TAIL:{
                    $order:4,
                    tagName:'div',
                    className:'uicon-main',
                    TIPS:{
                        className:'uicon-maini',
                        style:'z-index:2;{_tipsdisplay};',
                        tagName:'div'
                    }
                },
                BBAR:{
                    $order:5,
                    tagName:'div',
                    className:'uibar-bottom-s',
                    BBART:{
                        cellpadding:"0",
                        cellspacing:"0",
                        width:'100%',
                        border:'0',
                        tagName:'table',
                        className:'uibar-t',
                        BBARTR:{
                            tagName:'tr',
                            BBARTDL:{
                                tagName:'td',
                                className:'uibar-tdl'
                            },
                            BBARTDM:{
                                $order:1,
                                width:'100%',
                                tagName:'td',
                                className:'uibar-tdm'
                            },
                            BBARTDR:{
                                $order:2,
                                tagName:'td',
                                className:'uibar-tdr'
                            }
                        }
                    }
                }
            },
            $dynamic : {
                _bigMarks:{
                    LABELT:{
                        id:null,
                        className:null,
                        tagName:'div',
                        onselectstart:'return false',
                        unselectable:'on',
                        style:'width:{width}px;left:{left}px;',
                        text:'{text}'
                    }
                },
                _smallMarks:{
                    LABELB:{
                        id:null,
                        className:null,
                        tagName:'div',
                        onselectstart:'return false',
                        unselectable:'on',
                        style:'width:{width}px;left:{left}px;',
                        text:'{text}'
                    }
                },
                items:{
                    ITEM:{
                        tagName:'div',
                        className:'{itemClass} {disabled}',
                        style:'left:{_left}px;width:{_width}px;{_top};{_height};{itemStyle}',
                        MIN:{
                            $order:0,
                            tagName:'div',
                            style:'{_minDisplay}'
                        },
                        NORMAL:{
                            $order:1,
                            tagName:'div',
                            style:'{_normalDisplay};{_height};{_border}{_background}',
                            LEFT:{
                                $order:1,
                                tagName:'div'
                            },
                            HEAD:{
                                $order:2,
                                tagName:'div'
                            },
                            CON:{
                                $order:3,
                                tagName:'div',
                                text:'{caption}'
                            },
                            RIGHT:{
                                $order:4,
                                tagName:'div'
                            }
                        }
                    }
                }
            }
        },
        Behaviors:{
            DropableKeys:['ITEMS'],
            HoverEffected:{PRE:'PRE',NEXT:'NEXT',ZOOMIN:'ZOOMIN',ZOOMOUT:'ZOOMOUT',DATE:'DATE',OPT:'OPT',CLOSE:'CLOSE',MIN:'MIN',NORMAL:'NORMAL'},
            ClickEffected:{PRE:'PRE',NEXT:'NEXT',ZOOMIN:'ZOOMIN',ZOOMOUT:'ZOOMOUT',DATE:'DATE',OPT:'OPT',CLOSE:'CLOSE',MIN:'MIN'},
            onSize:function(profile,e){
                var o = profile.domNode.style,f=parseInt, n=null, w=n, h=n;
                if(e.height)h=f(o.height)||n;
                if(e.width)w=f(o.width)||n;
                if(h)linb.UI.$tryResize(profile, w, h);
            },
            CLOSE:{
                onClick:function(profile, e, src){
                    if(profile.properties.disabled)return;
                    var instance = profile.boxing();

                    if(false===instance.beforeClose(profile, src)) return;

                    instance.destroy();

                    //for design mode in firefox
                    return false;
                }
            },
            OPT:{
                onClick:function(profile, e, src){
                    if(profile.properties.disabled)return;
                    profile.boxing().onShowOptions(profile, e, src);
                }
            },
            onClick:function(profile, e){
                profile.box._focus(profile);
            },
            BAND:{
                onMousedown:function(profile, e, src){
                    if(profile.pauseA||profile.pause)return;
                    var t=profile.properties,
                        r=-t._band_left,
                        date=linb.Date,
                        rate=t._rate,
                        ep=linb.Event.getPos(e),
                        l=t._band_width-r-t.width;
                    ;
                    if(t.minDate && t._smallLabelStart<t.minDate)
                        r-=date.diff(t._smallLabelStart,t.minDate,'ms')/rate;
                    if(t.maxDate && t._smallLabelEnd>t.maxDate)
                        l-=date.diff(t.maxDate,t._smallLabelEnd,'ms')/rate;
                    if(r<0)r=0;
                    if(l<0)l=0;

                    linb([src]).startDrag(e, {
                        targetReposition:false,
                        dragType:'blank',
                        horizontalOnly:true,
                        targetLeft:ep.left,
                        targetTop:ep.top,
                        maxLeftOffset:l,
                        maxRightOffset:r
                     });
                },
                onDragstop:function(profile, e, src){
                    profile.box._rePosition(profile);
                    profile.box._focus(profile);
                },
                onDrag:function(profile, e, src){
                    var ns=profile.box._getMoveNodes(profile),
                        dd=linb.DragDrop.getProfile();
                    ns.left(profile.properties._band_left +  dd.offset.x);
                }
            },
            SCROLL:{
                onScroll:function(profile, e, src){
                    profile.getSubNode('ITEMS').top(-linb([src]).scrollTop() );
                }
            },
            ITEMS:{
                onMouseover:function(profile,e,src){
                    if(linb.DragDrop.getProfile().isWorking)return;
                    profile.$itemspos = linb([src]).offset();
                },
                onMousemove:function(profile,e){
                    if(linb.DragDrop.getProfile().isWorking){
                        //ondrag add here, for performance of 'dont-use-dropable situation'.
                        if(profile.$$ondrag){
                            var d=linb.DragDrop.getProfile();
                            profile.box._moveActive(profile, profile.$active, d.x-profile.$dd_ox, profile.properties._unitPixs);
                        }
                    }else{
                        var t=profile.properties,
                            date=linb.Date,
                            s=t._smallLabelStart,
                            r=t._rate,
                            u=t._timeFormat,
                            p1=linb.Event.getPos(e),
                            p2=profile.$itemspos;
                        if(p2 && t.showTips)
                            profile.box._setTips(profile, date.getText(date.add(s, 'ms', (p1.left-p2.left)*r),u));
                    }
                },
                onMouseout:function(profile,e,src){
                    if(linb.DragDrop.getProfile().isWorking)return;
                    if(profile.properties.showTips)
                        profile.box._setTips(profile, '');
                },
                onMousedown:function(profile, e, src){
                    var pro=profile.properties;
                    if(pro.disabled || pro.readonly)return;
                    if(profile.pauseA||profile.pause)return;
                    if(linb.Event.getSrc(e)!=src)return;

                    var o = profile.getSubNode('ACTIVE'),
                        x = linb.Event.getPos(e).left;
                    o.css({
                        display:'block',
                        width:'0'
                    })
                    .offset({left :x,  top :null});
                    o.startDrag(e, {dragType:'none'});
                },
                onMouseup:function(profile, e, src){
                    profile.box._focus(profile);
                }
            },
            ACTIVE:{
                onDragbegin:function(profile, e, src){
                    profile.$dd_ox = linb.DragDrop.getProfile().x;
                    profile.$dd_oleft = parseInt(src.style.left)||0;
                    linb([src,src.parentNode]).css('cursor','e-resize');
                },
                onDrag:function(profile, e, src){
                    var x=profile.$dd_oleft,
                        ddx=linb.DragDrop.getProfile().x,
                        w,
                        offset;
                    if((offset =ddx-profile.$dd_ox)>=0){
                        w = offset;
                    }else{
                        x = x+offset; w = -offset;
                    }
                    profile.box._moveActive(profile, src, x, w);
                },
                onDragstop:function(profile, e, src){
                    var r = profile.box._deActive(profile);
                    linb([src,src.parentNode]).css('cursor','');

                    var box=profile.box,
                        from=box._getTime(profile, r.left),
                        to=box._getTime(profile, r.left+r.width),
                        p=profile.properties,
                        task,t,
                        b=profile.boxing();

                    if(profile.properties.multiTasks){
                        task={id:_.id(),caption:p.dftTaskName,from:from,to:to};
                        if(profile.beforeNewTasks && false===b.beforeNewTasks(profile, [task])){}else
                            b.addTasks([task]);
                    }else
                        b.setUIValue(from+":"+to);

                    profile.$dd_ox =profile.$dd_oleft=null;
                }
            },
            FOCUS:{
                onFocus:function(profile, e, src){
                    _.resetRun(profile.KEY+':focus',function(){
                        profile.getSubNode('BAR').tagClass('-focus');
                    });
                },
                onBlur:function(profile, e, src){
                    _.resetRun(profile.KEY+':focus',function(){
                        profile.getSubNode('BAR').tagClass('-focus',false);
                    });
                },
                onKeydown:function(profile, e, src){
                    if(profile.pauseA||profile.pause)return;
                    profile.pause=true;

                    // speed
                    var t=profile.properties,
                        date=linb.Date,
                        rate=t._rate,
                        maxOffset = 30,
                        o=profile.box._getMoveNodes(profile),
                        x=o.left(),
                        xx=t._band_left,
                        off=t._scroll_offset
                        ;

                    off = t._scroll_offset = off>maxOffset ? off :off*1.05;

                    switch(linb.Event.getKey(e)[0]){
                        case 'left':
                        case 'up':
                            if(t.minDate && date.add(t.dateStart,'ms',(xx-x-off)*rate)<t.minDate)
                                off=date.diff(t.minDate, t.dateStart,'ms')/rate + (xx-x);
                            if(off<0)off=0;
                            o.left(x + off);
                            break;
                        case 'right':
                        case 'down':
                            if(t.maxDate && date.add(t.dateStart,'ms',(xx-x+off+t.width)*rate)>t.maxDate)
                                off=date.diff(t.dateStart,t.maxDate,'ms')/rate - (xx-x+t.width);
                            if(off<0)off=0;
                            o.left(x - off);
                            break;
                    }

                    if((x + maxOffset > 0) || (x + o.width() - t.width - maxOffset < 0))
                        profile.box._rePosition(profile);
                    profile.pause=false;
                    return false;
                },
                onKeyup:function(profile, e){
                    var p=profile.properties;
                    p._scroll_offset = p._scrollRate;
                    profile.box._rePosition(profile);
                }
            },
            PRE:{
                onClick:function(profile, e){
                    if(profile.pauseA||profile.pause)return;

                    var t=profile.properties,
                        date=linb.Date,
                        rate=t._rate,
                        o=profile.box._getMoveNodes(profile),
                        x1=t._band_left,
                        x2=0;
                    ;
                    if(t.minDate && t._smallLabelStart<t.minDate)
                        x2-=date.diff(t._smallLabelStart,t.minDate,'ms')/rate;

                    profile.pause=true;
                    o.animate({left:[x1,x2]}, null, function(){
                        profile.box._rePosition(profile);
                        profile.pause=false;
                    },200,Math.max(5,(x2-x1)/100),'sineInOut').start();
                }
            },
            NEXT:{
                onClick:function(profile, e){
                    if(profile.pauseA||profile.pause)return;
                    var t=profile.properties,
                        date=linb.Date,
                        rate=t._rate,
                        o=profile.box._getMoveNodes(profile),
                        x1=t._band_left,
                        x2=t.width-t._band_width;
                    ;
                    if(t.maxDate && t._smallLabelEnd>t.maxDate)
                       x2+=date.diff(t.maxDate,t._smallLabelEnd,'ms')/rate;

                    if(x1>x2){
                        profile.pause=true;
                        o.animate({left:[x1,x2]}, null, function(){
                            profile.box._rePosition(profile);
                            profile.pause=false;
                        },200,Math.max(5,(x1-x2)/100),'sineInOut').start();
                    }
                }
            },
            ZOOMIN:{
                onClick:function(profile, e){
                    if(profile.pauseA||profile.pause)return;
                    var p=profile.properties,
                        box=profile.box,
                        z=box.$zoom,
                        index = _.arr.indexOf(z,p._unitParas),
                        o;
                    if(index > 0){
                        profile.pause=true;
                        p.timeSpanKey =  z[index- 1][0];

                        o = profile.getSubNodes(['VIEW','BAND']);
                        o.animate( {opacity:[1,0.2]}, null, function(){
                            profile.box._refresh(profile)._focus(profile);
                            profile.pause=false;
                        },200,5,'sineIn').start();
                    }
                }
            },
            ZOOMOUT:{
                onClick:function(profile, e){
                    if(profile.pauseA||profile.pause)return;
                    var p=profile.properties,
                        box=profile.box,
                        z=box.$zoom,
                        index = _.arr.indexOf(z,p._unitParas),
                        o;
                    if(index < z.length -1){
                        profile.pause=true;
                        p.timeSpanKey = z[index + 1][0];

                        o = profile.getSubNodes(['VIEW','BAND']);
                        o.animate( {opacity:[1,0.2]}, null, function(){
                            //if multiTasks, setUIValue will be ignored
                            profile.box._refresh(profile)._focus(profile);
                            profile.pause=false;
                        },200,5,'sineIn').start();
                    }
                }
            },
            DATE:{
                onClick:function(profile, e, src){
                    if(profile.pauseA||profile.pause)return;
                    var cls=profile.box,
                        box=profile.boxing(),
                        from=profile.properties.dateStart,
                        o,node;

                    if(cls._picker && cls._picker.domNode){
                       o=cls._picker.boxing();
                    }else{
                        o=linb.create('DatePicker');
                        cls._picker=o.get(0);
                        o.beforeClose(function(){
                            this.boxing()._cache();
                            return false;
                        })
                        .beforeUIValueSet(function(p, ov, v){
                            var profile=this,
                                obj = profile.getSubNodes(['VIEW','BAND']),
                                box=profile.boxing(),
                                p=profile.properties;
                            p.dateStart=v;
                            //obj.animate( {opacity:[1,0.2]}, null, function(){
                                //if multiTasks, setUIValue will be ignored
                                profile.box._refresh(profile)._focus(profile);
                            //    profile.pause=false;
                            //},200,5,'sineIn').start()
                            box._cache();
                        });
                    }
                    o.setValue(from,true).host(profile);
                    node=o.reBoxing();
                    node.popToTop(src);

                    //for on blur disappear
                    node.setBlurTrigger(profile.key+" - "+profile.$id, function(){
                        box._cache();
                    });

                    //for esc
                    linb.Event.keyboardHook('esc',0,0,0,function(){
                        box._cache();
                        cls._focus(profile);
                        //unhook
                        linb.Event.keyboardHook('esc');
                    });
                }
            },
            ITEM:{
                onClick:function(profile, e, src){
                    if(profile.onClickTask)
                        profile.boxing().onClickTask(profile, profile.getItemByDom(src), e, src);
                },
                onDragbegin:function(profile, e, src){
                    var t=profile.getItemByDom(src),
                        type=profile.$dd_type,
                        cursor=type?'e-resize':'move',
                        ac=profile.$active;
                    profile.$dd_ox = linb.DragDrop.getProfile().x;
                    profile.$dd_oleft = parseInt(src.style.left);
                    profile.$dd_owidth = parseInt(src.style.width);
                    linb([ac]).css('display','block').cssPos({left :profile.$dd_oleft,  top :null}).width(profile.$dd_owidth-2);
                    linb([ac,ac.parentNode]).css('cursor',cursor);
                },
                onDrag:function(profile, e, src){
                    var x,w,
                        offset =linb.DragDrop.getProfile().x-profile.$dd_ox,
                        ddl=profile.$dd_oleft,
                        ddw=profile.$dd_owidth,
                        type=profile.$dd_type;
                    if(type=="left"){
                        if(offset < ddw){
                            x = ddl + offset;
                            w = ddl + ddw - x;
                        }else{
                            x = ddl + ddw;
                            w = offset - ddw;
                        }
                    }else if(type == "right"){
                        if(-offset < ddw){
                            x = ddl;
                            w = ddw + offset;
                        }else{
                            x = ddl + offset + ddw;
                            w = -offset - ddw;
                        }
                    }else{
                        x = ddl + offset;
                        w = ddw;
                    }
                    profile.box._moveActive(profile, profile.$active, x, w);
                },
                onDragstop:function(profile, e, src){
                    var box=profile.box,
                        r = profile.box._deActive(profile),
                        ac=profile.$active;

                        var from=box._getTime(profile, r.left),
                            to=box._getTime(profile,r.left+r.width);
                    if(profile.properties.multiTasks){
                        if(profile.beforeTaskUpdated && false===profile.boxing().beforeTaskUpdated(profile, profile.getItemByDom(src), from, to)){}else
                            box._resetItem(profile,r,src);
                    }else
                        profile.boxing().setUIValue(from+":"+to);

                    profile.$dd_type = null;

                    linb([ac,ac.parentNode]).css('cursor','');
                }
            },
            HEAD:{
                onMousedown:function(profile, e, src){
                    var ps=profile.properties, item=profile.getItemByDom(src);
                    if(ps.disabled  || item.disabled)return;
                    if(profile.beforeDragTask && false===profile.boxing().beforeDragTask(profile, item, e, src))
                        return;
                    if(ps.readonly||item.readonly)return;
                    linb([src]).parent(2).startDrag(e, {
                        dragDefer:1,
                        dragType:'none'
                    });
                }
            },
            LEFT:{
                onMousedown:function(profile, e, src){
                    var ps=profile.properties, item=profile.getItemByDom(src);
                    if(ps.disabled || ps.readonly || item.readonly || item.disabled)return;
                    profile.$dd_type='left';
                    linb([src]).parent(2).startDrag(e, {
                        dragDefer:1,
                        dragType:'none'
                    });
                }
            },
            RIGHT:{
                onMousedown:function(profile, e, src){
                    var ps=profile.properties, item=profile.getItemByDom(src);
                    if(ps.disabled || ps.readonly || item.readonly || item.disabled)return;
                    profile.$dd_type='right';
                    linb([src]).parent(2).startDrag(e, {
                        dragDefer:1,
                        dragType:'none'
                    });
                }
            }
        },
        DataModel:{
            $borderW : 1,
            readonly:false,
            // control width and height
            width : 400,
            height : 200,
            //invisible band count (left,right)
            //if it's zero, leftSpanCount will be equal to the visible span count(based on widget width)
            leftSpanCount:{
                ini:0,
                inner:1
            },
            rightSpanCount:{
                ini:0,
                inner:1
            },
            increment:0,
            zoomable:{
                ini:true,
                action:function(v){
                    if(this.properties.timeSpanKey)
                        this.getSubNodes(['ZOOMIN','ZOOMOUT']).css('display',v?'':'none');
                }
            },
            dftTaskName:'task',
            taskHeight:{
                ini:16,
                action:function(v){
                    this.getSubNode('ITEM',true).height(v);
                }
            },

            //time span key
            timeSpanKey : {
                ini:'1 d',
                action:function(){
                    this.box._refresh(this);
                }
            },
            // how much px to represent a unit
            // defalut value is from timeSpanKey
            unitPixs : {
                action:function(){
                    this.box._refresh(this);
                }
            },

/*
*inner properties
*defalut value is from timeSpanKey
*/
            //time span count
            smallLabelCount:{
                inner:1
            },
            //time span unit
            smallLabelUnit:{
                inner:1,
                listbox:_.toArr(linb.Date.$TIMEUNIT,true)
            },
            //small label format
            smallLabelFormat:{
                inner:1,
                listbox:_.toArr(linb.Date.$TEXTFORMAT,true)
            },
            bigLabelCount:{
                inner:1
            },
            //time span unit
            bigLabelUnit:{
                inner:1,
                listbox:_.toArr(linb.Date.$TIMEUNIT,true)
            },

            //big label format
            bigLabelFormat:{
                inner:1,
                listbox:_.toArr(linb.Date.$TEXTFORMAT,true)
            },
            //time format
            timeFormat:{
                inner:1,
                listbox:_.toArr(linb.Date.$TEXTFORMAT,true)
            },
/*inner properties*/
            //bar
            showBar:{
                ini:true,
                action:function(v){
                    this.getSubNode('BAR').css('display',v?'':'none');
                    var p=this.properties,w=p.width,h=p.height;
                    p.width=p.height=0;
                    linb.UI.$tryResize(this,w,h);
                    p.width=w,p.height=h;
                }
            },
            //tips
            showTips:{
                ini:true,
                action:function(v){
                    this.getSubNode('TIPS').css('display',v?'':'none');
                    var p=this.properties,w=p.width,h=p.height;
                    p.width=p.height=0;
                    linb.UI.$tryResize(this,w,h);
                    p.width=w,p.height=h;
                }
            },
            //big label
            showBigLabel: {
                ini:true,
                action:function(v){
                    this.getSubNode('BIGLABEL').css('display',v?'':'none');
                    var p=this.properties,w=p.width,h=p.height;
                    p.width=p.height=0;
                    linb.UI.$tryResize(this,w,h);
                    p.width=w,p.height=h;
                }
            },

            _barHeight : 29,
            _tipsHeight : 32,
            _bigLabelHeight : 16,
            _smallLabelHeight : 14,
            _scrollRate:5,

            multiTasks: {
                ini:false,
                action:function(){
                    this.box._refresh(this);
                }
            },

            minDate:{
                ini:null,
                action:function(value){
                    if(value>this.properties.dateStart)
                        this.box._refresh(this);
                }
            },
            maxDate:{
                ini:null,
                action:function(value){
                    var p=this.properties;
                    if(value<linb.Date.add(p.dateStart,'ms',p.width*p._rate))
                        this.box._refresh(this);
                }
            },
            
            dateBtn:{
                ini:true,
                action:function(v){
                    this.getSubNode('DATE').css('display',v?'':'none');
                }
            },
            closeBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('CLOSE').css('display',v?'':'none');
                }
            },
            optBtn:{
                ini:false,
                action:function(v){
                    this.getSubNode('OPT').css('display',v?'':'none');
                }
            },
 
            fixWidth:true,
            dateStart : {
                ini:new Date,
                action:function(){
                    this.box._refresh(this);
                }
            }
        },
        EventHandlers:{
            beforeClose:function(profile, src){},
            onShowOptions:function(profile, e, src){},
            onGetContent:function(profile, from, to, minMs, type, callback){},
            beforeTaskUpdated:function(profile, task, from, to){},
            beforeNewTasks:function(profile, tasks){},
            beforeDelTasks:function(profile, arr){},
            beforeDragTask:function(profile, task, e, src){},
            onClickTask:function(profile, task, e, src){}
        },
        Appearances:{
            BORDER:{
                overflow: 'hidden',
                position: 'relative'
            },
            'BAR-focus BART':{
                $order:2,
                'background-position' : 'right -22px'
            },
            'BART':{
                border:0
            },
            'BARCMDL span':{
                $order:0,
                position:'relative',
                width:'15px',
                height:'15px',
                margin:'2px',
                'vertical-align': 'middle',
                cursor:'default'
            },
            FOCUS:{
                position:'absolute',
                'font-size':'0',
                width:'1px',
                height:'1px',
                left:'-100px',
                top:'-100px',
                'line-height':'0',
                border:'0'
            },
            'BAND, VIEW, BIGLABEL, SMALLLABEL':{
                position:'relative'
            },
            VIEW:{
                width:linb.browser.ie6?'100%':null,
                overflow:'hidden'
            },
            SCROLL:{
                'z-index':500,
                position:'absolute',
                'font-size':'0',
                'line-height':'0',
                right:0,
                top:0,
                height:'100%',
                width:'18px',
                overflow:'auto',
                'overflow-x':linb.browser.opr?null:'hidden'
            },
            SCROLLI:{
                height:'1000px',
                width:'1px'
            },
            'BIGLABEL, SMALLLABEL':{
                'background-color':'#ECE9D8',
                cursor:'move'
            },
            'BIGLABEL,SMALLLABEL':{
                'border-bottom':'solid 1px #505050'
            },
            ITEMS:{
                position:'relative',
                background: linb.UI.$bg('bars.gif',' left top')
            },
            'BIGLABEL div, SMALLLABEL div':{
                'border-left':'solid 1px #505050',
                'text-align':'center',
                position:'absolute',
                cursor:'move',
                "-moz-user-select":linb.browser.gek?'none':'',
                top:0,
                overflow:'visible',
                height:'100%'
            },
            'BIGLABEL div':{
                $order:2,
                'text-align':'left',
                'padding-left':'4px'
            },
            TIPS:{
                position:'relative',
                height:'16px',
                'font-size':'12px',
                'line-height':'14px',
                'text-align':'center'
            },
            ACTIVE:{
                'z-index':300,
                position:'relative',
                'border-left': '1px dashed',
                'border-right': '1px dashed',
                left:'-100px',
                width:'0',
                background:0,
                height:'100%'
            },

            ZOOMIN:{
                background: linb.UI.$bg('icons.gif', ' no-repeat  -271px top', true)
            },
            'ZOOMIN-mouseover':{
                $order:2,
                'background-position': '-271px -16px'
            },
            'ZOOMIN-mousedown':{
                $order:3,
                'background-position': '-271px -31px'
            },
            ZOOMOUT:{
                background: linb.UI.$bg('icons.gif', ' no-repeat  -256px top', true)
            },
            'ZOOMOUT-mouseover':{
                $order:2,
                'background-position': '-256px -16px'
            },
            'ZOOMOUT-mousedown':{
                $order:3,
                'background-position': '-256px -31px'
            },
            DATE:{
                background: linb.UI.$bg('icons.gif', ' no-repeat  -46px -65px', true)
            },
            'DATE-mouseover':{
                $order:2,
                'background-position':' -46px -80px'
            },
            'DATE-mousedown':{
                $order:3,
                'background-position':' -46px -95px'
            },
            MIN:{
                background: linb.UI.$bg('icons.gif', ' no-repeat  -31px -65px', true)
            },
            PRE:{
                background: linb.UI.$bg('icons.gif', ' no-repeat  0 -65px', true),
                top:'0'
            },
            'PRE-mouseover':{
                $order:2,
                'background-position': '0 -80px'
            },
            'PRE-mousedown':{
                $order:3,
                'background-position': '0 -95px'
            },
            NEXT:{
                position:'absolute',
                background: linb.UI.$bg('icons.gif', ' no-repeat  -16px -65px', true),
                top:'0'
            },
            'NEXT-mouseover':{
                $order:2,
                'background-position': '-16px -80px'
            },
            'NEXT-mousedown':{
                $order:3,
                'background-position': '-16px -95px'
            },
            ITEM:{
                position:'absolute',
                overflow:'visible'
            },
            'MIN, NORMAL':{
                //position:'absolute',
                //top:0,
                //left:0,
                position:'relative',
                height:'16px',
                overflow:'hidden',
                'z-index':'1'
            },
            'MIN':{
                width:'16px',
                background: linb.UI.$bg('icons.gif', ' no-repeat -30px -65px', true),
                cursor:'pointer'
            },
            'MIN-mouseover':{
                'background-position': '-30px -80px'
            },
            'MIN-mousedown':{
                'background-position': '-30px -95px'
            },
            NORMAL:{
                cursor:'pointer',
                'background-color': '#C6D6F7',
                border:'solid 1px #203A83'
            },
            'NORMAL-mouseover':{
                $order:2,
                'border-color': 'red'
            },
            'LEFT, HEAD, RIGHT':{
                position:'absolute',
                top:0,
                height:'100%'
            },
            HEAD:{
                background: linb.UI.$bg('handler.gif', ' left top', true),
                width:'6px',
                left:'3px',
                cursor:'move',
                'z-index':5
            },
            'LEFT, RIGHT':{
                width:'2px',
                'z-index':10
            },
            'LEFT':{
                cursor:'e-resize',
                left:0
            },
            'RIGHT':{
                cursor:'w-resize',
                right:0
            },
            CON:{
                'padding-left':'12px',
                position:'relative',
                height:'100%',
                overflow:'hidden'
            }
        },
        RenderTrigger:function(){
            var self=this, p=self.properties,cls=self.box;
            self.$active = self.getSubNode('ACTIVE').get(0);
            cls._ajustHeight(self);
            self.boxing().iniContent();
        },
        _onDropMarkShow:function(){linb.DragDrop.setDragIcon('add');return false},
        _onDropMarkClear:function(){linb.DragDrop.setDragIcon();return false},
        _onDragEnter:function(profile,e,src){
            var t=profile.properties,
                ep=linb.Event.getPos(e),
                _left = t._unitPixs/2
            ;
            linb(profile.$active).css('display','block');
            profile.$dd_ox =linb([src]).offset().left+_left;

            profile.$$ondrag=true;
        },
        _onDragLeave:function(profile){
            profile.$$ondrag=profile.$dd_ox=null;

            profile.box._deActive(profile);
        },
        _onDrop:function(profile){
            profile.$$ondrag=profile.$dd_ox=null;

            var r = profile.box._deActive(profile),
                task={id:_.id(),caption:profile.properties.dftTaskName},
                box=profile.box,
                b=profile.boxing();

            task.from = box._getTime(profile, r.left);
            task.to = box._getTime(profile, r.left+r.width);
            task._dropData=linb.DragDrop.getProfile().dragData;

            if(profile.beforeNewTasks && false===b.beforeNewTasks(profile, [task])){}else
                b.addTasks([task]);
        },
        _prepareData:function(profile){
            var p=profile.properties,
                d={},
                date=linb.Date,
                us=date.$TIMEUNIT,
                nodisplay='display:none',
                zoom=profile.box.$zoom,
                m=0,u,
                i,t,label,temp,_date,width,rate,
                _unitParas,
                _dateStart,
                _barCount,_leftBarCount,_rightBarCount,_barCountall,

                smallMarks,smallLabelStart,smallLabelEnd,smallLabelUnit,smallLabelCount,smallLabelFormat
                ;


            d.dateDisplay = p.dateBtn?'':nodisplay;
            d.closeDisplay = p.closeBtn?'':nodisplay;
            d.optDisplay = p.optBtn?'':nodisplay;
            d._showBigLabel=p.showBigLabel?'':nodisplay;

            // for quick move
            p._scroll_offset = p._scrollRate;

            p._lines=[{}];

            //border
            d._bWidth = p.width - 2*p.$borderW;
            d._bHeight = p.height - 2*p.$borderW;
            //view
            p._viewHeight = d._bHeight - (p.showTips&&p._tipsHeight) - (p.showBigLabel?p._bigLabelHeight:0) - p._smallLabelHeight - (p.showBar&&p._barHeight);
            d._tipsdisplay=p.showTips?'':nodisplay;
            d._bardisplay = p.showBar?'':nodisplay;

            //get unitparas from timespan key
            if(p.timeSpanKey){
                _.arr.each(zoom,function(o){
                    if(o[0]===p.timeSpanKey){
                        _unitParas=p._unitParas=o;
                        return false;
                    }
                });
                //give a default key
                if(!_unitParas)
                    _unitParas=p._unitParas=zoom[p.timeSpanKey='1 d'];
            }
            //if no timeSpanKey( _unitParas) input,
            d.zoomDisplay = (p.zoomable && _unitParas)?'':nodisplay

            if(_unitParas){
                p._unitPixs = p.unitPixs||_unitParas[1];
                p._smallLabelCount = p.smallLabelCount||_unitParas[2];
                p._smallLabelUnit = p.smallLabelUnit||_unitParas[3];
                p._smallLabelFormat = p.smallLabelFormat||_unitParas[4];
                p._bigLabelCount = p.bigLabelCount||_unitParas[5];
                p._bigLabelUnit = p.bigLabelUnit||_unitParas[6];
                p._bigLabelFormat = p.bigLabelFormat||_unitParas[7];
                p._timeFormat = p.timeFormat||_unitParas[8];
            }
            u=p._unitPixs;
            smallLabelCount = p._smallLabelCount;
            smallLabelUnit = p._smallLabelUnit;
            smallLabelFormat = p._smallLabelFormat;

            // get bar count in view
            _barCount = (Math.ceil(p.width / u)||0);
            _leftBarCount = p.leftSpanCount?p.leftSpanCount:_barCount;
            _rightBarCount = p.rightSpanCount?p.rightSpanCount:_barCount;
            _barCountall =  _barCount + _leftBarCount + _rightBarCount;

            // ms per px
            rate = p._rate = us[smallLabelUnit]*smallLabelCount/u;

            //adjust dateStart
            if(p.maxDate&& date.add(p.dateStart,'ms',p.width*rate) > p.maxDate)
                p.dateStart=date.add(p.maxDate,'ms',-p.width*rate);
            if(p.minDate&& p.dateStart<p.minDate)
                p.dateStart=p.minDate;

            // get the round start from the approximate start
            _dateStart = date.getTimSpanStart(p.dateStart, smallLabelUnit, smallLabelCount);
            // rel start in band
            smallLabelStart=p._smallLabelStart = date.add(_dateStart, smallLabelUnit, -_leftBarCount*smallLabelCount);
            // rel to in band
            smallLabelEnd = p._smallLabelEnd = date.add(smallLabelStart, smallLabelUnit, _barCountall*smallLabelCount);

            // get band with
            p._band_width = Math.ceil(date.diff(smallLabelStart,smallLabelEnd, 'ms')/rate);

            // set band left
            p._band_left_fix = p._band_left = - Math.ceil(date.diff(smallLabelStart, p.dateStart, 'ms')/rate);

            // build bars
            smallMarks = p._smallMarks = [];

            temp=0;
            label=date.get(smallLabelStart, smallLabelFormat);
            for(i=0; i< _barCountall; i++){
                _date = date.add(smallLabelStart, smallLabelUnit, smallLabelCount*(i+1));
                width = Math.ceil(date.diff(smallLabelStart, _date, 'ms')/rate);
                smallMarks.push({
                    left : temp,
                    width : width - temp,
                    text : label
                });
                temp=width;
                label=date.getText(_date, smallLabelFormat);
            }


            if(p.showBigLabel){
                var _barCount2,off,
                    bigMarks,bigLabelStart,bigLabelEnd,

                    bigLabelCount = p._bigLabelCount,
                    bigLabelUnit = p._bigLabelUnit,
                    bigLabelFormat = p._bigLabelFormat
                    ;

                bigMarks = p._bigMarks = [];
                bigLabelStart=p._bigLabelStart =date.getTimSpanStart(smallLabelStart, bigLabelUnit, bigLabelCount);
                bigLabelEnd=p._bigLabelEnd = date.getTimSpanEnd(smallLabelEnd, bigLabelUnit, bigLabelCount);
                _barCount2 = date.diff(bigLabelStart, bigLabelEnd, bigLabelUnit)/bigLabelCount;
                off=date.diff(smallLabelStart, bigLabelStart, 'ms')/rate;
                label=date.getText(bigLabelStart, bigLabelFormat);
                temp=0;
                for(i=0; i< _barCount2; i++){
                    _date = date.add(bigLabelStart, bigLabelUnit, bigLabelCount*(i+1));
                    width = date.diff(bigLabelStart, _date, 'ms')/rate;
                    bigMarks.push({
                        left : Math.ceil(temp + off),
                        width : Math.ceil(width - temp),
                        text : label
                    });
                    temp=width;
                    label=date.getText(_date, bigLabelFormat);
                }
            }
            return arguments.callee.upper.call(this, profile, d);
        },
        _prepareItem:function(profile, item, oitem, pid){
            var self=this,
                t=profile.properties,
                index;
            if(!item.id)item.id=_.id();
            if(!item.caption)item.caption=t.dftTaskName;
            item._min=false;
            // caculate left and width
            item._left = self._getX(profile, item.from);
            item._width=Math.max(self._getX(profile, item.to) - item._left, 0);
            if(t.multiTasks){
                if(item._width<=16){
                    item._width=16;
                    item._min=true;
                }
            }
            item._minDisplay=item._min?'':'display:none';
            item._normalDisplay=item._min?'display:none':'';

            // caculate top and set task to lines cache
            index = self._getLinePos(profile, item);
//min region is alway 16 + 3
            item._top = t.multiTasks? 'top:' + (item._min?0:((t.taskHeight+3) * (index-1) + 16 + 3)) + 'px' : '';

            item._height = 'height:' + (t.multiTasks?item._min?'16px':t.taskHeight+'px':'100%');
            item._border = t.multiTasks?'':'border-top:0;border-bottom:0';

            item._background = item.background?'background:'+item.background+';':'';

            t._lines = t._lines || [{}];

            //set double link
            t._lines[index][item.id]=item;
            item._line = index;

            oitem._left=item._left;
            oitem._width=item._width;
            oitem._min=item._min;
            oitem._line=item._line;
        },
        $zoom:[
            /*
            *[
            *  id,
            *  small span unit count,
            *  small span unit,
            *  small span to big span function,
            *  small span lable format,
            *  big span lable format,
            *  value format
            *]
            */
            ['10 ms', 54, 10, 'ms', 'ms', 100, 'ms','hnsms','hnsms'],
            ['100 ms',54,  100, 'ms', 'ms', 1, 's','hns','hnsms'],
            ['1 s',30,  1, 's','s', 10, 's','hns','hnsms'],
            ['10 s', 30, 10, 's', 's',60, 's','hns','hnsms'],
            ['1 n',30,  1, 'n','n', 10, 'n','dhn','hns'],
            ['5 n', 30, 5, 'n','n', 30, 'n','mdhn','hns'],
            ['10 n', 30, 10, 'n','n', 60, 'n','mdhn','hns'],
            ['30 n', 30, 30, 'n','n', 4, 'h','ymdh','mdhn'],
            ['1 h', 30, 1, 'h','h',  6, 'h','ymdh','mdhn'],
            ['2 h', 30, 2, 'h','h', 12, 'h','ymdh','mdhn'],
            ['6 h', 30, 6, 'h','h', 24, 'h','ymd','mdhn'],
            ['1 d', 24, 1, 'd','w', 1, 'ww','ymd','ymdh'],
            ['1 w', 30, 1, 'ww','ww', 4, 'ww','ymd','ymd'],
            ['15 d', 30, 15, 'd','d', 2, 'm','ymd','ymd'],

//Not every unit width is the same value:
            ['1 m',  30,1, 'm','m', 1, 'q','yq','ymd'],
            ['1 q',  30,1, 'q','q', 1, 'y','y','ymd'],
            ['1 y',  48,1, 'y','y', 10, 'y','y','ym'],
            ['1 de',  48, 1, 'de','de', 100, 'y','y','ym'],
            ['1 c',  48, 1, 'c', 'c', 1000, 'y','y','y']

        ],
        _focus:function(profile){
            profile.getSubNode('FOCUS').focus(1);
        },
        _getTips:function(profile){
            var t,s='$dd_tooltip';
            if(t = profile[s] || (profile[s] = profile.getSubNode('TIPS').get(0).childNodes[0]))
                return t.nodeValue;
            else
                return profile.getSubNode('TIPS').get(0).innerHTML;
        },
        _rr:/\<[^>]*\>/g,
        _setTips:function(profile, text, force){
            if(!force && profile.pauseA)return;
            var t,s='$dd_tooltip';
            text=text.replace(this._rr,'');
            if(t = profile[s] || (profile[s] = profile.getSubNode('TIPS').get(0).childNodes[0])){
                if(t.nodeValue!=text)t.nodeValue=text;
            }else
                profile.getSubNode('TIPS').get(0).innerHTML=text;
        },
        _getX:function(profile, time){
            var t=profile.properties,d=new Date;
            d.setTime(time);
            return (Math.ceil(linb.Date.diff(t._smallLabelStart, d, 'ms')||0) / t._rate);
        },
        _getTime:function(profile, x, flag){
            var t=profile.properties;
            t = linb.Date.add(t._smallLabelStart, 'ms', x*t._rate);
            return flag?t:t.getTime();
        },
        _moveActive:function(profile, src, x, w){
            var p=Math.ceil,
                t=profile.properties,
                d=linb.Date,
                s=t._smallLabelStart,
                r=t._rate,
                u=t._timeFormat,
                ms='ms',
                y=src.style,
                z='px',
                m,n,increment;

            if(increment=t.increment){
                m=x;
                x=Math.floor(x/increment)*increment;
                w=Math.floor((w-x+m+increment-1)/increment)*increment;
            }

            m = (p(x)||0);
            n = ((p(w)||0)-2);
            if(n>0){
                y.left= m+z;
                y.width= n+z;
                if(t.showTips)
                    profile.box._setTips(profile, d.getText(d.add(s, ms, x*r),u)
                        + " - "
                        + d.getText(d.add(s, ms, (x+w)*r),u)
                    )
            }
        },
        _deActive:function(profile){
            var t=profile.$active.style, x=parseInt(t.left)||0, w=(parseInt(t.width)||0)+2;
            t.left='-1000px';
            if(profile.properties.showTips)
                profile.box._setTips(profile, '');
            return {left :x, width :w};
        },
        _minusLeft:function(profile,marks,node,offsetCount){
            var t=profile.properties;
            while((offsetCount--)>0){
                node.first().remove();
                temp=marks.shift();
            }
        },
        _minusRight:function(profile,marks,node,offsetCount){
            var t=profile.properties;
            while((offsetCount--)>0){
                node.last().remove();
                temp=marks.pop();
            }
        },
        _addLeft:function(profile, tag, node, offsetCount,  offset){
            // get additional bars
            var t=profile.properties,
                date=linb.Date,
                key=tag+'Marks',
                marks=t[key],
                labelStart=t[tag+'LabelStart'],
                labelUnit=t[tag+'LabelUnit'],
                labelCount=t[tag+'LabelCount'],
                labelFormat=t[tag+'LabelFormat'],
                rate=t._rate,
                addLb=[],
                temp,label,_date,i;

            temp=0;
            label=date.getText(labelStart, labelFormat);
            for(i=0; i< offsetCount; i++){
                _date = date.add(labelStart, labelUnit, labelCount*(i+1));
                width = date.diff(labelStart, _date, 'ms')/rate;
                addLb.push({
                    left : Math.ceil(temp + (offset||0)-0.0000000000003),
                    width : Math.ceil(width - temp),
                    text : label
                });
                temp=width;
                label=date.getText(_date, labelFormat);
            }
            addLb.reverse();
            // add to band UI
            node.prepend(_.str.toDom(profile.buildItems(key, addLb)));
            // add to memory list
            _.arr.insertAny(marks,addLb.reverse(),0);
        },
        _addRight:function(profile, labelEnd, tag, node, offsetCount,  offset){
            var t=profile.properties,
                date=linb.Date,
                key=tag+'Marks',
                marks=t[key],
                labelStart=t[tag+'LabelStart'],
                labelUnit=t[tag+'LabelUnit'],
                labelCount=t[tag+'LabelCount'],
                labelFormat=t[tag+'LabelFormat'],
                rate=t._rate,
                addLb=[],_d1,
                _date,i;
            _d1=labelEnd;
            for(i=0; i<offsetCount; i++){
                _date = date.add(labelEnd, labelUnit, labelCount*(i+1));
                addLb.push({
                    left : Math.ceil(date.diff(labelStart,_d1,'ms')/rate+ (offset||0)-0.0000000000003),
                    width : Math.ceil(date.diff(_d1, _date, 'ms')/rate),
                    text : date.getText(_d1, labelFormat)
                });
                _d1=_date;
            }
            // build
            // add to band UI
            node.append(_.str.toDom(profile.buildItems(key, addLb)));
            // add to memory list
            _.arr.insertAny(marks,addLb,-1);
        },
        _getMoveNodes:function(profile){
            return profile.$moveban = profile.$moveban || profile.getSubNodes(['BAND','ITEMS']);
        },
        //if left is numb, force to move
        _rePosition:function(profile, left){
            profile.pause=true;
            var self=this,
                date = linb.Date,
                t=profile.properties,
                rate=t._rate,
                label,m,n,
                labelsBottom = profile.getSubNode('SMALLLABEL'),
                band = self._getMoveNodes(profile),
                x = left || band.left(),
                //ralated to the fix position
                offset = x - t._band_left_fix;

            // if offset out a bar width
            if(Math.abs(offset)/t._unitPixs >=1 || left){
                var offsetCount = parseInt(offset/t._unitPixs),
                    bak_s = t._smallLabelStart,
                    bak_e = t._smallLabelEnd,
                    _c=-offsetCount*t._smallLabelCount,
                    offsetPxs,
                    _smallLabelStart,
                    _smallLabelEnd;

                _smallLabelStart=t._smallLabelStart = date.add(t._smallLabelStart, t._smallLabelUnit, _c);
                _smallLabelEnd=t._smallLabelEnd = date.add(t._smallLabelEnd, t._smallLabelUnit, _c);
                offsetPxs = Math.ceil(date.diff(_smallLabelStart, bak_s, 'ms')/rate);

                band.left(x - offsetPxs);

                // reset band paras
                t._band_width = Math.ceil(date.diff(_smallLabelStart, _smallLabelEnd, 'ms')/rate);

                //reset tasks position var
                _.arr.each(t.items,function(o){
                    o._left += offsetPxs;
                    profile.box._trimTask(profile,o);
                });
                labelsBottom.children().each(function(o){
                    o.style.left = (parseFloat(o.style.left)||0) + offsetPxs + "px";
                });
                _.arr.each(t._smallMarks,function(o){
                    o.left += offsetPxs;
                });

                // delete out, andd add to blank
                if(offsetCount>0){
                    self._minusRight(profile,t._smallMarks, labelsBottom,offsetCount);
                    self._addLeft(profile, '_small', labelsBottom, offsetCount);
                }else{
                    self._minusLeft(profile,t._smallMarks, labelsBottom, -offsetCount);
                    self._addRight(profile, bak_e, '_small', labelsBottom, -offsetCount);
                }

                if(t.multiTasks){
                    var arr=[];
                    // remove tasks
                    _.arr.each(t.items,function(o){
                        if(o._left >= t._band_width ||  (o._left+o._width) <= 0){
                            //delete from lines
                            delete t._lines[o._line][o.id];
                            arr.push(o.id);
                        }
                    });
                    profile.boxing().removeItems(arr);

                    if(profile.onGetContent)
                        profile.boxing()._getContent(offsetCount>0 ? _smallLabelStart : bak_e,
                            offsetCount>0 ? bak_s : _smallLabelEnd,
                            t._rate,
                            offsetCount>0 ? 'left' : 'right');
                    
                    //adjust the items
                    self._reArrage(profile);
                }

                if(t.showBigLabel){
                    var labelsTop = profile.getSubNode('BIGLABEL'),
                        bigLabelUnit=t._bigLabelUnit,
                        bigLabelCount=t._bigLabelCount,
                        off,
                        offsetCount2,offsetCount3,
                        bigLabelStart,bigLabelEnd;
                    bak_e=t._bigLabelEnd;

                    labelsTop.children().each(function(o){
                        o.style.left = (parseFloat(o.style.left)||0) + offsetPxs + "px";
                    });
                    _.arr.each(t._bigMarks,function(o){
                        o.left += offsetPxs;
                    });
                    bigLabelStart=date.getTimSpanStart(_smallLabelStart, bigLabelUnit, bigLabelCount);

                    offsetCount2 = Math.ceil(date.diff(_smallLabelStart, t._bigLabelStart, bigLabelUnit)/bigLabelCount);
                    offsetCount3 = Math.ceil(date.diff(t._bigLabelEnd, _smallLabelEnd, bigLabelUnit)/bigLabelCount);

                    //reset offset of big and small
                    if(offsetCount2){
                        off = date.diff(_smallLabelStart, bigLabelStart, 'ms')/rate;
                        t._bigLabelStart=bigLabelStart;
                        if(offsetCount2>0)
                            self._addLeft(profile, '_big',labelsTop, offsetCount2, off);
                        else
                            self._minusLeft(profile,t._bigMarks, labelsTop, -offsetCount2);
                    }
                    //reset offset of big and small
                    if(offsetCount3){
                        off = date.diff(_smallLabelStart, bigLabelStart, 'ms')/rate;
                        t._bigLabelEnd=date.add(t._bigLabelEnd, bigLabelUnit, offsetCount3*bigLabelCount);
                        if(offsetCount3<0)
                            self._minusRight(profile,t._bigMarks, labelsTop, -offsetCount3);
                        else
                            self._addRight(profile, bak_e, '_big',labelsTop, offsetCount3, off);
                    }
                }
            }
            // reset date start point
            t._band_left = band.left();
            t.dateStart = self._getTime(profile, -t._band_left, 1);

            profile.pause = false;
        },
        _trimTask:function(profile, o){
            //****
            // if too long, cut left
            var l=-12,
                x=o._left,
                w=o._width,
                bw=profile.properties._band_width;
            if(x < l){
                if(x+w<l)
                    w=0;
                else
                    w = w + x - l;
                x = l;
            }
            if(x>bw+12)x=bw+12;
            this._setItemNode(profile, o,'left',x+'px');
            // if too long, cut right
            if(x + w > bw - l)
                w = bw - l - x;
            if(w>=0)
                this._setItemNode(profile, o,'width',w+'px');
        },
        _setItemNode:function(profile, item, key, value){
            var t=profile.getSubNodeByItemId('ITEM',item.id).get(0);
            t.style[key]=value;
        },
        _getLinePos:function(profile,o){
            if(o._min)return 0;

            var t=profile.properties,
                b=false,
                index=0;
            _.arr.each(t._lines,function(v,i){
                if(i===0)return;
                b=true;
                _.each(v,function(v){
                    if(o.id!==v.id)
                        if(((o._left + o._width)>=v._left) && ((v._left + v._width)>=o._left))
                            return b=false;
                });
                if(b){index=i;return false;}
            });
            if(!b)
                index = t._lines.push({})-1;
            return index;
        },
        // _reArrage tasks for top position
        _reArrage:function(profile){
            var self=this, o, h,
                t=profile.properties;
            t._lines.length = 1;
            t.items.sort(function(x,y){
                return x.from>y.from?1:x.from==y.from?0:-1;
            });
            //re caculate from current line
            _.arr.each(t.items,function(v){
                if(v._line===0)return;

                //get pos from current line
                index = self._getLinePos(profile, v);
                t._lines[index][v.id]=v;
                // if has space, reset position
                if(v._line !== index){
                    // reset double link
                    v._line = index;
                    // set top
                    if(t.multiTasks)
                        self._setItemNode(profile, v,'top',((t.taskHeight+3) * (index-1) + 16 + 3) +'px');
                };
            });

            h = t._linesHeight =  (t._lines.length+1) * (t.taskHeight);

            self._ajustHeight(profile);
        },
        _resetItem:function(profile,o,src){
            var p=profile.properties,
                t=profile.getItemByDom(src),
                bandW=p._band_width + 12,
                f=function(k,i){return profile.getSubNodeByItemId(k,i)},
                timeline=profile.box,
                max=Math.max;

            if(o.left){
                t._left=o.left;
                t.from = timeline._getTime(profile,o.left);
                src.style.left=o.left+'px';
            }
            if(o.width){
                t._width=max(o.width, 0);
                t.to = timeline._getTime(profile,o.left+o.width);
                if(p.multiTasks){
                    // if too small, show min
                    if(t._width<=16){
                        t._width=o.width=16;
                        if(!t._min){
                            t._min=true;
                            f('NORMAL',t.id).css('display','none');
                            f('MIN',t.id).css('display','block');
                        }
                    // else show normal
                    }else{
                        if(t._min){
                            delete t._line;
                            t._min=false;
                            f('NORMAL',t.id).css('display','block');
                            f('MIN',t.id).css('display','none');
                        }
                        // if too long ,cut right
                        if(o.left + o.width > bandW)
                            o.width = bandW - o.left;
                    }
                }
                src.style.width=o.width+'px';
                if(linb.browser.ie && !p.multiTasks)
                    linb([src.parentNode]).ieRemedy();
            }
            // _reArrage top position
            timeline._reArrage(profile);
        },
        _ajustHeight:function(profile){
            var p=profile.properties,
                f=function(p){return profile.getSubNode(p)},
                view = f('VIEW'),
                items = f('ITEMS'),
                scroll = f('SCROLL'),
                scrolli= f('SCROLLI'),
                h,b,
                ih=p._linesHeight||0,
                vh=view.height();

            h=Math.max(ih,vh);
            items.height(h);
            scrolli.height(h);
            b=ih>vh;
            scroll.css('display',b?'block':'none');
            items.top(b?-scroll.scrollTop():0);
        },
        _showTips:function(profile, node, pos){
            if(profile.onShowTips)
                return profile.boxing().onShowTips(profile, node, pos);
             
             var t=profile.properties,
                id=node.id,
                format=t._timeFormat,
                sid=profile.getSubId(id),
                map=profile.SubSerialIdMapItem,
                item=map&&map[sid],
                date=linb.Date;

            if(t.disabled)return;
            if(item && item.disabled)return;
            if(item){
                item.tips = '<p style="font-weight:bold">'+item.caption +'</p>'+ date.getText(new Date(item.from),format)+" - "+date.getText(new Date(item.to),format);
                linb.Tips.show(pos, item);
                return true;
            }else
                return false;
        },
        _beforeSerialized:function(profile){
            var w=profile.properties.width,
                o=arguments.callee.upper.call(this, profile);
            o.properties.width=w;
            return o;
        },
        _onresize:function(profile,width,height){
            var p=profile.properties,
                f=function(k){return profile.getSubNode(k)},
                off1=2*p.$borderW,
                off2=3,
                t;
            //for border, view and items
            if(height && height!=p.height && parseInt(profile.domNode.style.height)){
                f('BORDER').height(t=height-off1);
                f('VIEW').height(t=t - (p.showTips&&p._tipsHeight) -off2 - (p.showBigLabel?p._bigLabelHeight:0) - p._smallLabelHeight - (p.showBar&&p._barHeight));
                this._ajustHeight(profile);

                if(p.height!=height)p.height=height;
            }
            if(width && width!=p.width){
                f('BORDER').width(width-off1);
                p.width=width;

                //if width changed, refresh the timeline
                if(!p.fixWidth){
                    _.resetRun(profile.$id+":refresh",function(){
                        //if multiTasks, setUIValue will be ignored
                        profile.box._refresh(profile)._focus(profile);
                    });
                }
            }
        },
        _refresh:function(profile){
            //if multiTasks, setUIValue will be ignored
            profile.boxing().clearItems().refresh().setUIValue(profile.properties.$UIvalue);
            return this;
        }
    }
});Class("linb.UI.LinkList", ["linb.UI.List"],{
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate();
        t.$dynamic={
            items:{
                ITEM:{
                    className:'{itemClass} {disabled}',
                    style:'margin:{itemMargin}px;{itemStyle}',
                    LINK:{
                        $order:1,
                        tagName : 'a',
                        href :"{href1}",
                        tabindex: '{_tabindex}',
                        text:'{caption}'
                    }
                }
            }
        };
        this.setTemplate(t);
    },
    Static:{
        Appearances:{
            ITEMS:{
                position:'relative',
                overflow:'auto',
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':''
            },
            ITEM:{
                'vertical-align':'middle',
                position:'relative',
                background: linb.UI.$bg('icons.gif', ' no-repeat left -130px', true),
                'border-right':'solid 1px #7C9CBC',
                height:'16px',
                padding:'3px',
                'white-space':'nowrap'
            },
            'ITEM-mouseover':{
                $order:1,
                'background-position': 'left -153px'
            },
            'ITEM-mousedown':{
                $order:1,
                'background-position': 'left -176px'
            },
            'ITEM-checked':{},
            LINK:{
                display:linb.$inlineBlock,
                zoom:linb.browser.ie6?1:null,
                'vertical-align':'middle',
                padding:'1pt 4px 1pt 12px'
            }
        },
        DataModel:({
            itemMargin:{
                ini:0,
                action:function(value){
                    this.getSubNode('ITEM',true).css('margin',value+'px');
                }
            },
            tabindex:{
                action:function(value){
                    var self=this,
                        keys = self.keys,
                        fun = function(l,v){self.getSubNode(l,true).attr('tabIndex',v)}
                    if(self.domNode)
                        fun('LINK', value);
                }
            }
        }),
        Behaviors:{
            ITEM:{onClick:null,onKeydown:null},
            LINK:{
                onClick:function(profile, e){return !!linb.Event.getKey(e)[2]},
                onMousedown:function(profile, e, src){
                    if(linb.Event.getBtn(e)!='left')return;
                    var properties = profile.properties,
                        item = profile.getItemByDom(src),
                        box = profile.boxing();
                    if(properties.disabled|| item.disabled)return false;
                        box.onItemClick(profile, item, src);
                }
            }
        },
        EventHandlers:{
            onItemSelected:null,
            onItemClick:function(profile, item, src){}
        },
        _prepareItem:function(profile, item){
            var p = profile.properties;
            item._tabindex = p.tabindex;
            item.itemMargin = p.itemMargin;
        }
    }
});
Class("linb.UI.Poll", "linb.UI.List",{
    Instance:{
        fillContent:function(id, obj){
            var profile=this.get(0),t,item;
            if(profile.domNode){
                if(item=profile.getItemByItemId(id)){
                    t=profile.getSubNodeByItemId('BODY',id).html('');
                    if(obj){
                        item._obj = obj;
                        item._fill=true;
                        if(typeof obj=='string')t.html(obj);
                        else t.append(obj.render(true));
                    }else
                        item._obj=item._fill=null;
                }
            }
            return this;
        },
        _setOptCap:function(item, value){
            return this.each(function(pro){
                var items = pro.properties.items,
                i = pro.queryItems(pro.properties.items, function(o){
                    return o.id==item.id;
                },false,true);
                if(i && (i=i[0])){
                    i.caption=value;
                    if(pro.domNode)
                        pro.getSubNodeByItemId('CAPTION',i.id).html(value);
                }
            });
        },
        getBindEditor:function(){
            return this.get(0)._bind;
        },
        _insertOpt:function(opt){
            if(!opt.id)opt.id='$'+_();
            this.insertItems([opt],null, false);
            return this;
        },
        _removeOpt:function(id){
            this.removeItems([id],'OUTER');
            return this;
        },
        _setDirtyMark:function(){return this}
    },
    Initialize:function(){
        var self=this;
        self.addTemplateKeys(['MARK2','MARK3','EDIT']);
        //modify default template fro shell
        var t = self.getTemplate();
        t.TITLE={
            $order:2,
            tagName : 'DIV',
            style:'{titleDisplay}',
            text : '{title}',
            className:"uibg-bar uiborder-outset {disabled} {_cls}"
        };
        t.TAIL={
            $order:20,
            tagName : 'DIV',
            className:"uibg-bar uiborder-outset {disabled}",
            text:"{cmds}"
        };
        t.$dynamic={
            items:{
                OUTER:{
                    tagName:'div',
                    className:'uibg-bar uiborder-outset',
                    TOGGLE:{
                        className:'uicmd-toggle',
                        style:'{_togdisplay}'
                    },
                    ITEM:{
                        tagName: 'a',
                        href :linb.$href,
                        tabindex: '{_tabindex}',
                        className:'{itemClass} {disabled}',
                        style:'{itemStyle}',
                        OPTION:{
                            $order:0,
                            tagName : 'DIV',
                            MARK:{$order:1,className:'{_optclass}'}
                        },
                        CAPTION:{
                            $order:1,
                            tagName : 'DIV',
                            text : '{caption}',
                            className:"{disabled} {_itemcls}"
                        },
                        CHART:{
                            $order:2,
                            tagName : 'DIV',
                            style:'{_display}',
                            CAST:{
                                $order:0,
                                text:'{message}'
                            },
                            PROGRESS:{
                                $order:1,
                                style:'background-position: -{_per}px -200px;',
                                PROGRESSI:{}
                            },
                            DEL:{
                                $order:2,
                                className:'ui-btn',
                                style:'{_del}',
                                DELI:{
                                    className:'ui-btni',
                                    DELA:{
                                        tagName:'button',
                                        text:'{removeText}'
                                    }
                                }
                            }
                        },
                        CLEAR:{
                            $order:3,
                            tagName : 'DIV'
                        }
                    },
                    BODY:{
                        $order:1,
                        tagName : 'DIV',
                        text:'{_body}'
                    }
                }
            },
            cmds:{
                CMD:{
                    className:'ui-btn',
                    CMDI:{
                        className:'ui-btni',
                        CMDA:{
                            tagName:'button',
                            tabindex: '{_tabindex}',
                            text:'{caption}'
                        }
                    }
                }
            }
        };
        self.setTemplate(t);

        //for modify
        var inlineEdit=function(profile,node,flag,value,item){
            var o,useC,prop=profile.properties,
                callback=function(v){
                    var b=profile.boxing();
                    switch(flag){
                        //edit option
                        case '1':
                            if(b.beforeItemChanged(profile, item, v)!==false)
                                b._setOptCap(item,v);
                        break;
                        //new option
                        case '2':
                            if(b.beforeOptionAdded(profile, v)!==false ){
                                var id="["+v.replace(/[^\w_]*/g,'')+"]";
                                b._insertOpt({caption:v,id:id});
                                if(!profile.properties.editable){
                                    profile.boxing().fireItemClickEvent(id);
                                }
                            }
                        break;
                        //edit title
                        default:
                            if(b.beforeTitleChanged(profile, v)!==false)
                                b.setTitle(v);
                    }
                };

            if(profile.onCustomEdit)
                if(o=profile._bind=profile.boxing().onCustomEdit(profile, node, flag, value, item, callback))
                    useC=true;
            if(!useC){
                o=profile._bind;
                if(!o){
                    var pp={type:prop.editorType,saveBtn:true,left:-10000,top:-10000};
                    profile._bind=o=linb.create('ComboInput', pp);
                    o.onHotKeydown(function(p,key){
                        if(key=='enter'){
                            p.boxing().onSave(p);
                            return false;
                        }else if(key=='esc'){
                            o.hide();
                            return false;
                        }
                    })
                    profile.root.append(o);
                }

                var r=node.cssRegion(true,profile.root);
                if(r.height>o.getHeight())
                    o.setHeight(r.height);
                else
                    r.top-=3;
                if(r.top<0)r.top=0;

                o.setValue(value||'',true)
                .setWidth(r.width + (parseInt(node.css('paddingLeft'))||0)+ (parseInt(node.css('paddingRight'))||0))
                .onSave(function(p){
                    var pro=p.properties,v=pro.$UIvalue, ov=pro.value;
                    if(v!=ov)
                        callback(v);
                    _.asyRun(function(){
                        o.hide();
                    });
                })
                .reBoxing()
                .setBlurTrigger(o.KEY+":"+o.$id, function(){
                    o.hide();
                })
                .show(r.left+'px',r.top+'px');

                _.asyRun(function(){
                    o.activate()
                });
            }
        };

        t = self.getBehavior();
        var old=t.ITEM.onClick;
        t.ITEM.onClick = function(profile, e, src){
            var p = profile.properties,
                item = profile.getItemByDom(src),
                editable=item.id=='$custom' || item.editable;
            if(p.disabled)return;

            if(p.editable)
                inlineEdit(profile, profile.getSubNodeByItemId('CAPTION',item.id), editable?'2':'1', editable?'':item.caption, item);
            else{
                if(editable)
                    inlineEdit(profile, profile.getSubNodeByItemId('CAPTION',item.id), '2');
                else
                    old.apply(this, arguments);
            }
        };
        t.TITLE={
            onClick : function(profile, e, src){
                var p = profile.properties,
                    item = profile.getItemByDom(src);
                if(p.disabled)return;

                if(p.editable)
                    inlineEdit(profile, profile.getSubNode('TITLE'), '3', p.title);
            }
        };
        t.DEL={
            onClick : function(profile, e, src){
                var p = profile.properties,
                    b = profile.boxing(),
                    item = profile.getItemByDom(src);
                if(p.disabled)return;
                if(b.beforeOptionRemoved(profile, item)!==false )
                    b._removeOpt(item.id);
                return false;
            }
        }
        t.CMD={
            onClick : function(profile, e, src){
                var p = profile.properties,
                    key = profile.getSubId(src.id);
                if(p.disabled)return;
                profile.boxing().onClickButton(profile, key, src);
            }
        };
        t.TOGGLE={
            onClick:function(profile, e, src){
                var properties = profile.properties,
                    items=properties.items,
                    item = profile.getItemByDom(src),
                    itemId = profile.getSubId(src.id),
                    node = linb([src]),
                    body = profile.getSubNode('BODY',itemId),t
                    ;
                if(item._show){
                    node.tagClass('-checked',false);
                    body.css('display','none');
                }else{
                    node.tagClass('-checked');
                    body.css('display','block');
                    //fill value
                    if(!item._fill){
                        item._fill=true;
                        var callback=function(o){
                            profile.boxing().fillContent(item.id, item._body=o);
                        };
                        if(profile.onGetContent){
                            var r = profile.boxing().onGetContent(profile, item, callback);
                            if(r) callback(r);
                        }else
                            callback(profile.box._buildBody(profile, item));
                    }
                }

                item._show=!item._show;

                //prevent href default action
                //return false;
            }
        };

        self.setBehavior(t);
    },
    Static:{
        ITEMKEY:'OUTER',
        Appearances:{
            KEY:{
                'font-size':'12px',
                zoom:linb.browser.ie?1:null
            },
            'TITLE, ITEMS, TAIL':{
                position:'relative',
                overflow:'auto',
                'line-height':'14px'
            },
            TAIL:{
                zoom:linb.browser.ie?1:null,
                'padding':'5px 0 5px 40px'
            },
            CMD:{
                margin:'3px',
                'white-space':'nowrap',
                'vertical-align':'middle'
            },
            TITLE:{
                'font-weight':'bold',
                padding:'4px'
            },
            ITEMS:{
                'overflow-x': (linb.browser.ie || linb.browser.gek)?'hidden':'',
                zoom:linb.browser.ie?1:null            },
            OUTER:{
                position:'relative',
                zoom:linb.browser.ie?1:null,
                'padding-left':'15px'
            },
            TOGGLE:{
                position:'absolute',
                left:0,
                top:'4px'
            },
            BODY:{
                display:'none',
                'padding-left':'27px'
            },
            ITEM:{
                display:'block',
                position:'relative',
                zoom:linb.browser.ie?1:null,
                padding:'4px 2px 4px 2px'
            },
            'ITEM-checked':{},
            'ITEM-mouseover':{},
            'ITEM-mousedown':{},
            OPTION:{
                position:'absolute',
                left:'2px',
                top:'4px'
            },
            CAPTION:{
                'float':'left',
                zoom:linb.browser.ie?1:null,
                'margin-left':'24px',
                //{*1*}for: ie6 double margin bug
                display:linb.browser.ie6?'inline':null
            },
            'EDIT, EDITS':{
                $order:2,
                'float':'none',
                'background-color':'#EBEADB',
                cursor:'pointer',
                //{*1*}for: ie6 double margin bug
                display:linb.browser.ie6?'block':null
            },

            CHART:{
                'float':'right'
            },
            CLEAR:{
                clear:'both',
                'text-align':'right'
            },
            'PROGRESS, PROGRESSI':{
                width:'150px',
                height:'14px',
                border:0,
                'line-height':0,
                'font-size':0
            },
            PROGRESS:{
                'margin-left':'2px',
                background: linb.UI.$bg('icons.gif', ' no-repeat -130px -200px', true)
            },
            PROGRESSI:{
                background: linb.UI.$bg('icons.gif', ' no-repeat -150px -216px ', true)
            },
            'MARK, MARK2, MARK3' : {
               cursor:'pointer',
               width:'16px',
               height:'16px',
                'vertical-align':'middle',
               'margin-right':'6px'
            },
            MARK:{
               background: linb.UI.$bg('icons.gif', ' no-repeat -145px top', true)
            },
           'ITEM-mouseover MARK':{
                $order:1,
                'background-position':' -145px -17px'
           },
           'ITEM-mousedown MARK':{
                $order:2,
                'background-position':' -145px -34px'
           },
           'ITEM-checked MARK':{
                $order:3,
                'background-position':' -128px top'
           },
           'ITEM-checked-mouseover MARK':{
                $order:4,
                'background-position':' -128px -17px'
           },
           'ITEM-checked-mousedown MARK':{
                $order:5,
                'background-position':' -128px -34px'
            },
            MARK2:{
               background: linb.UI.$bg('icons.gif', ' no-repeat -112px top', true)
            },
           'ITEM-mouseover MARK2':{
                $order:1,
                'background-position':' -112px -17px'
           },
           'ITEM-mousedown MARK2':{
                $order:2,
                'background-position':' -112px -34px'
           },
           'ITEM-checked MARK2':{
                $order:3,
                'background-position':' -96px top'
           },
           'ITEM-checked-mouseover MARK2':{
                $order:4,
                'background-position':' -96px -17px'
           },
           'ITEM-checked-mousedown MARK2':{
                $order:5,
                'background-position':' -96px -34px'
            },
            MARK3:{
                $order:11,
               background: linb.UI.$bg('icons.gif', ' no-repeat -56px -222px', true)
            },
           'ITEM-mouseover MARK3':{
                $order:11,
                'background-position':' -56px -222px'
           },
           'ITEM-mousedown MARK3':{
                $order:11,
                'background-position':' -56px -222px'
           },
            DEL:{
                margin:'0 0 0 4px'
            }
        },
        DataModel:{
            $checkbox:1,
            title:{
                action:function(v){
                    this.getSubNode('TITLE').html(v);
                }
            },
            selMode:{
                ini:'single',
                listbox:['single','multi'],
                action:function(){
                    this.boxing().refresh();
                }
            },
            cmds:{
                ini:null
            },
            noTitle:{
              ini:false,
              action:function(v){
                 this.getSubNode('TITLE').css('display',v?'none':'');
              }
            },
            toggle:{
                ini:false,
                action:function(v){
                    this.getSubNode('TOGGLE',true).css('display',v?'':'none');
                }
            },
            removeText:{
                ini:'remove',
                action:function(v){
                    this.getSubNode('DEL',true).text(v);
                }
            },
            editable:{
                ini:false,
                action:function(v){
                    var self=this,t,cls;
                    self.getSubNode('DEL',true).css('display',v?'':'none');
                    t=self.getSubNode('CAPTION',true).merge(self.getSubNode('TITLE'));
                    cls=self.getClass('EDIT');
                    if(v)
                        t.addClass(cls);
                    else
                        t.removeClass(cls);
                }
            },
            newOption:{
                ini:'',
                action:function(v){
                    var self=this,
                        id='$custom',
                        sid='_special',
                        t,
                        cs=self._cs;
                    if(!v){
                        if(cs)
                            cs.remove();
                    }else{
                        if(!cs){
                            t={
                                id:id,
                                caption:v
                            };
                            t[linb.UI.$tag_subId]=sid;
                            cs=self.buildItems('items',self.box._prepareItems(self,[t]));
                            self.getSubNode('ITEMS').addNext(self._cs=_.str.toDom(cs));
                        }else
                            self.getSubNodeByItemId('CAPTION',sid).html(v);
                    }
                }
            },
            editorType:'none'
        },
        Behaviors:{
            HoverEffected:{DEL:'DEL',CMD:'CMD'},
            ClickEffected:{DEL:'DEL',CMD:'CMD'}
        },
        EventHandlers:{
            beforeTitleChanged:function(profile, value){},
            beforeOptionAdded:function(profile, value){},
            beforeOptionRemoved:function(profile, item){},
            beforeOptionChanged:function(profile, item, value){},
            onCustomEdit:function(profile, node, flag, value, item, callback){},
            onClickButton:function(profile, key, src){},
            onGetContent:function(profile,item,callback){}
        },
        RenderTrigger:function(){
            var self=this,t=self.properties.newOption;
            if(t)
                self.boxing().setNewOption(t,true);
        },
        _dynamicTemplate:function(profile){
            var properties = profile.properties,
                hash = profile._exhash = "$" + 'selMode:'+properties.selMode+';',
                template = profile.box.getTemplate(hash);

            properties.$UIvalue = properties.value;

            // set template dynamic
            if(!template){
                template = _.clone(profile.box.getTemplate());
                if(properties.selMode=='multi'){
                    template.$dynamic.items.OUTER.ITEM.OPTION.MARK2={$order:1,className:'{_optclass}'};
                    delete template.$dynamic.items.OUTER.ITEM.OPTION.MARK;
                }
                // set template
                profile.box.setTemplate(template, hash);
            }
            profile.template = template;
        },
        _prepareData:function(profile){
            var data=arguments.callee.upper.call(this, profile),
                p=profile.properties
            if(p.editable)
                data._cls = profile.getClass('EDIT');
            data.titleDisplay=p.noTitle?'display:none':'';

            var cmds = p.cmds, o;
            if(cmds && cmds.length){
                var sid=linb.UI.$tag_subId,a;
                a=data.cmds=[];
                for(var i=0,t=cmds,l=t.length;i<l;i++){
                    o=linb.UI.adjustData(profile,t[i]);
                    a.push(o);
                    o._tabindex=p.tabindex;
                    o[sid]=o.id;
                }
            }
            return data;
        },
        _prepareItem:function(profile, item){
            var p = profile.properties, f=profile.CF;
            item._tabindex = p.tabindex;

            if(typeof f.formatCaption == 'function')
                item.caption = f.formatCaption(item.caption);

            item._body= item._body || 'Loading...'
            if(item.id!='$custom'){
                item._togdisplay=((p.toggle && item.toggle!==false) || item.toggle)?'':'display:none;';

                item._display='';
                item.percent = parseFloat(item.percent)||0;
                if(item.percent<0)item.percent=0;
                if(item.percent>1)item.percent=1;
                item._per = 150*(1-item.percent);
            }else{
                item._optclass=profile.getClass('MARK3');
                item._togdisplay=item._display='display:none;';
                item._per = 0;
                item._itemcls=profile.getClass('EDITS');
            }
            item.removeText=p.removeText;
            item._del='display:none;';
            if((('editable' in item) && item.editable)||p.editable){
                item._itemcls=profile.getClass('EDIT');
                item._del = '';
            }


        },
        _buildBody:function(profile,item){
            return item.text?'<pre>'+item.text.replace(/</g,"&lt;")+'</pre>':'';
        },
        _onresize:function(){}
    }
});
Class("linb.UI.FoldingList", ["linb.UI.List"],{
    Instance:{
        fillContent:function(id, obj){
            var profile=this.get(0),t,item;
            if(profile.domNode){
                if(item=profile.getItemByItemId(id)){                    
                    t=profile.getSubNodeByItemId('BODYI',id).html('');
                    if(obj){
                        item._obj = obj;
                        item._fill=true;
                        if(typeof obj=='string')t.html(obj);
                        else t.append(obj.render(true));
                    }else
                        item._obj=item._fill=null;
                }
            }
            return this;
        },
        toggle:function(id){
            var profile=this.get(0);
            if(profile.domNode){
                var properties = profile.properties,
                    items=properties.items,
                    item = profile.getItemByItemId(id),
                    subId = profile.getSubIdByItemId(id),
                    node = profile.getSubNode('ITEM',subId),
                    toggle = profile.getSubNode('TOGGLE',subId),
                    nodenext = node.next(),t
                    ;
                if(item._show){
                    if(properties.activeLast && items.length)
                        if(items[items.length-1].id==item.id)
                            return false;
    
                    node.tagClass('-checked',false);
                    toggle.tagClass('-checked',false);
                    if(nodenext)
                        nodenext.tagClass('-prechecked',false);
                }else{
                    node.tagClass('-checked');
                    toggle.tagClass('-checked');
                    if(nodenext)
                        nodenext.tagClass('-prechecked');
                    //fill value
                    if(!item._fill){
                        var callback=function(o){
                            profile.boxing().fillContent(item.id, item._body=o);
                        };
                        if(profile.onGetContent){
                            var r = profile.boxing().onGetContent(profile, item, callback);
                            if(r) callback(r);
                        }else
                            callback(profile.box._buildBody(profile, item));
                    }
                }
                item._show=!item._show
             }
            return this;
        }
    },
    Initialize:function(){
        //modify default template fro shell
        var t = this.getTemplate();
        t.$dynamic={
            items:{
                ITEM:{
                    tagName : 'div',
                    className:'{_checked} {_precheked} {itemClass} {disabled}',
                    style:'{itemStyle}',
                    HEAD:{
                        tagName : 'div',
                        HL:{tagName : 'div'},
                        HR:{tagName : 'div'},
                        TITLE:{
                            tagName : 'a',
                            href:linb.$href,
                            TLEFT:{
                                $order:0,
                                tagName:'div',
                                TOGGLE:{
                                    $order:0,
                                    className:'uicmd-toggle {_tlgchecked}'
                                },
                                CAP1:{
                                    $order:1,
                                    text:'{title}'
                                }
                            },
                            TRIGHT:{
                                $order:1,
                                tagName:'div',
                                style:'{_capDisplay}',
                                CAP2:{
                                    $order:0,
                                    text:'{caption}'
                                },
                                OPT:{
                                    $order:1,
                                    className:'uicmd-opt',
                                    style:'{_opt}'
                                }
                            }/*,
                            TCLEAR:{
                                $order:2,
                                tagName:'div'
                            }*/
                        }
                    },
                    BODY:{
                        $order:1,
                        tagName : 'div',
                        className:'uibg-base',
                        BODYI:{
                            $order:0,
                            tagName : 'div',
                            text:'{_body}'
                        },
                        CMDS:{
                            $order:1,
                            tagName : 'div',
                            text:"{cmds}"
                        }
                    },
                    TAIL:{
                        $order:4,
                        tagName : 'div',
                        TL:{tagName : 'div'},
                        TR:{tagName : 'div'}
                    }
                }
            },
            'items.cmds':{
                $order:2,
                CMD:{
                    tagName:'a',
                    href:linb.$href,
                    text:'{caption}'
                }
            }
        };
        this.setTemplate(t);
    },
    Static:{
        Appearances:{
            KEY:{
                padding:'2px'
            },
            ITEMS:{
                border:0,
                position:'relative',
                zoom:linb.browser.ie?1:null,
                'padding-top':'8px'//,
                //for ie6 1px bug,  HR/TR(position:absolute;right:0;)
                //'margin-right':linb.browser.ie6?'expression(this.parentNode.offsetWidth?(this.parentNode.offsetWidth-(parseInt(this.parentNode.style.paddingLeft)||0)-(parseInt(this.parentNode.style.paddingRight)||0) )%2+"px":"auto")':null
            },
            ITEM:{
                border:0,
                //for ie6 bug
                zoom:linb.browser.ie?1:null,
                'margin-top':'-9px',
                padding:0,
                'font-family': '"Verdana", "Helvetica", "sans-serif"',
                position:'relative',
                overflow:'hidden'
            },
            'HEAD, BODY, BODYI, TAIL':{
                position:'relative'
            },

            CMDS:{
                padding:'2px 8px 4px 14px',
                'font-weight':'bold',
                position:'relative',
                background: linb.UI.$bg('border_left.gif', 'repeat-y left top #EEE')
            },
            CMD:{
                margin:'2px 4px 2px 4px',
                padding:'0 3px 0 3px'
            },
            BODY:{
                display:'none',
                'border-right': 'solid 1px #CCC',
                zoom:linb.browser.ie?1:null,
                position:'relative',
                overflow:'auto',
                background: linb.UI.$bg('border_left.gif', 'repeat-y left top')
            },
            BODYI:{
                padding:'2px 8px 0 8px',
                background: linb.UI.$bg('border_left.gif', 'repeat-y left top'),
                position:'relative'
            },
            'ITEM-checked':{
                $order:2,
                'margin-bottom':'12px'
             },
            'ITEM-checked BODY':{
                $order:2,
                display:'block'
            },
            'HL, HR, TL, TR':{
                position:'absolute',
                '_font-size':0,
                '_line-height':0,
                width:'8px'
            },
            'HL, HR':{
                height:'30px'
            },
            'ITEM-prechecked HL':{
                'background-position': 'left top'
            },
            'ITEM-prechecked HR':{
                'background-position': 'right top'
            },
            'TL, TR':{
                height:'20px'
            },
            HL:{
                top:0,
                left:0,
                background: linb.UI.$bg('corner.gif', ' no-repeat left -37px')
            },
            HR:{
                top:0,
                right:0,
                background: linb.UI.$bg('corner.gif', ' no-repeat right -37px')
            },
            TL:{
                bottom:0,
                left:0,
                background: linb.UI.$bg('corner.gif', ' no-repeat left bottom')
            },
            TR:{
                bottom:0,
                right:0,
                background: linb.UI.$bg('corner.gif', ' no-repeat right bottom')
            },
            HEAD:{
                position:'relative',
                zoom:linb.browser.ie?1:null,
                background: linb.UI.$bg('border_top.gif', '#fff repeat-x left top'),
                overflow:'hidden'
            },
            TITLE:{
                $order:1,
                height:'26px',
                display:'block',
                position:'relative',
                'white-space':'nowrap',
                overflow:'hidden'
            },
            TAIL:{
                '_font-size':0,
                '_line-height':0,
                position:'relative',
                height:'5px',
                background: linb.UI.$bg('border_bottom.gif', ' repeat-x left bottom #EEE')
            },
            'CAP1, CAP2':{
                padding:'3px'
            },
            CAP1:{
                color:'#666',
                'white-space':'nowrap',
            	font: 'bold 12px arial,sans-serif',
            	color: '#00681C'
            },
            'ITEM-checked CAP1':{
                $order:2,
                'font-weight':'normal'
            },
            TLEFT:{
                //position:linb.browser.ie6?'relative':null,
                //'float':'left',
                position:'absolute',
                left:'4px',
                top:'2px',

                'white-space':'nowrap',
                overflow:'hidden'
            },
            TRIGHT:{
                //position:linb.browser.ie6?'relative':null,
                //'float':'right',

                position:'absolute',
                right:'4px',
                top:'2px',

                'white-space':'nowrap',
                overflow:'hidden'
            }
        },
        Behaviors:{
            HoverEffected:{ITEM:null,HEAD:'HEAD',OPT:'OPT'},
            ClickEffected:{ITEM:null,HEAD:'HEAD'},
            ITEM:{onClick:null,onKeydown:null},
            HEAD:{
                onClick:function(profile, e, src){
                    profile.boxing().toggle(profile.getItemIdByDom(src));
                    return false;
                }
            },
            CMD:{
                onClick:function(profile,e,src){
                    if(profile.onClickButton)
                        profile.boxing().onClickButton(profile,profile.getItemByDom(src.parentNode),src.id.split('_')[1],src);
                    return false;
                }
            },
            OPT:{
                onMousedown:function(){
                    return false;
                },
                onClick:function(profile, e, src){
                    profile.boxing().onShowOptions(profile, profile.getItemByDom(src), e, src);
                    return false;
                }
            }
        },
        DataModel:({
            tabindex:{
                action:function(value){
                    if(this.domNode)
                        this.getSubNode('HEAD',true).attr('tabIndex',value);
                }
            },
            cmds:{
                ini:[]
            },
            activeLast:false
        }),
        EventHandlers:{
            onGetContent:function(profile,item,onEnd){},
            onClickButton:function(profile,item,cmdkey,src){},
            onShowOptions:function(profile,item,e,src){}
        },
         RenderTrigger:function(){
            var self=this, pro=self.properties, items=pro.items, item;
            if(pro.activeLast && items.length>0){
                item=items[items.length-1];
                self.boxing().fillContent(item.id, item._body);
            }
        },
        _prepareItems:function(profile, arr, pid){
            if(arr.length){
                arr[0]._precheked = profile.getClass('ITEM','-prechecked');
                if(profile.properties.activeLast){
                    //for properties.data
                    var item = arr[arr.length-1];
                    item._show = true;
                    item._fill = true;
                    item._body = profile.onGetContent?profile.boxing().onGetContent(profile,item) : profile.box._buildBody(profile, item);
                }
            }
            return arguments.callee.upper.apply(this, arguments);
        },
        _prepareItem:function(profile, item){
            var p = profile.properties,o,
                dpn = 'display:none';
            item._tabindex = p.tabindex;
            if(!item.caption)
                item._capDisplay=dpn;
            else
                item.caption = item.caption.replace(/</g,"&lt;");
            item._opt = item.optBtn?'':dpn;
            item._body= item._body || 'Loading...'

            if(item._show){
                item._checked = profile.getClass('ITEM','-checked');
                item._tlgchecked = profile.getClass('TOGGLE','-checked');
            }
            var cmds = item.cmds || p.cmds;
            if(cmds && cmds.length){
                var sid=linb.UI.$tag_subId,a;
                a=item.cmds=[];
                for(var i=0,t=cmds,l=t.length;i<l;i++){
                    o=linb.UI.adjustData(profile,t[i]);
                    a.push(o);
                    o[sid]=item[sid] + '_' + o.id;
                }
            }
        },
        _buildBody:function(profile,item){
            return item.text?'<pre>'+item.text.replace(/</g,"&lt;")+'</pre>':'';
        }
    }
});
/*
300: ruler width
30: ruler height
15: ruler shadow height

15: indicator width => 8: indicator offset
14: indicator height
*/
Class("linb.UI.Range", ["linb.UI","linb.absValue"],{
    Instance:{
        _setCtrlValue:function(value){
            return this.each(function(profile){
                var p=profile.properties,
                    tpl=p.captionTpl,
                    fun=function(k){return profile.getSubNode(k)},
                    fun1=function(a,i){a.cssPos({left:profile[i], top: box._x2y(profile[i])}) },
                    fun2=function(o,v){o.get(0).style.width = v +'px'},
                    title = fun('CAPTION'),
                    a=fun('IND1'),
                    b=fun('IND2'),
                    r1 = fun('RULER1'),
                    r3 = fun('RULER3'),
                    box = profile.box,
                    arr = box._v2a(value);

                profile._rate= 300/(p.max-p.min);
                //use Math.round
                profile._v1= Math.round((arr[0]-p.min) /  (p.max-p.min) *300) ;
                profile._v2= Math.round((1-(p.max - arr[1]) /  (p.max-p.min)) *300);

                //text value
                title.html(box._buildTpl(p.singleValue,tpl, arr,p.unit),false);
                //indicator position
                fun1(a, '_v1');
                fun1(b,'_v2');
                //background div width
                fun2(r1, profile._v1+8);
                fun2(r3, profile._v2+8);
            });
        },
        _setDirtyMark:function(){
            return this.each(function(profile){
                if(!profile.properties.dirtyMark)return;
                if(!profile.domNode)return;
                var properties = profile.properties,
                    o=profile.getSubNode('BOX'),
                    flag=properties.value !== properties.$UIvalue,
                    cls=linb.UI.$css_tag_dirty;

                if(profile.beforeDirtyMark && false===profile.boxing().beforeDirtyMark(profile,flag))
                    return;

                if(flag)
                    o.addClass(cls);
                else
                    o.removeClass(cls);
            });
        }
    },
    Static:{
        Templates:{
            style:'{_style}',
            BOX:{
                tagName:'div',
                RULER:{
                    tagName:'div',
                    IND1:{
                        tagName:'a',
                        href:linb.$href,
                        tabindex:'{tabIndex}',
                        style:'{_single}'
                    },
                    IND2:{
                        tagName:'a',
                        href:linb.$href,
                        tabindex:'{tabIndex}'
                    },
                    RULER1:{
                        $order:2,
                        style:'{_single}'
                    },
                    RULER3:{}
                },
                TAIL:{
                    tagName:'div',
                    CAPTION:{
                        tagName:'div'
                    },
                    MIN:{
                        text:'{min}'
                    },
                    MAX:{
                        text:'{max}'
                    }
                }
            }
        },
        Appearances:{
            'KEY, RULER, IND1, IND1':{
                'font-size':0,
                'line-height':0,
                position:'relative'
            },
            BOX:{
                position:'absolute',
                left:0,
                top:0,
                width:'316px'
            },
            'CAPTION, IND1, TAIL, MIN':{
                'font-size':'12px',
                'line-height':'14px'
            },
            RULER:{
                $order:1,
                position:'relative',
                height:'30px',
                overflow:'visible',
                'margin-bottom':'3px',
                background: linb.UI.$bg('bg.png'),
                _background:'none',
                _filter: linb.UI.$ieBg('bg.png')
            },
            'RULER1, RULER3':{
                position:'absolute',
                left:0,
                top:0,
                height:'30px',
                width:'300px'
            },
            RULER1:{
                background: linb.UI.$bg('bg.png'),
                _background:'none',
                _filter: linb.UI.$ieBg('bg.png')
            },
            RULER3:{
                background: linb.UI.$bg('front.png'),
                _background:'none',
                _filter: linb.UI.$ieBg('front.png')
            },
            'IND1,IND2':{
                display:linb.$inlineBlock,
                zoom:linb.browser.ie6?1:null,
                'z-index':'2',
                width:'15px',
                height:'14px',
                position:'absolute'
            },
            IND1:{
                background: linb.UI.$bg('icons.gif', ' no-repeat left -225px', true),
                left:'0px',
                top:'11px'
            },
            IND2:{
                background: linb.UI.$bg('icons.gif', ' no-repeat -15px -225px', true),
                left:'300px',
                top:'1px'
            },
            TAIL:{
                $order:2,
                width:'300px',
                position:'relative'
            },
            CAPTION:{
                position:'relative',
                'text-align':'center'
            },
            MIN:{
                position:'absolute',
                left:0,
                top:0
            },
            MAX:{
                position:'absolute',
                right:0,
                top:0
            }
        },
        Behaviors:{
            IND1:{
                onKeydown:function(profile, e, src){
                    profile.box._keydown.apply(profile.box,[profile, e, src,0]);
                },
                onMousedown:function(profile, e, src){
                    var p=profile.properties,
                        box=profile.box,
                        arr = box._v2a(p.$UIvalue);

                    linb([src]).startDrag(e,{
                        widthIncrement:p.steps?p.width/p.steps:null,
                        dragType:'move',
                        targetReposition:true,
                        horizontalOnly:true,
                        maxLeftOffset: Math.floor(profile._v1),
                        maxRightOffset: Math.floor(profile._v2-profile._v1),
                        dragCursor:'default'
                    });
                    linb([src]).css('zIndex',10).focus();
                    profile.getSubNode('IND2').css('zIndex',5);
                },
                onDrag:function(profile, e, src){
                    var d=linb.DragDrop.getProfile();
                    profile.box._ondrag.apply(profile.box,[profile,d.curPos.left,src,0]);
                },
                onDragstop:function(profile, e, src){
                    var p=profile.properties,
                        box=profile.boxing(),
                        rate = profile._rate,
                        d=linb.DragDrop.getProfile(),
                        f,
                        arr = p.$UIvalue.split(':');
                    profile._v1=d.curPos.left;
                    arr[0]= Math.floor((profile._v1)/rate + p.min);
                    box.setUIValue(arr.join(':'));

                    if(profile._v1==profile._v2){
                        linb([src]).css('zIndex',10);
                        profile.getSubNode('IND2').css('zIndex',5);
                    }
                }
            },
            IND2:{
                onKeydown:function(profile, e, src){
                    profile.box._keydown.apply(profile.box,[profile, e, src,1]);
                },
                onMousedown:function(profile, e, src){
                    var p=profile.properties,
                        box=profile.box,
                        arr = box._v2a(p.$UIvalue);

                    linb([src]).startDrag(e,{
                        widthIncrement:p.steps?p.width/p.steps:null,
                        dragType:'move',
                        targetReposition:true,
                        horizontalOnly:true,
                        maxLeftOffset: Math.floor(profile._v2-profile._v1),
                        maxRightOffset: Math.floor(300 - profile._v2),
                        dragCursor:'default'
                    });
                    linb([src]).css('zIndex',10).focus();
                    profile.getSubNode('IND1').css('zIndex',5);
                },
                onDrag:function(profile, e, src){
                    var d=linb.DragDrop.getProfile();
                    profile.box._ondrag.apply(profile.box,[profile,d.curPos.left,src,1]);
                },
                onDragstop:function(profile, e, src){
                    var p=profile.properties,
                        box=profile.boxing(),
                        rate = profile._rate,
                        d=linb.DragDrop.getProfile(),
                        f,
                        arr = p.$UIvalue.split(':');
                    profile._v2=d.curPos.left;
                    arr[1]= Math.floor((profile._v2)/rate + p.min);
                    box.setUIValue(arr.join(':'));
                }
            }
        },
        DataModel:{
            position:'absolute',
            width:{
                ini:300,
                readonly:true
            },
            height:{
                ini:46,
                readonly:true
            },
            min:{
                ini:0,
                action:function(){
                    var self=this,t,pro=self.properties,b=self.boxing();
                    b.refresh();
                    if(pro.$UIvalue!=(t=this.box._ensureValue(self,pro.$UIvalue)))
                        b.setValue(t);
                }
            },
            max:{
                ini:100,
                action:function(){
                    var self=this,t,pro=self.properties,b=self.boxing();
                    b.refresh();
                    if(pro.$UIvalue!=(t=this.box._ensureValue(self,pro.$UIvalue)))
                        b.setValue(t);
                }
            },
            unit:{
                ini:'',
                action:function(){
                    this.boxing()._setCtrlValue(this.properties.$UIvalue);
                }
            },
            steps:0,
            captionTpl:{
                ini:'{fromvalue}{unit} - {tovalue}{unit}',
                action:function(){
                    this.boxing()._setCtrlValue(this.properties.$UIvalue);
                }
            },
            value:'0:100',
            singleValue:{
                ini:false,
                action:function(v){
                    this.boxing().refresh();
                }
            }
        },
        _prepareData:function(profile){
            var d=arguments.callee.upper.call(this, profile);
            var p=profile.properties,
                arr=profile.box._v2a(p.value);
            d._single = p.singleValue?'display:none':'';

            p.min=parseFloat(p.min);
            p.max=parseFloat(p.max);

            d.min = d.min + p.unit;
            d.max = d.max + p.unit;
            return d;
        },
        _ensureValue:function(profile, value){
            var p = profile.properties,
                a = value.split(':'),
                min=p.min,
                max=p.max,
                b=[],
                f1=function(a){return parseFloat(a)},
                f2=function(a){return Math.min(max, Math.max(min,a))};
            
            b[0]= f1(a[0]);
            b[1]= f1(a[1]);
            b[0] = Math.min(b[0],b[1]);
            if(!min)min=b[0];
            if(!max)max=b[1];
            b[0]= f2(b[0]);
            b[1]= f2(b[1]);            
            return b.join(':');
        },
        _v2a:function(value){
            return typeof value == 'string'? value.split(':') : value;
        },
        _buildTpl:function(single,tpl,arr,unit){
            return single?
              arr[1] + unit
            : tpl.replace(/\{fromvalue\}/g,arr[0]).replace(/\{tovalue\}/g,arr[1]).replace(/\{unit\}/g,unit);
        },
        _x2y:function(x){
            return Math.floor(15 + 1 - (x) * (15/300));
        },
        _keydown:function(profile, e, src,type){
            var key=linb.Event.getKey(e);
            if(key[0]=='left' || key[0]=='right'){
                var s=src.style, left=parseInt(s.left), pro=profile.properties, steps=pro.steps, span=300/steps, v,f=function(key){
                    return parseInt(profile.getSubNode(key).get(0).style.left);
                };
                left += key[0]=='left'?-1:1;
                if(steps){
                    left = left-left%span;
                    if(key[0]=='right')
                        left += span;
                }
                if(!pro.singleValue)
                    if(type===0){
                        v=f('IND2');
                        if(left>v)left=v;
                    }else{
                        v=f('IND1');
                        if(left<v)left=v;
                    }
                if(left<0)left=0;
                if(left>300)left=300;
                
                s.left=left+'px';

                profile.box._ondrag.apply(profile.box,[profile,left,src,1]);

                var  rate = profile._rate,
                    arr = pro.$UIvalue.split(':');
                if(type===0){
                    profile._v1=left;
                    arr[0]= Math.floor((profile._v1)/rate + pro.min);
                }else{
                    profile._v2=left;
                    arr[1]= Math.floor((profile._v2)/rate + pro.min);
                }
                profile.boxing().setUIValue(arr.join(':'));                
            }
        },
        _ondrag:function(profile, left, src, tag){
            var p=profile.properties,
                d=linb.DragDrop.getProfile(),
                box=profile.box,
                fun=function(k){return profile.getSubNode(k)},
                fun2=function(o,v){o.get(0).style.width = v +'px'},
                cap = fun('CAPTION'),
                r1 = fun('RULER1'),
                r3 = fun('RULER3'),
                t,f,
                arr=this._v2a(p.$UIvalue);

             //adjust top
            src.style.top = this._x2y(left) + 'px';

            t = Math.floor((left)/profile._rate + p.min);

            if(tag){
                arr[1] = t;
                fun2(r3, left + 8);
            }else{
                arr[0] = t;
                fun2(r1, left + 8);
            }
             cap.html(box._buildTpl(p.singleValue, p.captionTpl, arr,p.unit),false);
        },
        _onresize:function(){}
    }
});Class('linb.UI.Calendar', 'linb.UI.DatePicker', {
    Initialize:function(){
        var self=this,
            e=linb.Event.$EVENTHANDLER,
            e2=linb.Event.$EVENTHANDLER2,
            id=linb.UI.$ID,
            cls=linb.UI.$CLS,
            cls2=cls+'-td-free',
            key=self.KEY;

        self.addTemplateKeys(['H', 'W','DH','DAY','DC','TBODY', 'TD']);
        var colgroup = '<colgroup><col width="2%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/><col width="14%"/></colgroup>',
            thead1='<thead><tr height="1%"><th id="'+key+'-H:'+id+':7" class="'+cls+'-h #H_CC#"></th>',
            thead2='</tr></thead>',
            th='<th id="'+key+'-H:'+id+':@" class="'+cls+'-h #H_CC#">@</th>',
            tbody1 = '<tbody id="'+key+'-TBODY:'+id +':" >',
            tbody2 = '</tbody>',
            tr1='<tr>',
            tr2='</tr>',
            td1='<th id="'+key+'-W:'+id+':@"  class="'+cls+'-w #W_CC#">@</th>',
            td2='<td id="'+key+'-TD:'+id+':@" class="'+cls+'-td ! #TD_CC#"  unselectable="on" onclick="'+e+'" >'+
                '<div id="'+key+'-DAY:'+id+':@" class="'+cls+'-day #DAY_CC#" unselectable="on" onmouseover="'+e2+'" onmouseout="'+e2+'" ondrop="'+e2+'" >'+
                    '<div id="'+key+'-DH:'+id+':@" class="'+cls+'-dh #DH_CC#" ></div>'+
                    '<div id="'+key+'-DC:'+id+':@" class="'+cls+'-dc #DC_CC#" ></div>'+
                '</div>'+
                '</td>',
            body,i,j,k,l,a=[],b=[];
        for(i=0;i<7;i++)
            b[b.length]= th.replace(/@/g,i);

        k=l=0;
        for(i=0;i<48;i++){
            j=i%8;
            a[a.length]= (j==0?tr1:'') + (j==0?td1:td2).replace(/@/g,j==0?l:k).replace('!',(j==1||j==7)?cls2:'') + (j==7?tr2:'');
            if(j!==0)k++;
            else l++;
        }

        body=colgroup+thead1+b.join('')+thead2+tbody1+a.join('')+tbody2;

        self.setTemplate({
            tagName : 'div',
            style:'{_style}',
            onselectstart:'return false',
            BORDER:{
                tagName : 'div',
                BODY:{
                    $order:1,
                    tagName:'table',
                    cellpadding:"0",
                    cellspacing:"0",
                    width:'100%',
                    text:body
                }
            }
        });
    },
    Static:{
        Behaviors:{        
            DropableKeys:['DAY'],
            HoverEffected:{},
            ClickEffected:{},
            onSize:function(profile,e){
                var o = profile.domNode.style,f=parseInt, n=null, w=n, h=n;
                if(e.height)h=f(o.height)||n;
                if(e.width)w=f(o.width)||n;
                if(h||w)linb.UI.$tryResize(profile, w, h);
            },
            TD:{onClick:null}
        },
        DataModel:{
            handleHeight : null,
            tipsHeight :null,
            closeBtn:null,
            value:null,
            dataBinder:null,
            dateField:null,

            dock:'fill',
            $borderW:1,
            width:200,
            height:200
        },
        _getLabelNodes:function(profile){
            return profile.$day1 || (profile.$day1=profile.getSubNode('DH',true));
        },
        _getDayNodes:function(profile){
            return profile.$day2 || (profile.$day2=profile.getSubNode('DAY',true));
        },
        Appearances:{
            'DAY, DC':{
                position:'relative'
            },
            DAY:{
                overflow:'hidden'
            },
            DC:{
                'text-align':'left'
            },
            'TD-checked':{}
        },
        _onresize:function(profile,width,height){
            var p=profile.properties,
                f=function(k){return profile.getSubNode(k)},
                off=2*p.$borderW,
                t;
            //for border, view and items
            if(height){
                f('BORDER').height(t=height-off);
                f('BODY').height(t);
                t=(t-16)/6-1;
                profile.box._getDayNodes(profile).height(t);
            }
        }
    }
});
})();