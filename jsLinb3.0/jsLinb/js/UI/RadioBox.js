Class("linb.UI.RadioBox", "linb.UI.List",{
    Initialize:function(){
        //modify default template for shell
        var t = this.getTemplate();
        t.className='{_className}';
        t.$submap={
            items:{
                ITEM:{
                    className:'{itemClass}  {disabled} {readonly}',
                    style:'{itemStyle}',
                    tabindex: '{_tabindex}',
                    MARK:{
                        $order:0,
                        className:'{_markcls}'
                    },
                    ICON:{
                        $order:1,
                        className:'ui-icon {imageClass}',
                        style:'{backgroundImage} {backgroundPosition} {backgroundRepeat} {imageDisplay}'
                    },
                    CAPTION:{
                        text : '{caption}',
                        $order:2
                    }
                }
            }
        };
        this.setTemplate(t);
    },
    Static:{
        _DIRTYKEY:'MARK',
        _ITEMMARKED:true,
        Appearances:{
            ITEM:{
               display:linb.$inlineBlock,
               'font-family':' "Verdana", "Helvetica", "sans-serif"',
               border:0,
               padding:'4px',
               position:'relative',
               zoom:linb.browser.ie?1:null,
               cursor:'pointer',
               overflow:'hidden',
               'vertical-align':'middle',
               'font-size':'12px'
            },
            CAPTION:{
                'vertical-align':linb.browser.ie6?'baseline':'middle'
            },
            ITEMS:{
                overflow:'auto',
                'overflow-x': 'hidden',
                position:'relative',
                'line-height':'14px'
            },
            MARK:{
               $order:1,
               cursor:'pointer',
               width:'16px',
               height:'16px',
               'vertical-align':'middle'
            },
            'ITEM-checked MARK':{
                $order:2
            }
        },
        DataModel:{
            borderType:{
                ini:'none'
            },
            checkBox:{
                ini:false,
                action:function(v){
                    this.getSubNode('MARK',true).replaceClass(v ? /(uicmd-radio)|(\s+uicmd-radio)/g : /(^uicmd-check)|(\s+uicmd-check)/g , v ? ' uicmd-check' : ' uicmd-radio');
                }
            }
        },
        Behaviors:{
            HoverEffected:{ITEM:null,MARK:'MARK'},
            ClickEffected:{ITEM:null,MARK:'MARK'}
        },
        _prepareItem:function(profile, item){
            item._markcls = profile.properties.checkBox?'uicmd-check':'uicmd-radio';
        }
    }
});
