//Profile Class
Class('linb.Profile','linb.absProfile',{
    Constructor:function(host,key,alias,box,properties,events,options){
        arguments.callee.upper.apply(this,arguments);
        var self=this;
        _.merge(self,options);

        self.key=key||self.key||'';
        self.alias=alias||self.alias||'',
        self.properties=properties?_.copy(properties):(self.properties||{});
        self.events=events?_.copy(events):(self.events||{});
        self.host=host||self.host||self;
        self.box=box||self.box||self.constructor;
        if(self.events){
            self.setEvents(self.events);
            delete self.events;
        }
        self._links={};
    },
    Instance:{
        setEvents:function(key, value){
            var evs=this.box.$EventHandlers;
            if(_.isHash(key)){
                return _.merge(this,key,'all',function(o,i){return evs[i]});
            }else{
                if(evs[key])
                    this[key]=value;
            }
        },
        getEvents:function(key){
            if(key){
                return this[key];
            }else{
                var self=this, t,hash={};
                _.each(self.box.$EventHandlers,function(o,i){
                    if(self[i])hash[i]=self[i];
                });
                return hash;
            }
        },
        getProperties:function(key){
            var prop=this.properties;
            return key?prop[key]:_.copy(prop);
        },
        setProperties:function(key, value){
            if(_.isHash(key))
                this.properties=key;
            else
                this.properties[key]=value;
        },
        _applySetAction:function(fun, value){
            return fun.call(this,value);
        },
        __gc:function(){
            var ns=this;
            ns.unLinkAll();
            _.tryF(ns.clearCache,[],ns);
            var o=_.get(ns,['box','_namePool']);
            if(o)delete o[self.alias];
            _.breakO([ns.properties, ns.events, ns],2);
        },
        boxing:function(){
            //cache boxing
            var self=this, t;
            //for destroyed UIProfile
            if(!self.box)return null;
            if(!((t=self._cacheInstance) && t.get(0)==self && t._nodes.length==1))
                t = self._cacheInstance = self.box.pack([self],false);
            return t;
        },
        serialize:function(rtnString, keepHost){
            var t,
                self = this,
                o = (t=self.box._beforeSerialized)?t(self):self,
                r={
                    alias:o.alias,
                    key:o.key,
                    host:o.host
                };
            //host
            if(r.host===self){
                delete r.host;
            }else if(o.host && !keepHost ){
                if(rtnString!==false)
                    r.host='@this';
                else
                    delete r.host;
            }
            if(typeof o.theme=="string")
              r.theme=o.theme;

            //properties
            var c={}, p=o.box.$DataStruct, map=linb.absObj.$specialChars;
            _.merge(c,o.properties, function(o,i){return (i in p) &&  p[i]!==o && !map[i.charAt(0)]});
            if(!_.isEmpty(c))r.properties=c;

            //events
            if(!_.isEmpty(t=this.getEvents()))r.events=t;
            var eh = o.box.$EventHandlers;
            _.filter(r.events, function(o,i){
                return o!=eh[i];
            });
            if(_.isEmpty(r.events))delete r.events;
            return rtnString===false?r:_.serialize(r);
        }
    }
});
//absObj Class
Class('linb.absObj',"linb.absBox",{
    //properties, events, host
    Constructor:function(){
        arguments.callee.upper.apply(this,arguments);
        //for pack function
        if(arguments[0]!==false && typeof this._ini=='function')
            return this._ini.apply(this,arguments);
    },
    Before:function(key, parent_key, o){
        linb.absBox.$type[key]=key;
        return true;
    },
    After:function(){
        var self=this, me=arguments.callee,
            temp,t,k,u,m,i,j,l,v,n,b;
        self._nameId=0;
        self._namePool={};
        self._nameTag=self.$nameTag||('ctl_'+(t=self.KEY.split('.'))[t.length-1].toLowerCase());
        self._cache=[];

        if(self===linb.absObj || self===linb.absObj)return;

        m=me.a1 || (me.a1=_.toArr('$Keys,$DataStruct,$EventHandlers,$DataModel'));
        for(j=0;v=m[j++];){
            k={};
            if((t=self.$parent) && (i=t.length))
                while(i--)
                    _.merge(k, t[i][v]);
            self[v]=k;
        }

        self.setDataModel(self.DataModel);
        delete self.DataModel;

        self.setEventHandlers(self.EventHandlers);
        delete self.EventHandlers;

        m=me.a5 || (me.a5=_.toArr('RenderTrigger,LayoutTrigger'));
        for(j=0;v=m[j++];){
            temp=[];
             if((t=self.$parent) && (l=t.length))
                for(i=0;i<l;i++){
                    u=t[i]
                    if(u=u['$'+v])
                        temp.push.apply(temp,u);
                }
            if(self[v])
                temp.push(self[v]);
            self['$'+v] = temp;
            delete self[v];
        }
    },
    //don't add any other function or member to absObj
    Static:{
        $abstract:true,
        $specialChars:{_:1,$:1},
        getAll:function(){
          return this.pack(this._cache);
        },
        pickAlias:function(){
            var t,p=this._namePool,a=this._nameTag;
            while(p[t=(a+(++this._nameId))]){}
            return  t;
        },
        setDataModel:function(hash){
            var self=this,
                sc=linb.absObj.$specialChars,
                ds=self.$DataStruct,
                properties=self.$DataModel,
                ps=self.prototype,
                i,j,t,o,n,m,r;

            //merge default value and properties
            for(i in hash){
                if(!properties[i])properties[i]={};
                o=hash[i];
                if(null===o || undefined===o){
                    r=_.str.initial(i);
                    delete ds[i];
                    delete properties[i]
                    delete ps['get'+r];
                    delete ps['set'+r];
                //Here, if $DataModel inherites from it's parent class, properties[i] will pointer to parent's object.
                }else{
                    t=typeof o;
                    if(t!='object' || o.constructor!=Object)
                        o={ini:o};
                    ds[i] = ('ini' in o)?o.ini:(i in ds)?ds[i]:'';

                    t=properties[i];
                    for(j in t)
                        if(!(j in o))
                            o[j]=t[j];
                    properties[i]=o;
                }
            }

            _.each(hash,function(o,i){
                if(null===o || undefined===o || sc[i.charAt(0)])return;
                r=_.str.initial(i);
                n = 'set'+r;
                //readonly properties
                if(!(o && (o.readonly || o.inner))){
                    //custom set
                    var $set = o.set;
                    m = ps[n];
                    ps[n] = (typeof $set!='function' && typeof m=='function') ? m : Class._fun(function(value,force){
                        return this.each(function(v){
                            if(!v.properties)return;
                            //if same return
                            if(v.properties[i] === value && !force)return;

                            var ovalue = v.properties[i];
                            if(v.beforePropertyChanged && false===v.boxing().beforePropertyChanged(v,i,value,ovalue))
                                return;

                            if(typeof $set=='function'){
                                $set.call(v,value,ovalue);
                            }else{
                                var m = _.get(v.box.$DataModel, [i, 'action']);
                                v.properties[i] = value;
                                if(typeof m == 'function' && v._applySetAction(m, value, ovalue) === false)
                                    v.properties[i] = ovalue;
                            }

                            if(v.afterPropertyChanged)
                                v.boxing().afterPropertyChanged(v,i,value,ovalue);
                        });
                    },n,self.KEY,null,'instance');
                    delete o.set;
                    if(ps[n]!==m)ps[n].$auto$=1;
                }else
                    delete ps[n];
                n = 'get'+r;
                if(!(o && o.inner)){
                    // get custom getter
                    var $get = o.get;
                    m = ps[n];
                    ps[n] = (typeof $get!='function' && typeof m=='function') ? m : Class._fun(function(){
                        if(typeof $get=='function')
                            return $get.call(this.get(0));
                        else
                            return this.get(0).properties[i];
                    },n,self.KEY,null,'instance');
                    delete o.get;
                    if(ps[n]!==m)ps[n].$auto$=1;
                }else
                    delete ps[n];
            });
            return self;
        },
        setEventHandlers:function(hash){
            var self=this;
            _.each(hash,function(o,i){
                if(null===o){
                    delete self.$EventHandlers[i];
                    delete self.prototype[i];
                }else{
                    self.$EventHandlers[i]=o;
                    var f=function(fun){
                        var l=arguments.length;
                        if(l==1 && (typeof fun == 'function' || typeof fun == 'string'))
                            return this.each(function(v){
                                if(v.renderId)
                                    v.clearCache();
                                v[i] =fun;
                            });
                        else if(l==1 && null===fun)
                            return this.each(function(v){
                                v.clearCache();
                                delete v[i];
                            });
                        else{
                            var args=[], v=this.get(0), t=v[i], k=v.host || v,j;
                            if(v.$inDesign)return;
                            if(arguments[0]!=v)args[0]=v;
                            for(j=0;j<l;j++)args[args.length]=arguments[j];
                            v.$lastEvent=i;
                            if(typeof t=='string')t=k[t];
                            if(typeof t=='function')return _.tryF(t, args, k);
                        }
                    };
                    f.$event$=1;
                    f.$original$=o.$original$||self.KEY;
                    f.$name$=i;
                    f.$type$='event';
                    self.plugIn(i,f);
                }
            });
            return self;
        }
    },
    Instance:{
        setAlias:function(str){
            var self=this,prf=this.get(0),old;
            if(old=prf.alias){
                if(prf.host && prf.host!==prf){
                    try{delete prf.host[old]}catch(e){prf.host[old]=undefined}
                    if(prf.host._ctrlpool)
                        delete prf.host._ctrlpool[old];
                }
                delete self.constructor._namePool[old];
            }
            self.constructor._namePool[prf.alias=str]=1;
            if(prf.host && prf.host!==prf){
                prf.host[str]=self;
                if(prf.host._ctrlpool)
                    prf.host._ctrlpool[str]=self.get(0);
            }
            return self;
        },
        getAlias:function(){
            return this.get(0).alias;
        },
        alias:function(value){
            return value?this.setAlias(value):this.getAlias();
        },
        host:function(value, alias){
            return value?this.setHost(value, alias):this.getHost();
        },
        setHost:function(host, alias){
            var self=this;
            self.get(0).host=host;
            if(alias)
                self.setAlias(alias);
            return self;
        },
        getHost:function(){
            return this.get(0).host;
        }
        /*non-abstract inheritance must have those functions:*/
        //1. destroy:function(){delete this.box._namePool[this.alias];this.get(0).__gc();}
        //2. _ini(properties, events, host, .....){/*set _nodes with profile*/return this;}
        //3. render(){return this}
    }
});
//DataBinder Class
Class("linb.DataBinder","linb.absObj",{
    Instance:{
        _ini:function(properties, events, host){
            var self=this,
                c=self.constructor,
                profile,
                options,
                np=c._namePool,
                alias;
            if(properties && properties['linb.Profile']){
                profile=properties;
                alias = profile.alias || c.pickAlias();
            }else{
                if(properties && properties.key && linb.absBox.$type[properties.key]){
                    options=properties;
                    properties=null;
                    alias = options.alias;
                    alias = (alias&&!np[alias])?alias:c.pickAlias();
                }else
                    alias = c.pickAlias();
                profile=new linb.Profile(host,self.$key,alias,c,properties,events, options);
            }
            np[alias]=1;
            profile._n=profile._n||[];
            profile._valuesMap=profile._valuesMap||{};

            //set anti-links
            profile.link(c._cache,'self').link(linb._pool,'linb');

            if(!profile.name)profile.boxing().setName(alias);

            self._nodes.push(profile);
            profile._cacheInstance=self;
            
            return self;
        },
        destroy:function(){
            this.each(function(profile){
                var box=profile.box,name=profile.properties.name;
                //unlink
                _.arr.each(profile._n, function(v){if(v)box._unBind(name,v)});
                //delete from pool
                delete box._pool[name];
                //free profile
                profile.__gc();
            });
        },
        updateValue:function(){
            return this.each(function(o,i){
                var map=o._valuesMap;
                _.arr.each(o._n,function(profile){
                    profile.boxing().updateValue();
                    //update _valuesMap
                    map[profile.properties.dataField]=profile.properties.value;
                });
            })
        },
        resetValue:function(map, force){
            var t,p,v,c,b;
            force=force!==false;
            return this.each(function(o,i){
                if(!map)map={};
                // set default value to map. For those no-rendered controls
                var vs=force ? map : o._valuesMap;
                _.arr.each(o._n,function(profile){
                    p=profile.properties;
                    t=p.dataField;
                    // need reset?
                    if( force || t in map){
                        // #45
                        v=(map && t in map)?map[t]:'';
                        // reset real value
                        vs[t]=v;
                        c=null;
                        b=profile.boxing();
                        if(_.isHash(v)){
                            // catch caption at first
                            c=_.isSet(v.caption)?v.caption:null;
                            // reset v at last
                            v=v.value;
                        }
                        // set value
                        b.resetValue(v);
                        // set caption
                        if(!_.isSet(p.caption) && b.setCaption)
                            _.tryF(b.setCaption,[c,true],b);
                    }
                });
                o._valuesMap=vs;
            })
        },
        getUI:function(key){
            var r;
            if(!key)
                r=linb.UI.pack(this.get(0)._n,false);
            else
                _.arr.each(this.get(0)._n,function(profile){
                    if(profile.properties.dataField==key){
                        r=profile.boxing();
                        return false;
                    }
                });
            return r;
        },
        checkValid:function(){
            return linb.absValue.pack(this.get(0)._n,false).checkValid();
        },
        getValue:function(dirtyOnly, reset, withCaption){
            var ns=this,o=ns.get(0),bDirty=false;
            // check dirty
            _.arr.each(o._n,function(profile){
                var p=profile.properties;
                if(p.value!==p.$UIvalue){
                    bDirty=true;
                    return false;
                }
            });
            // if dirty, check valid
            if(bDirty && !ns.checkValid())
                return null;

            var hash={};
            _.arr.each(o._n,function(profile){
                var p=profile.properties,
                b = profile.boxing(),
                v = b.getValue(),
                uv = b.getUIValue();
                // v and uv can be object(Date,Number)
                if(!dirtyOnly || (dirtyOnly && (uv+" ")!==(v+" "))){
                    if(withCaption && b.getCaption){
                        hash[p.dataField]={value:uv,caption:b.getCaption()};
                    }else{
                        hash[p.dataField]=uv;
                    }
                    if(reset!==false && profile.renderId){
                        b.updateValue();
                    }
                }
            });

            if(!dirtyOnly)
                _.merge(hash,o._valuesMap,'without');
            if(reset!==false)
                _.merge(o._valuesMap,hash,'all');
            return hash;
        },
        setHost:function(value, alias){
            var self=this;
            if(value && alias)
                self.setName(alias);
            return arguments.callee.upper.apply(self,arguments);
        }
    },
    Static:{
        $nameTag:"databinder_",
        _pool:{},
        destroyAll:function(){
            this.pack(this._pool,false).destroy();
            this._pool={};
        },
        getFromName:function(name){
            var o=this._pool[name];
            return o && o.boxing();
        },
        _bind:function(name, profile){
            var t,v,o=this._pool[name];
            if(!o){
                o=new linb.DataBinder();
                o.setName(name);
                o=o.get(0);
            }
            var map=o._valuesMap;
            if(profile){
                if(_.arr.indexOf(o._n,profile)==-1)
                    //use link for 'destroy UIProfile' trigger 'auto unbind function '
                    profile.link(o._n, 'databinder.'+name);
                var p=profile.properties,c,b;
                // set control value 1
                if(t=p.dataField){
                    // #45
                    v=(map && t in map)?map[t]:'';
                    // reset real value
                    map[t]=v;
                    c=null;
                    b=profile.boxing();
                    if(_.isHash(v)){
                        // catch caption at first
                        c=_.isSet(v.caption)?v.caption:null;
                        // reset v at last
                        v=v.value;
                    }
                    // set value
                    b.resetValue(v);
                    // set caption
                    if(!_.isSet(p.caption) && b.setCaption)
                        _.tryF(b.setCaption,[c,true],b);
                }
            }
        },
        _unBind:function(name, profile){
            if(profile && profile.box && this._pool[name])
                profile.unLink('databinder.'+name);
        },
        DataModel:{
            name:{
                set:function(value,ovalue){
                    var o=this,
                        c=linb.DataBinder,
                        _p=c._pool,
                        to=_p[ovalue],
                        t=_p[value],
                        ui;

                    //if it exists, overwrite it dir
                    //if(to && t)
                    //    throw new Error(value+' exists!');

                    _p[o.properties.name=value]=o;
                    //modify name
                    if(to && !t && o._n.length){
                        ui=linb.absValue.pack(_.copy(o._n));
                        _.arr.each(o._n, function(v){c._unBind(ovalue,v)});
                        ui.setDataBinder(value);
                    }
                    //pointer to the old one
                    if(t && !to) o._n=t._n;
                    //delete the old name from pool
                    if(to)delete _p[ovalue];

                }
            }
        }
    }
});
//UIProfile Class
Class('linb.UIProfile','linb.Profile', {
    Instance:{
        //readonly please
        renderId:null,
        _render:function(){
            var ns=this,t,map=linb.$cache.profileMap;

            //first render
            if(!ns.renderId){
                var ele=linb.Dom.byId(ns.$domId);

                //for dynRender
                if(!ele)return;

                if(ns.domId!=ns.$domId)
                    ele.id=ns.domId;

                map[ns.domId] = map[ns.$domId] = ns;

                //e.g. use div.innerHTML = ui.toHtml();
                if(!ele.$linbid)
                    linb.UI.$addEventsHanlder(ele, true);

                ns.renderId=ele.$linbid;

                ele=null;
            }

            //RenderTrigger
            if(t=ns.RenderTrigger){
                for(var i=0,l=t.length;i<l;i++)
                    t[i].call(ns);
                delete ns.RenderTrigger;
                if(ns.onRender)
                    ns.boxing().onRender(ns);
                _.tryF(ns.$onrender,[],ns);
            }

            if(arguments[0]===true && (t=ns.LayoutTrigger)){
                for(var i=0,l=t.length;i<l;i++)
                    t[i].call(ns);
                if(ns.onLayout)
                    ns.boxing().onLayout(ns);
            }
            if(!ns.properties.lazyAppend){
                if(ns.children)
                    for(var i=0,v;v=ns.children[i++];)
                        if(v[0]._render)
                            v[0]._render(true);

                if(ns.$attached){
                    for(var i=0,v;v=ns.$attached[i++];)
                        if(v._render)
                            v._render(true);
                    delete ns.$attached;
                }
                if(ns.exchildren){
                    var arr=[];
                    for(var i=0,v;v=ns.exchildren[i++];)
                        ns.boxing().append(v[0],v[1]);
                    delete ns.exchildren;
                }
                if(ns.excoms){
                    var arr=[];
                    for(var i=0,v;v=ns.excoms[i++];)
                        v[0].show(null, ns.boxing(), v[1], false);
                    delete ns.excoms;
                }
            }
        },
        __gc:function(){
            var ns=this, t;
            if(ns.$destroyed)return;
            // special one
            if(ns.$beforeDestroy){
                _.tryF(ns.$beforeDestroy,[],ns);
                delete ns.$beforeDestroy;
            }
            _.tryF(ns.$ondestory,[],ns);
            if(ns.onDestroy)ns.boxing().onDestroy();
            if(ns.destroyTrigger)ns.destroyTrigger();

            //gc already
            if(!ns.serialId)return;
            if(t=ns._$composed)
                _.each(t,function(v){
                    v.__gc();
                });

            //clear cache things
            ns.clearCache();

            //for dock case
            if(t=ns.$dockParent)
                if(t=ns.constructor.getFromDom(t))
                    _.tryF(t.clearCache,[],t);

            //for refresh function
            if(!ns.$noReclaim){
                //restore dom id
                t=linb.$cache.reclaimId;
                (t[ns.key] || (t[ns.key]=[])).push(ns.serialId);
            }else delete ns.$noReclaim

            //clear cache point
            delete linb.$cache.profileMap[ns.domId];
            delete linb.$cache.profileMap[ns.$domId];
            if(ns.box)
                delete ns.box._namePool[ns.alias];

            //clear anti link
            ns.unLinkAll();


            if(ns.LayoutTrigger)
                ns.LayoutTrigger.length=0;
            if(ns.RenderTrigger)
                ns.RenderTrigger.length=0;

            //gc children
            if((t=ns.children).length){
                t=_.copy(t);
                for(var i=0;i<t.length;i++){
                    t[i][0].__gc();
                    t[i].length=0;
                }
                t.length=0;
            }

            //set once
            ns.$destroyed=true;
            _.tryF(ns.$afterdestory,[],ns);
            _.breakO([ns.properties,ns.events, ns.CF, ns.CB, ns.CC, ns.CS, ns],2);
            //set again
            ns.$destroyed=true;
        },
        unlinkParent:function(){
            var profile=this;
            delete profile.parent;
            delete profile.childrenId;
            profile.unLink('$parent');
            return profile;
        },
        getRootNode:function(){
            return linb.getNodeData(this.renderId, 'element');
        },
        getRoot:function(){
            return linb([this.renderId],false);
        },
        getContainer:function(subId){
            if(subId=typeof subId=='string'?subId:null)subId=this.getSubIdByItemId(subId);
            return this.box._CONTAINERKEY?this.getSubNode(this.box._CONTAINERKEY, subId):this.keys.PANEL?this.getSubNode(this.keys.PANEL, subId):this.getRoot();
        },
        linkParent:function(parentProfile, linkId){
            var profile=this;
            //unlink first
            profile.unlinkParent();

            //link
            profile.parent = parentProfile;
            profile.childrenId = linkId;
            profile.link(parentProfile.children, '$parent', [profile, linkId]);
            return profile;
        },
        _cacheR1:/^\w[\w_-]*$/,
        setDomId:function(id){
            var t=this, c=linb.$cache.profileMap;
            //ensure the value
            if(typeof id== 'string' && (t._cacheR1.test(id)||id==t.$domId) && !linb.Dom.byId(id)){
                //delete the original one
                if(t.domId!=t.$domId)delete c[t.domId];
                //set profile's domId
                t.domId=id;

                //change the dom Node id value
                if(t.renderId)
                    t.getRootNode().id=id;

                //if doesn't create yet, don't set it to linb.$cache:
                if(c[t.$domId])c[id]=t;
            }
            return t;
        },
        getDomId:function(){
            return this.domId;
        },
        clearCache:function(){
            var ns=this,
                t=ns.$_egetter;
            for(var i in t){
                t[i].length=0;
                delete t[i];
            }

            t=ns.$_domid;
            for(var i in t){
                 t[i].__gc();
                 delete t[i];
            }

            return ns;
        },
        //get events function from profile
        _getEV:function(funs,id, name){
            var self=this,
                $k = id+"+"+name,
                g = self.$_egetter ||(self.$_egetter={}),
                cache;
            if(g[$k]){
                Array.prototype.push.apply(funs,g[$k]);
                return;
            }else cache=g[$k]=[];

            var dom=linb.$cache.profileMap,
                t,key
                ;
            //for event attached on dom node
            if( (t=dom[id]) && (t=t.events) && (t=t[name]) )
                for(var i=0,l=t.length;i<l;i++)
                    if(typeof t[t[i]]=='function')
                        cache.push(funs[funs.length]=t[t[i]]);


            //for event attached on linb widgets
            //get event function path of cache
            key = id.split(":")[0].split("-")[1];

            //for priority intercept
            if(typeof (((t=self._CB) && (key?(t=t[key]):1)) && (t=t[name]))=='function')
                cache.push(funs[funs.length]=t);
            else{
                //get event function from customBehavior first
                if(typeof (((t=self.CB) && (key?(t=t[key]):1)) && (t=t[name]))=='function')
                    cache.push(funs[funs.length]=t);
                else{
                    //get event function from public behavior
                    if(typeof (((t=self.behavior) && (key?(t=t[key]):1)) && (t=t[name]))=='function')
                        cache.push(funs[funs.length]=t);
                }
            }
        },
        _cacheR2:/<!--\x03([^>^\s]*)\x04-->/g,
        toHtml:function(force){
            var self=this,
                c = self.box,
                h={},
                str,
                k1='linb.UIProfile',
                k2='linb.Profile',
                id, i, o, m, a, b, data;
            //before _dynamicTemplate
            data=c._prepareData(self);
            if(c._dynamicTemplate)c._dynamicTemplate(self);
            str = c._build(self, data);

            if((!self.properties.lazyAppend||force) && (m=self.children)){
                for(i=0; o=m[i++];)
                    if(o[0][k1]){
                        id=o[1]||'';
                        a=h[id]||(h[id]=[]);
                        a[a.length]=o[0].toHtml(force);
                    }else if(!o[0][k2]){
                        b.ini.call(b,o[0]);
                        o[0]=b.get(0);
                    }
            }

            return str.replace(self._cacheR2, function(a,b){
                return h[b]?h[b].join(''):'';
            });
        },
        _buildItems:function(key, items, addEventHandler){
            var self=this,
                box=self.box,
                str=box._rpt(self, linb.UI.$doTemplate(self, _.get(linb.$cache.template,[box.KEY, self._hash]), items, key));
            return linb.UI.$toDom(str.replace(self._cacheR2,''), addEventHandler);
        },
        serialize:function(rtnString, keepHost){
            var t,m,
                self=this,
                o=(t=self.box._beforeSerialized)?t(self):self,
                r={
                    alias:o.alias,
                    key:o.key,
                    host:o.host
                };
            //host
            if(r.host===self){
                delete r.host;
            }else if(o.host && !keepHost ){
                if(rtnString!==false)
                    r.host='@this';
                else
                    delete r.host;
            }
            if(typeof o.theme=="string")
              r.theme=o.theme;

            //domId
            if(o.$domId!=o.domId)r.domId=o.domId;

            //properties
            var c={}, p=o.box.$DataStruct, map=linb.absObj.$specialChars;
            _.merge(c,o.properties, function(o,i){return (i in p) &&  p[i]!==o && !map[i.charAt(0)]});
            if(!_.isEmpty(c))r.properties=c;

            //events
            if(!_.isEmpty(t=this.getEvents()))r.events=t;
            var eh = o.box.$EventHandlers;
            _.filter(r.events, function(o,i){
                return o!=eh[i];
            });
            if(_.isEmpty(r.events))delete r.events;

            if(!_.isEmpty(o.CB)) r.CB=_.copy(o.CB);
            if(!_.isEmpty(o.CC)) r.CC=_.copy(o.CC);
            if(!_.isEmpty(o.CF)) r.CF=_.copy(o.CF);
            if(!_.isEmpty(o.CS)) r.CS=_.copy(o.CS);
            if(typeof o.theme == "string") r.theme=o.theme;

            //children
            if(o.children && o.children.length){
                o.children.sort(function(x,y){
                    x=parseInt(x[0].properties.tabindex);y=parseInt(y[0].properties.tabindex);
                    return x>y?1:x==y?0:-1;
                });
                t=r.children=[];
                _.arr.each(o.children,function(v){
                    m=[v[0].serialize(false, keepHost)];
                    if(v[1])m[1]=v[1];
                    t[t.length]=m
                });
            }
            if(o.exchildren && o.exchildren.length){
                r.exchildren=o.exchildren;
            }
            return rtnString===false?r:_.serialize(r);
        },
        _applySetAction:function(fun, value, ovalue){
            if(this.renderId)
                return fun.call(this, value, ovalue);
        },
        getKey:function(id){
            var t;
            if(id.charAt(0)=='!')id=linb.use(id).id();
            if(id.indexOf(':')==-1)id=(t=linb.$cache.profileMap[id])&&(t.$domId);
            return id?id.split(":")[0]:"";
        },
        getSubId:function(id){
            var t;
            if(id.charAt(0)=='!')id=linb.use(id).id();
            if(id.indexOf(':')==-1)id=(t=linb.$cache.profileMap[id])&&(t.$domId);
            return id?id.split(":")[2]:"";
        },
        pickSubId:function(key){
            var self=this, r,o = self.cache_subid || (self.cache_subid={});
            if((o[key] || (o[key]=[]))[0])return o[key].shift();
            o = self.subId || (self.subId={});
            r=(o[key] || (o[key]=new _.id)).next();
            return r;
        },
        reclaimSubId:function(id, key){
            var o = this.cache_subid || (this.cache_subid={});
            (o[key] || (o[key]=[])).push(id);
        },
        /*
        *('KEY','-mouseover',false);
        */
        _cacheR3:/\./g,
        _cacheH1:{},
        getClass:function(key, tag){
            key=this.keys[key] || key;
            var self=this,
                hash=key+":"+(tag||'');
            return self._cacheH1[hash] || (self._cacheH1[hash]=key.replace(self._cacheR3,'-').toLowerCase().replace('linb-ui','linb') + (tag||''));
        },
        _getSubNodeId:function(key, subId){
            var arr = this.$domId.split(':');
            arr[0]=key;
            arr[2]=_.isSet(subId)?(subId+""):'';
            key=arr.join(':');
            return key==this.$domId
                ? linb.$cache.profileMap[key].domId
                : key;
        },
        //flag : remove from cache
        getSubNode:function(key, subId){
            var self=this;

            // destroyed already
            if(!self.renderId)return linb();

            var key=self.keys[key] || key,
                r,
                t,
                s,
                h=self.$_domid||(self.$_domid={});


            // by key only
            if(subId===true)
                //key==self.keys.KEY for domId!=$domId
                r =linb([self.renderId]).query('*', 'id', key==self.keys.KEY?self.domId:new RegExp('^'+key+':'+self.serialId));
            else{
                if(!_.isSet(subId) && h[key] && h[key]._nodes.length==1)return h[key];
                r = (t=linb.Dom.byId(s=self._getSubNodeId(key, subId))) ? linb([t]) : ((t=self.renderId) && linb.use(t).query('*', 'id', s));
                if(!_.isSet(subId))h[key]=r;
            }
            return r;
        },
        getSubNodes:function(arr,subId){
            var i=0,a=[],o;
            for(;o=arr[i++];)
                Array.prototype.push.apply(a,this.getSubNode(o,subId).get());
            return linb(a);
        },
        getSubNodeByItemId:function(key, itemId){
            return (itemId=this.getSubIdByItemId(itemId)) ? this.getSubNode(key, itemId) : linb();
        },
        getItemByItemId:function(itemId){
            var t;
            if((t=this.ItemIdMapSubSerialId) && (t=t[itemId]))
                return this.SubSerialIdMapItem[t];
        },
        getItemByDom:function(src){
            return this.SubSerialIdMapItem && this.SubSerialIdMapItem[
                this.getSubId( typeof src=='string'
                    ? src.charAt(0)=='!'
                        ? ((src=linb.use(src).get(0))&&src.id)
                        : src
                    : src.id )
             ];
        },
        getItemIdByDom:function(src){
            var t;
            return (t=this.getItemByDom(src)) && t.id;
        },
        getSubIdByItemId:function(itemId){
            var t;
            return (t=this.ItemIdMapSubSerialId) && t[itemId];
        },
        queryItems:function(items, fun, deep, single, flag){
            var r=[],
                me=arguments.callee,
                f = me.f || (me.f = function(items, fun, deep, single, flag, r){
                    _.arr.each(items,function(o,i){
                        if(fun===true || fun.call(null, o, i, items)){
                            r.push(flag?[o,i,items]:o);
                            if(single)
                                return false;
                        }
                        if(deep && o.sub && o.sub.length)
                            f(o.sub, fun, deep, single, flag, r);
                    });
                });
            f(items, fun, deep, single, flag, r);
            return r;
        }
    },
    Static:{
        getFromDom:function(id){
            if(
                (
                id=typeof id=='string'
                    ? id.charAt(0)=='!'
                        ? ((id=linb.use(id).get(0)) && id.id)
                        :id
                    : (id && id.id)
                ) &&
                (id=linb.Event._getProfile(id)) && id['linb.UIProfile']
               )
                return id;
        }
    }
});

//UI Class
Class("linb.UI",  "linb.absObj", {
    Before:function(key, parent_key, o){
        linb.absBox.$type[key.replace("linb.UI.","").replace("linb.","")]=linb.absBox.$type[key]=key;
        return true;
    },
    After:function(){
        linb.absObj.After.apply(this,arguments);
        var self=this,me=arguments.callee,
            temp,t,k,u,c,i,j,e,w,v,b,d;

        self._ctrlId = new _.id();
        self._idCache=[];
        self.$cssKeys={};

        /*change keys*/
        t=self.$Keys;
        t.KEY = t.$key = self.KEY;
        self.addTemplateKeys(_.toArr(t,true));

        //Inheriates Behaviors
        v='$Behaviors';
        k={};
        if((t=self.$parent) && (e=t.length)){
            while(e--){
                b=t[e][v];
                for(i in b){
                    if(typeof b[i]=='object'){
                        if(_.isArr(b[i])){
                            u=k[i]||(k[i]=[]);
                            u.push.apply(u,b[i]);
                        }else{
                            u=k[i]||(k[i]={});
                            _.merge(u,b[i]);
                        }
                    }else
                        k[i]=b[i];
               }
            }
        }
        self[v]=k;

        //Inheriates Templates
        v='$Templates';
        k={};
        if((t=self.$parent) && (e=t[0]))
            for(i in e[v])
                if(i.charAt(0)!='$')
                    k[i]=e[v][i];
        self[v]=_.clone(k);

        //Inheriates Appearances
        v='$Appearances';
        k={};
        if((t=self.$parent) && (e=t.length))
        while(e--){
            b=t[e];
            for(i in b[v]){
                t=b[v][i];
                u=k[i]||(k[i]={});
                _.merge(u,t);
            }
        }
        self[v]=k;

        self.setTemplate(self.Templates);
        delete self.Templates;

        self.setBehavior(self.Behaviors||{});
        delete self.Behaviors;

        self.setAppearance(self.Appearances);
        delete self.Appearances;

        if(t=self.PublicAppearance){
            linb.UI.$cache_css += self.buildCSSText(t);
            delete self.PublicAppearance;
        }
    },
    Instance:{
        setTheme:function(key){
            if(typeof key!="string" || !key)key=null;
            var k,arr=[];
            this.each(function(o){
                if(key!=o.theme){
                    if(key===null)
                        delete o.theme;
                    else
                        o.theme=key;
                    arr.push(o);
                }
            });
            linb.UI.pack(arr,false).refresh();
            return this;
        },
        getTheme:function(){
            return this.get(0) && this.get(0).theme;
        },
        destroy:function(){
            this.each(function(o){
                if(o.$destroyed)return;
                // special one
                if(o.$beforeDestroy){
                    _.tryF(o.$beforeDestroy,[],o);
                    delete o.$beforeDestroy;
                }
                if(o.beforeDestroy && false===o.boxing().beforeDestroy())return;
                if(o.renderId)o.getRoot().remove();
                else o.__gc();
            });
            this._nodes.length=0;
        },
        serialize:function(rtnString, keepHost){
            var a=[];
            this.each(function(o){
                a[a.length]=o.serialize(false, keepHost);
            });
            return rtnString===false?a:a.length==1?" new "+a[0].key+"("+_.serialize(a[0])+")":"linb.UI.unserialize("+_.serialize(a)+")";
        },
        getProperties:function(key){
            var h={},prf=this.get(0),prop=prf.properties,funName;
            if(key===true)
                return _.copy(prop);
            else if(typeof key=='string')
                return prop[key];
            else{
                for(var k in prop){
                    funName="get"+_.str.initial(k);
                    if(typeof this[funName]=='function')
                        h[k]=this[funName].call(this);
                }
                return h;
            }
        },
        setProperties:function(key, value){
            if(typeof key=="string"){
                var h={};
                h[key]=value;
                key=h;
            }
            return this.each(function(o){
                _.each(key, function(v,k){
                    var funName="set"+_.str.initial(k),ins=o.boxing();
                    if(typeof ins[funName]=='function')
                        ins[funName].call(ins, v);
                });
            });
        },
        getEvents:function(key){
            return this.get(0).getEvents(key);
        },
        setEvents:function(key, value){
            if(typeof key=="string"){
                var h={};
                h[key]=value;
                key=h;
            }
            return this.each(function(o){
                var ins=o.boxing();
                _.each(key, function(v,k){
                    if(typeof ins[k]=='function')
                        ins[k].call(ins, v);
                });
            });
        },
        _toDomElems:function(){
            var arr=[];
            //collect those need to be rendered
            _.arr.each(this._nodes,function(o){
                if(!o.renderId)
                    arr.push(o);
            });
            //render those
            if(arr.length)
                linb.UI.pack(arr,false).render();

            //get rendered
            arr.length=0;
            _.arr.each(this._nodes,function(o){
                arr.push(o.renderId);
            });
            return arr;
        },

        _ini:function(properties, events, host, theme, CS, CC, CB, CF){
            var self=this,
                c=self.constructor,
                profile,
                t='default',
                options,
                np=c._namePool,
                alias,temp;
            if(properties && properties['linb.Profile']){
                profile=properties;
                alias = profile.alias || c.pickAlias();
                linb.UIProfile.apply(profile,[host,self.$key,alias,c,null,events]);
            }else{
                if(properties && properties.key && linb.absBox.$type[properties.key]){
                    options=properties;
                    properties=null;
                    alias = options.alias;
                    alias = (alias&&!np[alias])?alias:c.pickAlias();
                }else
                    alias = c.pickAlias();
                profile=new linb.UIProfile(host,self.$key,alias,c,properties,events, options);
            }
            np[alias]=1;
            for(var i in (temp=c.$DataStruct))
                if(!(i in profile.properties))
                    profile.properties[i]=typeof temp[i]=='object'?_.copy(temp[i]):temp[i];

            profile.keys = c.$Keys;

            // custom
            profile.CS = CS?_.copy(CS):(profile.CS||{});
            profile.CB = CB?_.copy(CB):(profile.CB||{});
            profile.CC = CC?_.copy(CC):(profile.CC||{});
            profile.CF = CF?_.copy(CF):(profile.CF||{});
            if(typeof theme =="string")profile.theme = theme;

            profile.template = c.getTemplate();
            profile.behavior = c.$Behaviors;

            if(!profile.serialId)profile.serialId=c._pickSerialId();

            profile.$domId = profile.key + ":" + profile.serialId + ":";
            profile.domId = profile.domId || profile.$domId;

            profile.RenderTrigger=_.copy(c.$RenderTrigger);
            profile.LayoutTrigger=_.copy(c.$LayoutTrigger);

            //set links
            profile.link(linb.UI._cache,'UI').link(c._cache,'self').link(linb._pool,'linb');

            temp=profile.children;
            profile.children=[];
            if(temp && temp.length){
                for(var i=0,v;v=temp[i++];){
                    //from serialize
                    if(!v[0]['linb.UIProfile'])
                        v[0]=new (linb.SC(v[0].key))(v[0]).get(0);
                    v[0].linkParent(profile,v[1]);
                }
            }
            self._nodes.push(profile);
            profile._cacheInstance=self;

            return self;
        },
        busy:function(message,html,key,subId){
            message=typeof message=='string'?message:'Loading...';
            html=typeof html=='string'?html:'<span style="background:url('+linb.ini.img_busy+') no-repeat left center;padding-left:16px;">'+message+'</span>';
            return this.each(function(profile){
                _.resetRun(profile.$linbid+':busy',function(profile,key,subId){
                    var keys=profile.keys;
                    key=keys[key]||keys['BORDER']||keys['PANEL']||keys['KEY'];
                    var parentNode=profile.getSubNode(key,subId);
                    if(parentNode.isEmpty())
                        return;

                    if(!profile.$busy||profile.$busy.isEmpty()){
                        node=profile.$busy=linb.create('<div style="left:0;top:0;z-index:10;position:absolute;background-color:#DDD;width:100%;height:100%;"></div><div style="left:0;top:0;z-index:20;text-align:center;position:absolute;width:100%;height:100%;"><div>'+html+'</div></div>');
                        linb([node.get(0)]).css({opacity:0.5});
                    }
                    node=profile.$busy;

                    linb([node.get(1).firstChild]).html(html,false).css('paddingTop',(parentNode.offsetHeight()||0)/2+'px');

                    parentNode.append(node);
                },50,[profile,key,subId]);
            });
        },
        free:function(){
            return this.each(function(profile){
                _.resetRun(profile.$linbid+':busy');
                if(profile.$busy){
                    profile.$busy.remove();
                    delete profile.$busy;
                }
            });
        },
        reLayout:function(force){
            return this.each(function(o){
                if(!o.renderId)return;
                var p=o.properties;

                if((!o.$noB) && p.border && o.boxing()._border)
                    o.boxing()._border(null,false);

                if(p.dock && p.dock!='none'){
                    o.boxing().adjustDock(force);
                }else{
                    if(force){
                        o._resize_h=-1;
                        o._resize_w=-1;
                    }
                    linb.UI.$tryResize(o,p.width,p.height,force);
                }
            });
        },
        toHtml:function(force){
            var a=[];
            _.arr.each(this._nodes,function(o){
                a[a.length]=o.toHtml(force);
            });
            return a.join('');
        },
        render:function(triggerLayOut){
            var ns=this, arr=[], i, l, o, n=ns._nodes, matrix, a=[],byId=linb.Dom.byId;

            linb.UI.$applyCSS();

            //get those no-html items
            for(i=0;o=n[i++];)
                if(!o.renderId && !linb.Dom.byId(o.domId) && !linb.Dom.byId(o.$domId))
                    arr[arr.length]=o;

            //build html and to dom
            if(l=arr.length){
                for(i=0;i<l;i++) a[a.length]=arr[i].toHtml();
                linb.UI.$toDom(a.join(''));
            }

            //render UIProfiles
            for(i=0;o=n[i++];)
                o._render(triggerLayOut);

            a.length=arr.length=0;
            return ns;
        },
        renderOnto:function(node, host){
            node=linb(node);
            if(node.isEmpty())return this;

            var self=this,
                pro=self.get(0),
                me=arguments.callee,
                para=me.para||(me.para=function(node){
                    var r = node.cssRegion();
                    r.tabindex=node.attr('tabIndex');
                    if(r.tabindex<=0)delete r.tabindex;
                    r.zIndex=node.css('zIndex');
                    r.position=node.css('position');
                    return r;
                }),
                id=node.id();

            _.merge(pro.properties, para(node),'all');
            pro.properties.dock='none';
            if(!pro.alias && id)
                pro.alias=id;
            if(pro.alias)
                self.setHost(host||window, pro.alias);
            self.render(true);
            node.replace(self.getRoot());

            if(id)
                self.setDomId(id);

            return self;
        },
        setDomId:function(id){
            this.get(0).setDomId(id);
            return this;
        },
        hide:function(){
            return this.each(function(o){
                if(o.renderId){
                    o.getRoot().hide();
                    o.properties.top=o.properties.left=-10000;
                    o.properties.dockIgnore=true;
                }
            });
        },
        show:function(parent,subId,left,top){
            return this.each(function(o){
                var t=o.properties,b;
                left=(left||left===0)?(parseInt(left)||0):null;
                top=(top||top===0)?(parseInt(top)||0):null;
                if(left!==null)t.left=left;
                if(top!==null)t.top=top;
                if(linb.getNodeData(o.renderId,'_linbhide')){
                    b=1;
                    t.dockIgnore=false;
                    o.getRoot().show(left&&(left+'px'), top&&(top+'px'));
                    if(t.dock && t.dock!='none')
                        linb.UI.$dock(o,false,true);
                //first call show
                }else if(!parent && (!o.renderId || (o.getRootNode().id || "").indexOf(linb.Dom._emptyDivId)===0))
                    parent=linb('body');
                var p=parent,n;
                if(p){
                    if(p['linb.UIProfile']){n=p.renderId;p=p.boxing()}
                    else if(p['linb.UI'])n=(n=p.get(0))&&n.renderId;
                    else n=(p=linb(p))&&p._nodes[0];
                    if(n){
                        p.append(o.boxing(),subId);
                        if(!b)o.getRoot().show(left&&(left+'px'), top&&(top+'px'));
                    }
                }
            });
        },
        clone:function(){
            var arr=[],f=function(p){
                //remove those
                delete p.alias;delete p.domId;
                if(p.children)
                    for(var i=0,c;c=p.children[i];i++)
                        f(c);
            };
            this.each(function(o){
                o=o.serialize(false,true);
                f(o);
                arr.push(o);
            });
            return this.constructor.unserialize(arr);
        },
        refresh:function(){
            var para,node,b,p,s,$linbid,serialId,fun,box,children,uiv;
            return this.each(function(o){
                if(!o.renderId)return;

                box=o.box;

                //save related id
                $linbid=o.$linbid;
                serialId=o.serialId;

                if(typeof o.boxing().getUIValue=='function'){
                    uiv=o.boxing().getUIValue();
                    if(o.boxing().getValue()===uiv)
                        uiv=null;
                }

                //keep parent
                if(b=!!o.parent){
                    p=o.parent.boxing();
                    para=o.childrenId;
                }else
                    p=o.getRoot().parent();

                //protect children's dom node
                //no need to trigger layouttrigger here
                node=linb.$getGhostDiv();
                o.boxing().getChildren().reBoxing().each(function(v){
                    node.appendChild(v);
                });
                node=null;

                //keep children
                children = _.copy(o.children);
                o.boxing().removeChildren();

                //unserialize
                s = o.serialize(false, true);
                fun = o.$refreshTrigger;

                //replace
                var replace = linb.create('span');
                o.getRoot().replace(replace);

                //destroy it
                //avoid reclaiming serialId
                o.$noReclaim=1;

                // keep cache refrence
                var _c=o._cacheInstance;
                o.boxing().destroy();

                //set back
                _.merge(o,s,'all');
                // notice: remove $destroyed here
                delete o.$destroyed;
                o.$linbid=$linbid;
                o.serialId=serialId;

                //create
                o=new box(o).render();
                
                // set cache refrence
                if(_c){
                    _.merge(_c,o,'all');
                    o.get(0)._cacheInstance=_c;
                }

                //for functions like: UI refresh itself
                if(fun)
                    fun.call(fun.target,o.get(0));


                //add to parent, and trigger RenderTrigger
                if(b)
                    p.append(o,para);
                else
                    p.append(o);

                //restore children
                _.arr.each(children,function(v){
                    delete v[0].$dockParent;
                    o.append.apply(o,v);
                });

                //back to original position
                replace.replace(o.get(0).getRoot());
                replace.remove();
                replace=null;

                if(uiv)
                    o.setUIValue(uiv,true);
            });
        },
        append:function(target, subId){
            if(_.isHash(target) || _.isStr(target))
                target=linb.create(target);
            if(target['linb.UIProfile'])target=target.boxing();

            var pro=this.get(0),parentNode;

            if(pro.beforeAppend && false===this.beforeAppend(pro,target))
                return;

            if(target['linb.Com']){
                if(pro.renderId){
                    if(subId=typeof subId=='string'?subId:null)subId=pro.getSubIdByItemId(subId);
                    parentNode=pro.keys.PANEL?pro.getSubNode(pro.keys.PANEL, subId):pro.getRoot();
                    if(!parentNode.isEmpty())
                        parentNode.append(target);
                }
                else{
                    (pro.excoms||(pro.excoms=[])).push([target,subId]);
                }
            }else{
                if(subId!==false){
                    if(target['linb.UI']){
                        target.each(function(profile){
                            profile.linkParent(pro,subId);
                        });
                    }
                }
                if(pro.renderId){
                    if(subId=typeof subId=='string'?subId:null)subId=pro.getSubIdByItemId(subId);
                    parentNode=pro.keys.PANEL?pro.getSubNode(pro.keys.PANEL, subId):pro.getRoot();
                    if(!parentNode.isEmpty())
                        parentNode.append(target);
                }else{
                    if(!target['linb.UI']){
                        if(!pro.exchildren)
                            pro.exchildren=[];
                        pro.exchildren.push([target,subId]);
                    }
                }
            }

            if(pro.afterAppend)
                this.afterAppend(pro,target);
            return this;
        },
        getParent:function(){
            var prf=this.get(0);
            if(prf)return prf.parent && prf.parent.boxing();
        },
        getChildrenId:function(){
            var prf=this.get(0);
            if(prf)return prf.childrenId;
        },
        getChildren:function(subId){
            var a=[];
            _.arr.each(this.get(0).children,function(v){
                if(subId?v[1]==subId:1)
                    a.push(v[0]);
            });
            return linb.UI.pack(a);
        },
        removeChildren:function(subId, bDestroy){
            return this.each(function(o){
                var c=_.copy(o.children);
                _.arr.each(c,function(v){
                    if(subId===true?1:subId?typeof subId=='string'?(v[1]==subId):(v[0]==(subId["linb.UI"]?subId.get(0):subId)):1){
                        if(o.beforeRemove && false===o.boxing().beforeRemove(o,v[0],v[1],bDestroy))
                            return;

                        v[0].unlinkParent();

                        if(o.afterRemove)
                            o.boxing().afterRemove(o,v[0],v[1],bDestroy);

                        if(bDestroy)
                            v[0].boxing().destroy();                    }
                });
            });
        },
        draggable:function(dragKey, dragData, key, options){
            return this.each(function(o){
                o.getSubNode(o.keys[key] || 'KEY', true)
                .beforeMousedown(dragKey?function(pro,e,src){
                    if(linb.Event.getBtn(e)!="left")return;
                    if(pro.properties.disabled)return;
                    options=options||{};
                    options.dragKey=dragKey;
                    options.dragData=typeof dragData == 'function'?dragData():dragData;
                    _.merge(options,{
                        dragCursor:'pointer',
                        dragType:'icon',
                        dragDefer:1
                    });
                    linb.use(src).startDrag(e, options);
                }:null,'_d',-1)
                .beforeDragbegin(dragKey?function(profile, e, src){
                    linb.use(src).onMouseout(true,{$force:true}).onMouseup(true);
                }:null,'_d',-1);
                if(!dragKey)
                    o.clearCache();
            });
        },
        setCustomFunction:function(key, value){
            return this.each(function(o){
                if(typeof key=='string'){
                    if(value) o.CF[key]=value;
                    else delete o.CF[key];
                }else
                    o.CF=key||{};
            });
        },
        setCustomClass:function(key, value){
            var me=arguments.callee,
                fun=(me.fun||(me.fun=function(pro,i, h, flag){
                    if(!h[i])return;
                    var node=pro.getSubNode(i,true),b;
                    if(!node.isEmpty())
                        _.arr.each(h[i].split(/\s+/),function(o){
                            node[flag?'removeClass':'addClass'](o);
                        });
                }));
            return this.each(function(o){
                var bak = _.copy(o.CC);

                //set key and value
                if(typeof key=='string'){
                    if(o.renderId)
                        if(key in bak)
                            fun(o, key, bak, true);

                    if(!value)
                        delete o.CC[key];
                    else{
                        o.CC[key]=value;
                        if(o.renderId)
                            fun(o, key, o.CC);
                    }
                //set hash dir
                }else if(!!key && typeof key=='object'){
                    if(o.renderId){
                        for(var i in key)
                            fun(o, i, bak, true);
                        for(var i in key)
                            fun(o, i, key);
                    }
                    o.CC=key;
                //clear all
                }else{
                    if(o.renderId)
                        for(var i in bak)
                            fun(o, i, bak, true);
                    o.CC={};
                }
            });
        },
        setCustomStyle:function(key,value){
            var me=arguments.callee,
                fun=(me.fun||(me.fun=function(pro,i,h, flag){
                    if(!h[i])return;
                    var node=pro.getSubNode(i,true),b;
                    if(!node.isEmpty())
                        _.arr.each(h[i].split(';'),function(o,i){
                            if((b=o.split(':')).length==2){
                                b[0]=b[0].replace(/\-(\w)/g,function(a,b){return b.toUpperCase()});
                                try{node.css(b[0], flag?'':b[1])}catch(e){}
                            }
                        });
                }));
            return this.each(function(o){
                var bak = _.copy(o.CS);

                //set key and value
                if(typeof key=='string'){
                    if(o.renderId)
                        if(key in bak)
                            fun(o, key, bak, true);

                    if(!value)
                        delete o.CS[key];
                    else{
                        o.CS[key]=value;
                        if(o.renderId)
                            fun(o, key, o.CS);
                    }
                //set hash dir
                }else if(!!key && typeof key=='object'){
                    if(o.renderId){
                        for(var i in key)
                            fun(o, i, bak, true);
                        for(var i in key)
                            fun(o, i, key);
                    }
                    o.CS=key;
                //clear all
                }else{
                    if(o.renderId)
                        for(var i in bak)
                            fun(o, i, bak, true);
                    o.CS={};
                }
            });
        },
        setCustomBehavior:function(key, value){
            return this.each(function(o){
                if(typeof key=='string'){
                    if(o.keys[key])
                        o.CB[key]=value||{};
                }else
                    o.CB=key||{};
                if(o.CB.KEY){
                    _.merge(o.CB, o.CB.KEY, 'all');
                    delete o.CB.KEY;
                }
                o.clearCache();
            });
        },
        adjustDock:function(force){
            return this.each(function(o){
                if(o.properties.dock && o.properties.dock!='none'){
                    if(force){
                        // ensure force 1
                        o.getRootNode().style.width=0;
                        o.getRootNode().style.height=0;
                        // ensure force 2
                        o._resize_h=-1;
                        o._resize_w=-1;
                    }
                    linb.UI.$dock(o,true,true);
                }
            });
        }
    },
    Initialize:function(){
        var ns=this.prototype;
        _.arr.each('getSubNode,getDomId,getRootNode,getRoot,getContainer'.split(','),function(o){
            if(!ns[o])
                ns[o]=function(){
                    var p=this.get(0);
                    return p ? p[o].apply(p,arguments) : null;
                };
                ns[o].$original$='linb.UI';
                ns[o].$type$='instance';
                ns[o].$name$=o;
        });

        var self=this, hash={};
        _.each(linb.UI.$ps,function(i,o){
            hash[o] = {
                ini:'auto',
                action:function(value){
                    var self=this,
                        p=self.properties,b=false,
                        args;
                    self.getRoot()[o]?self.getRoot()[o](value):linb.Dom._setPxStyle(self.getRootNode(),o,value);
                    if(o=='width'||o=='height'){
                        // for no _onresize widget only
                        if(!self.box._onresize && self.onResize)
                            self.boxing().onResize(self,o=='width'?value:null,o=='height'?value:null)
                    }else{
                        if(self.onMove)
                            self.boxing().onMove(self,o=='left'?value:null,o=='top'?value:null,o=='right'?value:null,o=='bottom'?value:null)
                    }

                    if(p.dock!='none'){
                        args={
                            $type:p.dock,
                            $dockid:_.arr.indexOf(['width','height','fill','cover'],p.dock)!=-1?self.$linbid:null
                        };
                        switch(p.dock){
                            case 'middle':
                                if(o!='height'&&o!='top')return;
                                args.top=args.height=1;
                                break;
                            case 'center':
                                if(o!='width'&&o!='left')return;
                                args.left=args.width=1;
                                break;
                            case 'top':
                                if(o!='height'&&o!='top')return;
                                args.width=args.height=1;
                                break;
                            case 'bottom':
                                if(o!='height'&&o!='bottom')return;
                                args.width=args.height=1;
                                break;
                            case 'left':
                                if(o!='width'&&o!='left')return;
                                args.width=args.height=1;
                                break;
                            case 'right':
                                if(o!='width'&&o!='right')return;
                                args.width=args.height=1;
                                break;
                            case 'width':
                                if('width'==o)return;
                                args.width=1;
                                break;
                            case 'height':
                                if('height'==o)return;
                                args.height=1;
                                break;
                            case 'fill':
                            case 'cover':
                                if(o=='width'&&o=='height')return;
                                args.width=args.height=1;
                                break;
                        }
                        _.tryF(self.$dockFun,[args],self);
                    }
                }
            }
        });
        _.merge(hash,{
            renderer:{
                ini:null
            },
            //invalid after dom dom Node
            zIndex:{
                ini:1,
                action:function(value){
                    this.getRoot().css('zIndex',value);
                }
            },
            tabindex:{
                ini:1,
                action:function(value){
                    var ns=this,
                        reg=new RegExp("^"+ns.key+"[-\\w]*"+":"+ns.serialId+":");
                    ns.getRoot().query("*",function(n){
                        return n.id && reg.test(n.id) && n.getAttribute('tabIndex');
                    }).attr('tabIndex',value);
                }
            },
            position:{
                ini : 'absolute',
                listbox:['','static','relative','absolute'],
                action:function(value){
                    this.getRoot().css('position',value);
                }
            },
            visibility:{
                listbox:['','visible','hidden'],
                action:function(value){
                    this.getRoot().css('visibility',value);
                    // special for resizer
                    if(this.$resizer){
                        if(value=='hidden')
                            this.$resizer.hide();
                        else
                            this.$resizer.show();
                    }

                    linb.setNodeData(this.getRootNode(),'_setVisibility',1);
                }
            },
            display:{
                listbox:['','none','block','inline','inline-block'],
                action:function(value){
                    if(value=='inline-block')
                        this.getRoot().setInlineBlock();
                    else
                        this.getRoot().css('display',value);
                }
            }
        });

        self.setDataModel(hash);

        linb.UI.$cache_css += linb.UI.buildCSSText({
            '.linbcss-noscroll, .linbcss-noscroll BODY, .linbcss-viewport, .linbcss-viewport BODY':{
                overflow:'hidden',
                height:'100%',
                border:'0 none',
                margin:'0',
                padding:'0'
            },
            '.ui-ctr':{},
            '.ui-draggable':{},
            '.ui-btn, .ui-btni, .ui-btnc':{
                height:'22px',
                background:linb.UI.$bg('button.gif', 'no-repeat', true)
            },
            '.ui-btn':{
                $order:1,
                'white-space': 'nowrap',
                'vertical-align':'top',
                overflow:'hidden',
                'background-position':'right top',
                'padding-right':'4px',
                'font-size':'12px'
            },
            '.ui-btn *':{
                cursor:'pointer'
            },
            '.ui-btnc button, .ui-btnc a':{
                display:linb.$inlineBlock,
                zoom:linb.browser.ie?1:null,
                background:'transparent',
                border:0,
                margin:0,
                padding:0
            },
            '.ui-btnc a':{
                padding:'0 4px'
            },
            '.ui-btni':{
                $order:1,
                'background-position':'left -60px',
                'padding-left':'4px',
                'vertical-align':'top'
            },
            '.ui-btnc':{
                $order:1,
                'background-position':'left -30px',
                'background-repeat': 'repeat-x',
                'padding-top':'3px',
                'vertical-align':'top'
            },
            '.ui-btn-mouseover, .ui-btn-focus':{
                $order:2,
                'background-position':'right -90px'
            },
            '.ui-btn-mouseover .ui-btni, .ui-btn-focus .ui-btni':{
                $order:2,
                'background-position':'left -150px'
            },
            '.ui-btn-mouseover .ui-btnc, .ui-btn-focus .ui-btnc':{
                $order:2,
                'background-position':'left -120px'
            },
            '.ui-btn-mousedown, .ui-btn-checked':{
                $order:3,
                'background-position':'right -180px'
            },
            '.ui-btn-mousedown .ui-btni, .ui-btn-checked .ui-btni':{
                $order:3,
                'background-position':'left -240px'
            },
            '.ui-btn-mousedown .ui-btnc, .ui-btn-checked .ui-btnc':{
                $order:3,
                'background-position':'left -210px'
            },
            '.ui-image':{
                'vertical-align':'middle',
                width:'16px',
                height:'16px',
                'background-repeat':'no-repeat'
            },
            '.ui-icon':{
                'vertical-align':'middle',
                width:'16px',
                height:'16px',
                'background-repeat':'no-repeat',
                'background-position' : 'center',
                margin:'0 2px'
            },
            '.ui-busy':{
                background: 'url('+linb.ini.img_busy+') no-repeat center center',
                'background-position' : 'center'
            },
            '.uicmd-close, .uicmd-info, .uicmd-opt, .uicmd-pop, .uicmd-land, .uicmd-refresh, .uicmd-toggle, .uicmd-toggle2, .uicmd-min, .uicmd-max,.uicmd-restore,.uicmd-pin, .uicmd-check, .uicmd-radio, .uicmd-add, .uicmd-remove':{
                background: linb.UI.$bg('icons.gif', 'no-repeat 0 0', true),
                width:'16px',
                height:'16px',
                'margin-right':'2px',
                cursor:'default',
                'vertical-align':'middle'
            },
            '.uicmd-info':{
                $order:1,
                'background-position' : '-320px 0'
            },
            '.uicmd-info-mouseover':{
                $order:2,
                'background-position' : '-320px  -20px'
            },
            '.uicmd-info-mousedown':{
                $order:3,
                'background-position' : '-320px  -40px'
            },
            '.uicmd-opt':{
                $order:1,
                'background-position' : '0 0'
            },
            '.uicmd-opt-mouseover':{
                $order:2,
                'background-position' : '0 -20px'
            },
            '.uicmd-opt-mousedown':{
                $order:3,
                'background-position' : '0 -40px'
            },
            '.uicmd-pop, .uicmd-land':{
                $order:1,
                'background-position' : '-40px 0'
            },
            '.uicmd-pop-mouseover, .uicmd-land-mouseover':{
                $order:2,
                'background-position' : '-40px -20px'
            },
            '.uicmd-pop-mousedown, .uicmd-land-mousedown':{
                $order:3,
                'background-position' : '-40px -40px'
            },
            '.uicmd-refresh':{
                $order:1,
                'background-position' : '-280px 0'
            },
            '.uicmd-refresh-mouseover':{
                $order:2,
                'background-position' : '-280px -20px'
            },
            '.uicmd-refresh-mousedown':{
                $order:3,
                'background-position' : '-280px -40px'
            },
            '.uicmd-pin':{
                $order:1,
                'background-position' : '-80px 0'
            },
            '.uicmd-pin-mouseover':{
                $order:2,
                'background-position': '-80px -20px'
            },
            '.uicmd-pin-mousedown':{
                $order:3,
                'background-position': '-80px -40px'
            },
            '.uicmd-pin-checked, .uicmd-pin-checked-mouseover, .uicmd-pin-checked-mousedown':{
                $order:4,
                'background-position':  '-80px -40px'
            },
            '.uicmd-min':{
                $order:1,
                'background-position' : '-120px 0'
            },
            '.uicmd-min-mouseover':{
                $order:2,
               'background-position': ' -120px -20px'
            },
            '.uicmd-min-mousedown':{
                $order:3,
               'background-position':  '-120px -40px'
            },
            '.uicmd-restore':{
                $order:1,
                'background-position' : '-160px 0'
            },
            '.uicmd-restore-mouseover':{
                $order:2,
               'background-position':  '-160px -20px'
            },
            '.uicmd-restore-mousedown':{
                $order:3,
               'background-position':  '-160px -40px'
            },
            '.uicmd-max':{
                $order:1,
                'background-position' : '-200px 0'
            },
            '.uicmd-max-mouseover':{
                $order:2,
               'background-position':  '-200px -20px'
            },
            '.uicmd-max-mousedown':{
                $order:3,
               'background-position':  '-200px -40px'
            },
            '.uicmd-close':{
                $order:1,
                'background-position' : '-240px 0'
            },
            '.uicmd-close-mouseover':{
                $order:2,
                'background-position' : '-240px -20px'
            },
            '.uicmd-close-mousedown':{
                $order:3,
                'background-position' : '-240px -40px'
            },
            '.uicmd-check':{
                $order:1,
                margin:'0 4px 0 2px',
                'background-position' : '-20px -70px'
            },
            '.uicmd-check-mouseover':{
                $order:2,
                'background-position' : '-20px -90px'
            },
            '.uicmd-check-mousedown':{
                $order:3,
                'background-position' : '-20px -110px'
            },
            '.uicmd-check-checked':{
                $order:4,
                'background-position' : '0 -70px'
            },
            '.uicmd-check-checked-mouseover':{
                $order:5,
                'background-position' : '0 -90px'
            },
            '.uicmd-check-checked-mousedown':{
                $order:6,
                'background-position' : '0 -110px'
            },
            '.uicmd-radio':{
                $order:1,
                margin:'0 4px 0 2px',
                'background-position' : '-60px -70px'
            },
            '.uicmd-radio-mouseover':{
                $order:2,
                'background-position' : '-60px -90px'
            },
            '.uicmd-radio-mousedown':{
                $order:3,
                'background-position' : '-60px -110px'
            },
            '.uicmd-radio-checked':{
                $order:4,
                'background-position' : '-40px -70px'
            },
            '.uicmd-radio-checked-mouseover':{
                $order:5,
                'background-position' : '-40px -90px'
            },
            '.uicmd-radio-checked-mousedown':{
                $order:6,
                'background-position' : '-40px -110px'
            },
            '.uicmd-add':{
                $order:1,
               'background-position':'-56px -222px'
            },
           '.uicmd-add-mouseover':{
                $order:2,
                'background-position':'-56px -222px'
           },
           '.uicmd-add-mousedown':{
                $order:3,
                'background-position':'-56px -222px'
           },
            '.uicmd-remove':{
                $order:1,
                'background-position': '-72px -222px'
            },
            '.uicmd-remove-mouseover':{
                $order:1,
                'background-position': '-72px -222px'
            },
            '.uicmd-remove-mousedown':{
                $order:1,
                'background-position': '-72px -222px'
            },

            '.uicmd-toggle':{
                $order:1,
                'background-position': '-160px -70px'
            },
            '.uicmd-toggle-mouseover':{
                $order:2,
                'background-position': '-160px -90px'
            },
            '.uicmd-toggle-mousedown':{
                $order:3,
                'background-position': '-160px -110px'
            },
            '.uicmd-toggle-checked':{
                $order:4,
                'background-position': '-180px -70px'
            },
            '.uicmd-toggle-checked-mouseover':{
                $order:5,
                'background-position': '-180px -90px'
            },
            '.uicmd-toggle-checked-mousedown':{
                $order:6,
                'background-position': '-180px -110px'
            },
            '.uicmd-toggle2':{
                $order:1,
                'background-position': '-200px -70px'
            },
            '.uicmd-toggle2-mouseover':{
                $order:2,
                'background-position': '-200px -90px'
            },
            '.uicmd-toggle2-mousedown':{
                $order:3,
                'background-position': '-200px -110px'
            },
            '.uicmd-toggle2-checked':{
                $order:4,
                'background-position': '-220px -70px'
            },
            '.uicmd-toggle2-checked-mouseover':{
                $order:5,
                'background-position': '-220px -90px'
            },
            '.uicmd-toggle2-checked-mousedown':{
                $order:6,
                'background-position': '-220px -110px'
            },
            '.uicmd-none':{
                display:'none'
            },
            '.uicmd-empty':{
                $order:1000,
                width:'16px',
                height:'16px',
                'margin-right':'2px',
                cursor:'default',
                'vertical-align':'middle',
                background:'none'
            },


            '.uibar-top, .uibar-bottom, .uibar-top-s, .uibar-bottom-s':{
                position:'relative',
                //for avoiding extra space after table in IE
                'vertical-align':'baseline',
                'font-size':0,
                'line-height':0
            },
            '.uibar-top td, .uibar-top-s td, .uibar-bottom td, .uibar-bottom-s td':{
                $order:1,
                background: linb.UI.$bg('bar_vertical.gif', 'no-repeat 0 0', true)
            },
//uibar-top
            /*set table height for ff2, set uibar height for performance*/
            '.uibar-top, .uibar-top .uibar-t':{
                height:'29px'
            },
            '.uibar-top .uibar-tdl':{
                $order:1,
                'padding-left':'4px',
                height:'100%',
                'background-position': '0 0'
            },
            '.uibar-top .uibar-tdm':{
                $order:1,
                'background-position': '0 -30px',
                'background-repeat': 'repeat-x'
            },
            '.uibar-top .uibar-tdr':{
                $order:1,
                'padding-left':'4px',
                'background-position': 'right -60px'
            },
            '.uibar-top-focus .uibar-tdl':{
                $order:2,
                'padding-left':'4px',
                height:'100%',
                'background-position': 'left -90px'
            },
            '.uibar-top-focus .uibar-tdm':{
                $order:2,
                'background-position': 'left -120px',
                'background-repeat': 'repeat-x'
            },
            '.uibar-top-focus .uibar-tdr':{
                $order:2,
                'padding-left':'4px',
                'background-position': 'right -150px'
            },
            '.uibar-top .uibar-cmdl':{
                overflow:'hidden',
                position:'absolute',
                left:0,
                top:'6px',
                width:'92%',
                height:'22px',
                'padding-left':'8px',
                'white-space': 'nowrap'
            },
            '.uibar-top .uibar-cmdr':{
                position:'absolute',
                top:'6px',
                right:'8px',
                'text-align':'right'
            },
            '.uicon-main':{
                position:'relative',
                'padding-left':'4px',
                'font-size':0,
                'line-height':0,
                'z-index':1,
                overflow:'visible',
                background: linb.UI.$bg('bar_horizontal.gif', 'repeat-y -595px top', true)
            },
            '.uicon-maini':{
                'padding-right':'4px',
                'font-size':0,
                'line-height':0,
                background: linb.UI.$bg('container_right.gif', '#AAD2FA repeat-y right top', true)
            },
//uibar-bottom
            '.uibar-bottom, .uibar-bottom .uibar-t':{
                height:'12px'
            },
            '.uibar-bottom .uibar-tdl':{
                $order:1,
                'padding-left':'4px',
                height:'100%',
                'background-position': 'left -189px'
            },
            '.uibar-bottom .uibar-tdm':{
                $order:1,
                'background-position': 'left -211px',
                'background-repeat': 'repeat-x'
            },
            '.uibar-bottom .uibar-tdr':{
                $order:1,
                'padding-left':'4px',
                'background-position': 'right -233px'
            },
//uibar-top-s
            '.uibar-top-s, .uibar-top-s .uibar-t':{
                $order:3,
                height:'7px'
            },
            '.uibar-top-s .uibar-tdl':{
                $order:3,
                height:'100%',
                'padding-left':'4px',
                'background-position': 'left -261px'
            },
            '.uibar-top-s .uibar-tdm':{
                $order:3,
                'background-position': 'left -283px',
                'background-repeat': 'repeat-x'
            },
            '.uibar-top-s .uibar-tdr':{
                $order:3,
                'padding-left':'4px',
                'background-position': 'right -305px'
            },
            '.uibar-top-s .uibar-cmdl':{
                $order:3,
                display:'none'
            },
            '.uibar-top-s .uibar-cmdr':{
                $order:3,
                display:'none'
            },
//uibar-bottom-s
            '.uibar-bottom-s, .uibar-bottom-s .uibar-t':{
                $order:3,
                height:'6px'
            },
            '.uibar-bottom-s .uibar-tdl':{
                $order:3,
                height:'100%',
                'padding-left':'4px',
                'background-position': 'left -327px'
            },
            '.uibar-bottom-s .uibar-tdm':{
                $order:3,
                'background-position': 'left -349px',
                'background-repeat': 'repeat-x'
            },
            '.uibar-bottom-s .uibar-tdr':{
                $order:3,
                'padding-left':'4px',
                'background-position': 'right -371px'
            }
        })
        + linb.UI.buildCSSText({
            '.ui-ctrl':{
                // disable all selectable
                '-moz-user-select':linb.browser.gek?'-moz-none':null,
                'vertical-align':'middle'
            },
            '.uiw-shell':{
                background:'transparent',
                display:linb.$inlineBlock,
                zoom:linb.browser.ie6?1:null,
                //overflow:'hidden',
                /*opera must be 0 not 'none'*/
                border:0,
                padding:0,
                margin:0
            },
            /*span*/
            '.uiw-frame':{
                $order:1,
                display:'block',
                position:'relative',
                //overflow:'hidden',
                border:0,
                padding:0,
                margin:0,
                width:'100%',
                height:'100%',
                '-moz-box-flex':'1'
            },
            /*span*/
            '.uiw-border':{
                $order:2,
                display:'block',
                position:'absolute',
                border:0,
                padding:0,
                margin:0,
                left:0,
                top:0,
                width:'100%',
                height:'100%'
            }
        })
        + linb.UI.buildCSSText({
            '.uibg-base':{
                'background-color':'#fff'
            },
            '.uibg-bar':{
                'background-color':'#aad2fa'
            },
            '.uiborder-flat':{
                border:'solid 1px #648cb4'
            },
            '.uiborder-inset':{
                border:'solid 1px',
                'border-color':'#648cb4 #c8e1fa #c8e1fa #648cb4'
            },
            '.uiborder-outset':{
                border:'solid 1px',
                'border-color':'#c8e1fa #648cb4 #648cb4 #c8e1fa'
            }
        });

        linb.UI.$cache_css2 += linb.UI.buildCSSText({
            '.ui-dirty':{
                $order:1,
                'background-image': linb.UI.$bg('icons.gif', '', true),
                'background-repeat': 'no-repeat',
                'background-position':'-390px -290px'
            },
            '.ui-inputdisabled':{
                color:'#808080'
            },
            '.ui-itemreadonly':{
                $order:2,
                color: '#808080'
            },
            '.ui-readonly, .ui-readonly *':{
                $order:2,
                color: '#808080'
            },
            '.ui-itemdisabled':{
                $order:2,
                cursor:'not-allowed',
                color: '#808080'
            },
            '.ui-disabled, .ui-disabled *':{
                $order:2,
                color: '#808080'
            },
            '.ui-invalid, .ui-invalid *':{
                $order:1,
                'background-color': '#FFEBCD'
            },
            '#linblangkey':{
                'vertical-align':'baseline'
            }
        });
    },
    $End:function(){
        linb.UI.$cache_css += this.buildCSSText(this.$Appearances);
    },
    Static:{
        $cache_css:'',
        $cache_css2:'',
        $css_tag_dirty: "ui-dirty",
        $css_tag_invalid: "ui-invalid",
        $tag_left:"{",
        $tag_right:"}",
        $tag_subId:"_serialId",


        $x01:/\x01/img,
        $x01r:/ \x01 /img,

        $tag_special:'\x01',
        $ID:"\x01id\x01",
        $DOMID:'\x01domid\x01',
        $CLS:"\x01cls\x01",
        $childTag:"<!--\x03{id}\x04-->",

        $onSize:function(profile,e){
            var style = profile.getRootNode().style;
            if(e.width||e.height)
                linb.UI.$tryResize(profile, style.width, style.height);
            style=null;
        },

        $theme:'default',
        $ps:{left:1,top:1,width:1,height:1,right:1,bottom:1},
        _objectProp:{tagVar:1},
        $toDom:function(str, addEventHandler){
            if(addEventHandler===false)
                return _.str.toDom(str);

            //must use empty div for RenderTriggers
            var matrix=linb.Dom.getEmptyDiv().get(0), r=[];
            matrix.innerHTML=str;
            //add event handlers
            this.$addEventsHanlder(matrix);
            for(var i=0,t=matrix.childNodes,l=t.length;i<l;i++){
                //ensure the root nodes
                linb.$registerNode(t[i]);
                r[r.length]=t[i].$linbid;
            }
            matrix=null;
            return linb(r,false);
        },
        $addEventsHanlder:function(node, includeSelf){
            var ch=linb.$cache.UIKeyMapEvents,
                eh=linb.Event._eventHandler,
                children=_.toArr(node.getElementsByTagName('*')),
                i,l,j,k,id,t,v;

            if(includeSelf)
                children.push(node);
            if(l=children.length){
                for(i=0;i<l;i++){
                    if((node=children[i]).nodeType!=1)continue;
                    if(id=node.id){
                        if(t = ch[id] || ch[id.substr(0,id.indexOf(':'))] ){
                            v=linb.$registerNode(node);
                            v=v.eHandlers||(v.eHandlers={});
                            for(j in t){
                                //attach event handler to domPurgeData
                                v[j]=t[j];
                                //attach event handler to dom node
                                if(k=eh[j])
                                    v[k]=node[k]=t[j];
                            }
                        }
                    }
                }
            }
            children.length=0;
            node=null;
        },
        getFromDom:function(id){
            if(id=linb.UIProfile.getFromDom(id))
                return id.boxing();
        },
        unserialize:function(target,keepSerialId){
            if(typeof target=='string')target=_.unserialize(str);
            var f=function(o){
                if(_.isArr(o))o=o[0];
                delete o.serialId;
                if(o.children)_.arr.each(o.children,f);
            }, a=[];
            _.arr.each(target,function(o){
                if(!keepSerialId)f(o);
                a.push((new (linb.SC(o.key))(o)).get(0));
            });
            return this.pack(a,false);
        },

        _ensureValues:function(arr){
            var a=[],i=0,k=0,o,key=this.KEY,cache=linb.$cache.profileMap,getData=linb.getNodeData;
            if(arr['linb.absBox'])arr=arr._nodes;
            for(;o=arr[i++];)
                if((o.box && o.box[key]) || ((o=cache[getData(o.renderId?o.renderId:o,['element','id'])]) && o.box && o.box[key]))
                    a[k++]=o;
            return a.length<=1?a:this._unique(a);
        },

        __gc:function(){
            var self=this, k=self.$key, cache=linb.$cache;
            //clear templates memory in linb.$cache
            _.breakO([cache.template[k], cache.reclaimId[k], self._cache, self._idCache, self.$DataModel, self.$Templates,  self.$Behaviors, self],2);
            delete linb.absBox.$type[k.replace("linb.UI.","")];
            delete linb.absBox.$type[k];
            _.filter(linb.$cache.UIKeyMapEvents,function(o,i){
                return !(i==k||i.indexOf(k+'-')==0);
            });
            // add for base class
            Class.__gc(k);
        },
        _pickSerialId:function(){
            //get id from cache or id
            var arr = linb.$cache.reclaimId[this.$key];
            if(arr && arr[0])return arr.pop();
            return this._ctrlId.next();
        },
        $bg:function(path, para, forceKey){
            return function(key){
                var p=linb.ini.path + 'appearance/default/'+ (typeof forceKey=='string'?forceKey:forceKey?'Public':(p=key.split('.'))[p.length-1]) + "/" + path;
                //_.asyRun(function(){new Image().src=p;});
                return 'url(' + p +') '+ (para||'');
            }
        },
        $ieBg:function(path,  forceKey){
            return function(key){
                var p=linb.ini.path + 'appearance/default/'+ (typeof forceKey=='string'?forceKey:forceKey?'Public':(p=key.split('.'))[p.length-1]) + "/" + path;
                //_.asyRun(function(){new Image().src=p;});
                return 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+p+'",sizingMethod="crop")';
            }
        },

       /* deep template function
          template: string
          properties: hash

          $doTemplate("{a}{b}{c}{a}{b}{/c}", {a:'*',b:'#',c:[{a:'1',b:'.'},{a:'2',b:'.'},{a:'3',b:'.'},{a:'4',b:'.'}]})
              will return "*#1.2.3.4."
          doTemplate("{a}{b}{c}{}{/c}", {a:'*',b:'#',c:['1','2','3','4']})
              will return "*#1234"

          flag: default flase => no clear not mactched symbols
        */
        $doTemplate:function(profile, template, properties, tag, result){
            var self=arguments.callee,
                s,t,n,
                x01=linb.UI.$x01,
                x01r=' \x01 ',
                str='',
                isA = properties.constructor == Array,
                temp = template[tag||''],
                r = !result,
                result= result || [];
            if(isA){
                if(typeof temp != 'function')temp = self;
                for(var i=0;t=properties[i++];)
                    temp(profile, template, t, tag, result);
            }else{
                if(t=properties.object){
                    //[properties] is for linb.Template
                    result[result.length]=t.toHtml();
                }else{
                    if(typeof temp == 'function')
                        temp(profile, template, properties, tag, result);
                    else{
                        tag = tag?tag+'.':'';
                        var a0=temp[0], a1=temp[1];
                        for(var i=0,l=a0.length;i<l;i++){
                            if(n=a1[i]){
                                if(n in properties){
                                    t=properties[n];
                                    //if sub template exists
                                    if(template[s=tag+n] && t)
                                        self(profile, template, t, s, result);
                                    else
                                        result[result.length]= (t===undefined || t===null || t===NaN)?str:typeof t=='string'?t.replace(x01,x01r):t;
                                }
                            }else
                                result[result.length]=(a0[i]===undefined || a0[i]===null || a0[i]===NaN)?str:a0[i];
                        }
                    }
                }
            }
            if(r)return result.join('');
        },
        /*
        set properties default map and set properties handler
        It's a merge function, not replace

        this.$DataStruct: {a:,b:,c}
        this.$DataModel: from hash, for example:
        hash:{
            key1:{
                ini:xx,
                set:fun..,
                get:fun..,
                action: fun
            },
            key2:null,
            key3:'abc,
        }
        */
        $buildTemplate:function(profile, template, key, obj, arr){
            if(template && String(template.tagName).toLowerCase()=='text'){
                arr[arr.length] = template.text;
                return;
            }
            var self =arguments.callee,
                behavior = profile.behavior?key?profile.behavior[key]:profile.behavior:null,
                map1 = self.map1 ||(self.map1={tagName:1,text:1}),
                map2 = self.map2 ||(self.map2={image:1,input:1,br:1,meta:1,hr:1,abbr:1,embed:1}),
                map3 = self.map3 ||(self.map3={input:1,textarea:1,pre:1,code:1}),
                r2=self.r2||(self.r2=/[a-z]/),
                r3=self.r3 || (self.r3=/^(on|before|after)/),
                r7=self.r7 || (self.r7=/([^{}]*)\{([\w]+)\}([^{}]*)/g),
                first=false,
                u=linb.UI,
                t, o , bak, lkey;

            if(!template)template=profile.template;
            lkey = key?profile.keys[key]:profile.key;

            //tagName
            if(!template.tagName)template.tagName="span";

            if(template.id!==null)
                //id
                template.id = key?lkey + ":" + u.$ID + ":" + u.$tag_left + u.$tag_subId + u.$tag_right:u.$DOMID;
            else
                delete template.id;

            if(template.className!==null){
                //className
                t = u.$CLS + (key?'-'+key.toLowerCase():'');
                //save bak
                bak = template.className || '';

                //default class first
                template['class'] =  t+' '+
                    //custom class here
                    bak+' '+
                    //add a special
                    (lkey==profile.key?'ui-ctrl ':'') +
                    //custom theme
                    u.$tag_special + (key||'KEY') + '_CT'+u.$tag_special + ' ' +
                    //custom class
                    u.$tag_special + (key||'KEY') + '_CC'+u.$tag_special
                    ;
            }
            delete template.className;

            template.style = (template.style||'')+';'+ u.$tag_special + (key||'KEY') + '_CS'+u.$tag_special;

            var a=[], b={},
                tagName=template.tagName.toLowerCase(),
                text= template.text,
                sc=linb.absObj.$specialChars;

            for(var i in template){
                if(!template[i])continue;
                if(!sc[i.charAt(0)] && !map1[i]){
                    o=template[i];
                    if(!r2.test(i)){
                        // collect sub node
                        if(typeof o == 'object'){
                            if(!o.$order)o.$order=0;
                            o.$key=i;
                            a[a.length]=o;
                        }
                    }else
                        b[i]=o;
                }
            }
            // sort sub node
            a.sort(function(x,y){
                x=x.$order;y=y.$order;
                return x>y?1:x==y?0:-1;
            });

            //first
            if(!arr){
                first=true;
                arr=[];
            }
            //<span id="" style="">
            arr[arr.length]='<'+tagName+' ';

            // add "unselectable" to node
            if(!b.unselectable && !map3[tagName])
                b.unselectable='on';

            for(var i in b)
                if(b[i])
                    arr[arr.length]=i+'="'+b[i]+'" ';

            //set className bak
            if(template.className!==null)
                template.className = bak;

            delete template['class'];

            arr[arr.length]=' {attributes}>';

            if(!map2[tagName] && text)
                arr[arr.length]=text;

            // add sub node
            for(var i=0,l=a.length;i<l;){
                o=a[i++];
                self(profile, o, o.$key, obj, arr)
            }
            if(!map2[tagName])
                arr[arr.length]='</'+tagName+'>';

            if(first){
                var a0=obj[0],a1=obj[1];
                arr.join('').replace(r7,function(a,b,c,d){
                    if(b)a0[a0.length]=b;
                    a1[a0.length]=a0[a0.length]=c;
                    if(d)a0[a0.length]=d;
                    return '';
                });
            }
        },
        _rpt:function(profile,temp){
            var me=arguments.callee,
                ui=linb.UI,
                tag=ui.$tag_special,
                r=me._r||(me._r=new RegExp( tag+'([0-9A-Z_]+)_C([SCT])'+tag + '|'+ tag+'([\\w_\\-\\.]*)'+tag, 'img')),
                h1={
                    id:profile.serialId,
                    cls:profile.getClass('KEY'),
                    domid:profile.$domId
                },
                h2={
                    S:profile.CS,
                    C:profile.CC,
                    T:profile._CT
                };
            return temp.replace(r, function(a,b,c,d){return h1[d] || (h2[c]?(h2[c][b]||""):'')}).replace(ui.$x01r,'\x01');
        },
        _build:function(profile, data){
            var template, t, m,
                u=linb.UI,
                temp=[[],[]],
                self=this,
                key=self.KEY,
                cache=linb.$cache.template,
                hash = profile._hash =
                    'b:' + (profile.template._subid||'') + ';' +
                    '!' + (profile._exhash||'');

            //build custom theme hash here
            if(typeof profile.theme == "string"){
                var h=profile._CT={},
                    pre=profile.key.replace(/\./g,'-').toLowerCase().replace('linb-ui','linb')+"-";
                _.each(profile.keys,function(o,i){
                    if(i.charAt(0)!='$')
                        h[i]=pre + profile.theme + "-" + i.toLowerCase();
                });
            }
            //get template
            if(!(template = _.get(cache,[key, hash]))){

                //get main template
                u.$buildTemplate(profile,null,null,temp);
                //split sub template from main template

                //set main template
                _.set(cache, [key, hash, ''], temp);
                //set sub template
                if(t=profile.template.$submap)
                    for(var i in t){
                        if(typeof (m=t[i])!='function'){
                            var temp=[[],[]];
                            for(var j in m)
                                if(typeof m[j] == 'object')
                                    u.$buildTemplate(profile, m[j], j, temp);
                            m=temp;
                        }
                        _.set(cache, [key,hash,i], m);
                    }

                template = _.get(cache,[key, hash]);
            }
            if(!template)return '';

            //replace main template
            return self._rpt(profile, u.$doTemplate(profile, template, data));
        },
        /*
        allow function input, for some css bug
        */
        _setDefaultBehavior:function(hash){
            var self=this,
                me=arguments.callee,
                map=me._m||(me._m={'':1,KEY:1,$key:1}),
                f=me._f1||(me._f1=function(arr, type, mode){
                    var fun = function(profile, e, src){
                        var t,
                            id=linb.use(src).id(),
                            item,
                            cid = profile.getSubId(id),
                            prop = profile.properties,nodes,funs,box;
                        if(prop.disabled || prop.readonly)return;
                        item = profile.SubSerialIdMapItem && profile.SubSerialIdMapItem[cid];
                        if(item && item.disabled)return;
                        if(item && item.readonly)return;
                        switch(typeof arr){
                            case 'string':
                                nodes=profile.getSubNode(arr,cid)._get();
                                break;
                            case 'function':
                                funs=[arr];
                                break;
                            case 'object':
                                nodes=[];funs=[];
                                for(var o,i=0,l=arr.length;i<l;i++){
                                    o=arr[i];
                                    if(typeof o=='string')
                                        nodes.push.apply(nodes,profile.getSubNode(o,cid)._get());
                                    else
                                        funs.push(o);
                                }
                        }

                        if(nodes&&nodes.length){
                            nodes=linb(nodes);
                            box=profile.boxing();
                            if(mode==1){
                                if(type=='mouseover'){
                                    if(prop.disableHoverEffect)
                                        return;
                                    if(profile.beforeHoverEffect && false === box.beforeHoverEffect(profile, item, e, src, 'mouseover'))
                                        return;
                                }
                                if(type=='mousedown'){
                                    if(prop.disableClickEffect)
                                        return;
                                    if(profile.beforeClickEffect && false === box.beforeClickEffect(profile, item, e, src, 'mousedown'))
                                        return;
                                }

                                //default action
                                nodes.tagClass('-'+type);
                            }else{
                                if(type=='mouseup'){
                                    if(prop.disableClickEffect)
                                        return;
                                    if(profile.beforeClickEffect && false === box.beforeClickEffect(profile, item, e, src, 'mouseup'))
                                        return;
                                    nodes.tagClass('-mousedown', false);
                                }else{
                                    if(prop.disableHoverEffect)
                                        return;
                                    if(profile.beforeHoverEffect && false === box.beforeHoverEffect(profile, item, e, src, 'mouseout'))
                                        return;
                                    nodes.tagClass('(-mouseover|-mousedown)', false);
                                }
                            }
                        }
                        if(funs&&funs.length){
                            _.arr.each(funs,function(o){
                                _.tryF(o,[profile],profile)
                            });
                            funs.length=0;
                        }
                   };
                    return fun;
                }),
                hls={},t;
            if(!linb.SC.get('linb.absComposed'))
                Class('linb.absComposed','linb.absObj',{
                    Instance:{
                        addPanel:function(para, children, item){
                            var pro = _.copy(linb.UI.Panel.$DataStruct);
                            _.merge(pro, para, 'with');
                            _.merge(pro,{
                                dock:'fill',
                                tag:para.tag||para.id
                            },'all');

                            var pb = new linb.UI.Panel(pro),arr=[];
                            this.append(pb, item&&item.id);
                            _.arr.each(children,function(o){
                                arr.push(o[0]);
                            });
                            pb.append(linb.UI.pack(arr,false));
                            return this;
                        },
                        removePanel:function(){
                            this.destroy();
                        },
                        getPanelPara:function(){
                            return _.copy(this.get(0).properties);
                        },
                        getPanelChildren:function(){
                            return this.get(0).children;
                        },
                        _e1:function(profile, item, e, src, type){},
                        _e2:function(profile, keyboard, e, src){},
                        _e3:function(profile, e, shiftKey, src){},
                        _e4:function(profile, e, src, dragKey, dragData, item){},
                        _e5:function(profile, e, src){}
                    },
                    Static:{
                        DataModel:{
                            dragKey:'',
                            dropKeys:''
                        },
                        $abstract:true
                    }
                });
            var src=linb.absComposed.prototype;

            if(hash.HoverEffected){
                _.each(hash.HoverEffected,function(o,i){
                    t=map[i]?hash:(hash[i]||(hash[i]={}));
                    if(!o)
                        t.afterMouseover = t.afterMouseout = null;
                    else{
                        t.afterMouseover = f(o,'mouseover', 1);
                        t.afterMouseout = f(o,'mouseout', 2);
                    }
                });
                hls.beforeHoverEffect=src._e1;
            }
            if(hash.ClickEffected){
                _.each(hash.ClickEffected,function(o,i){
                    t=map[i]?hash:(hash[i]||(hash[i]={}));
                    if(!o)
                        t.afterMousedown = t.afterMouseup = null;
                    else{
                        t.afterMousedown = f(o,'mousedown', 1);
                        t.afterMouseup = f(o,'mouseup', 2);
                    }
                });
                hls.beforeClickEffect=src._e1;
            }

            //for onHotKey
            _.merge(hash,{
                beforeKeydown:function(profile, e, src){
                    if(profile.onHotKeydown)
                        return false !== profile.boxing().onHotKeydown(profile,linb.Event.getKey(e),e, src);
                },
                beforeKeypress:function(profile, e, src){
                    if(profile.onHotKeypress)
                        return false !== profile.boxing().onHotKeypress(profile,linb.Event.getKey(e),e, src);
                },
                beforeKeyup: function(profile, e, src){
                    if(profile.onHotKeyup)
                        return false !== profile.boxing().onHotKeyup(profile,linb.Event.getKey(e),e, src);
                }
            });

            hls.onHotKeydown=hls.onHotKeypress=hls.onHotKeyup=src._e2;
            //for focus action
            if(hash.NavKeys){
                _.each(hash.NavKeys,function(o,i){
                    var map=arguments.callee, k, m1=map.m1||(map.m1={KEY:1,$key:1});
                    if(m1[i])return;
                    var m2=map.m2||(map.m2={input:1,textarea:1}),
                    m3=map.m3||(map.m3={tab:1,enter:1,up:1,down:1,left:1,right:1}),
                    m4=map.m4||(map.m4={tab:1,up:1,down:1,left:1,right:1}),
                    t=hash[i]||(hash[i]={});

                    var t=hash[i]||(hash[i]={});

                    if(null===o)
                        t.afterKeydown = null;
                    else{
                        t.afterKeydown = function(profile, e, src){
                            var k=linb.Event.getKey(e), key = k.key, ctrl=k.ctrlKey, shift=k.shiftKey, alt=k.altKey, b=false, smartnav=profile._smartnav;
                            if(smartnav){
                                var node=linb.use(src).get(0);
                                if(m2[k=node.tagName.toLowerCase()]){
                                    if(key && k=="input" && node.type.toLowerCase()!='text'&& node.type.toLowerCase()!='password'){
                                        b=true;
                                    }else if(m3[key]){
                                        var reg = linb.use(src).caret(),txt=linb.use(src).get(0).value;

                                        switch(key){
                                            case 'up':
                                                if(!/[\n\r]/.test(txt.substr(0,reg[0]))) b=true;
                                                break;
                                            case 'left':
                                                if((ctrl&&!shift) || (reg[0]===0 && (reg[1]!==txt.length || reg[1]===0))) b=true;
                                                break;
                                            case 'down':
                                                if(!/[\n\r]/.test(txt.substr(reg[1],txt.length))) b=true;
                                                break;
                                            case 'right':
                                                if((ctrl&&!shift) || (reg[1]===txt.length && (reg[0]!==0 || reg[1]===0))) b=true;
                                                break;
                                            case 'enter':
                                                if(k=='input' || alt)b=true;
                                                break;
                                            case "tab":
                                                b=true;
                                                break;
                                        }
                                    }
                                }else{
                                    if(m4[key])
                                        b=true;
                                }
                               node=null;
                            }else
                                b=key==='tab';

                            //hanlder focus
                            if(b){
                                //export event
                                if(profile.beforeNextFocus && false === profile.boxing().beforeNextFocus(profile,e,k.shiftKey,src))
                                    return false;

                                if(smartnav){
                                    if(key!='tab')
                                        linb.use(src).nextFocus(('up'==key || 'left'==key)?false:true);
                                }
                            }
                        }
                    }
                });
                hls.beforeNextFocus=src._e3;
            }
            if((t=hash.DroppableKeys) && t.length){
                _.arr.each(t,function(o){
                    self._droppable(o)
                });

                t=self.prototype;
                _.arr.each('addPanel,removePanel,getPanelPara,getPanelChildren,getDropKeys,setDropKeys'.split(','),function(o){
                    if(!t[o])t[o]=src[o];
                });
                self.$DataModel.dropKeys=self.$DataStruct.dropKeys='';
                hls.onDragEnter=hls.onDragLeave=hls.beforeDrop=hls.onDrop=hls.afterDrop=hls.onDropTest=hls.onDropMarkShow=hls.onDropMarkClear=src._e4;
            }
            if((t=hash.DraggableKeys)&& t.length){
                _.arr.each(t,function(o){
                    self._draggable(o)
                });
                t=self.prototype;
                _.arr.each('getDragKey,setDragKey'.split(','),function(o){
                    if(!t[o])t[o]=src[o];
                });
                self.$DataModel.dragKey=self.$DataStruct.dragKey='';
                hls.onGetDragData=hls.onStartDrag=hls.onDragStop=src._e5;
            }
            if((t=hash.NoDraggableKeys)&& t.length){
                self.NoDraggableKeys=t;
            }
            if((t=hash.NoDroppableKeys) && t.length){
                self.NoDroppableKeys=t;
            }

            self.setEventHandlers(hls);
        },

        addTemplateKeys:function(arr){
            var self=this, key=self.KEY, me=arguments.callee, reg=me._reg||(me._reg=/\./g);
            _.arr.each(arr,function(i){
                self.$cssKeys[i]=(self.$Keys[i]=i=='KEY'?key:key+"-"+i).replace(reg,'-').toLowerCase().replace('linb-ui','linb');
            });
            return self;
        },
        $CSSCACHE:{},
        $getCSSValue:function(cls, key){
            var cache=this.$CSSCACHE,
                ck=cls+'->'+key,
                me=arguments.callee;
            if(ck in cache)return cache[ck];
            var c=linb.Dom.getEmptyDiv().get(0),r;
            c.className=cls;
            r=cache[ck]=parseInt(linb.Dom.getStyle(c,key))||0;
            c.className="";
            return r;
        },
        getTheme:function(){
            return this.$theme;
        },
        setTheme:function(key, refresh){
            key=key||'default';
            var ns=this;
            if(key!=ns.$theme){
                if(refresh!==false){
                    if(key!='default')
                        linb.CSS.includeLink(linb.getPath('linb.appearance.'+key,'/theme.css'),'theme:'+key);
                    var o=linb.CSS.get('id','theme:'+ns.$theme);
                    if(o){
                        o.disabled=true;
                        linb(o).remove(false);
                    }
                }
                ns.$theme=key;
                if(refresh!==false){
                    ns.$CSSCACHE={};
                    var count=0;
                    _.asyRun(function(){
                        if(count>10)
                            throw new Error('errLoadTheme:'+key);
                        count++;
                        var s;
                        try{
                            s=linb.CSS.$getCSSValue('.setting-uikey','fontFamily');
                        }catch(e){}finally{
                            if(s==key || key=='default'){
                                linb.UI.getAll().reLayout(true);
                                count=null;
                            }else
                                _.asyRun(arguments.callee,200*count);
                        }
                    },200);
                }
            }
            return this;
        },
        setAppearance:function(hash){
            _.merge(this.$Appearances,hash,'all');
            return this;
        },
        getAppearance:function(){
            return this.$Appearances;
        },
        /*replace mode*/
        setTemplate:function(hash, cacheId){
            if(hash){
                var self=this,
                    me=arguments.callee,
                    r2=me.r2||(me.r2=/[a-z]/),
                    sc=linb.absObj.$specialChars,
                    _ks=['KEY'],
                    fun = me._fun || (me._fun=function(hash, arr){
                        var o,i;
                        for(i in hash){
                            if(!sc[i.charAt(0)])
                                if(!r2.test(i)){
                                    arr[arr.length]=i;
                                    o=hash[i];
                                    if(typeof o == 'object')
                                        arguments.callee(o, arr)
                                }
                        };
                    })
                    ,t;
                fun(hash,_ks);
                self.addTemplateKeys(_ks);

                t = self.$Templates;

                // for sub template,
                if(typeof cacheId=='string'){
                    hash._subid = cacheId;
                    t[cacheId]=hash;
                }else
                    t._=hash;

                //set sub
                if(t=hash.$submap)
                    for(var i in t)
                        for(var j in t[i])
                            me.call(self, t[i], j);
            }
            return this;
        },
        getTemplate:function(cacheId){
            return this.$Templates[cacheId||'_'];
        },
        /*replace mode*/
        setBehavior:function(hash){
            if(hash){
                var self=this,
                    ch=linb.$cache.UIKeyMapEvents,
                    skey=self.$key,
                    check=linb.absObj.$specialChars,
                    handler = linb.Event.$eventhandler,
                    eventType=linb.Event._eventMap,
                    me=arguments.callee,
                    r1=me.r1||(me.r1=/[a-z]/),
                    r2=me.r2||(me.r2=/^(on|before|after)/),
                    t= self.$Behaviors,
                    m,i,j,k,o,v, type;
                //set shortcut first
                self._setDefaultBehavior(hash);
                //merge KEY
                if(hash.KEY){
                    _.merge(hash, hash.KEY, 'all');
                    delete hash.KEY;
                }

                //merge hash
                for(i in hash){
                    o=hash[i];
                    if(!check[i.charAt(0)]){
                        //only two layer
                        if(!r1.test(i)){
                            m=t[i]||(t[i]={});
                            for(j in o){
                                v=o[j];
                                if(!check[j.charAt(0)]){
                                    /*set to behavior*/
                                    if(v)
                                        m[j]=v;
                                    else
                                        delete m[j];
                                }
                            }
                        }else if(r2.test(i)){
                            /*set to behavior*/
                            if(o)
                                t[i]=o;
                            else
                                delete t[i];
                        //for those special keys
                        }else
                            t[i]=o;
                    }
                }

                //remove all handler cache
                _.filter(ch,function(o,i){
                    return !(i==skey||i.indexOf(skey+'-')==0);
                });
                //add handler cache
                for(i in t){
                    o=t[i];
                    if(!check[i.charAt(0)]){
                        //only two layer
                        if(!r1.test(i)){
                            for(j in o){
                                if(!check[j.charAt(0)] && o[j]){
                                    k=skey+'-'+i;
                                    (ch[k]||(ch[k]={}))['on'+eventType[j]]=handler;
                                }
                            }
                        }else if(r2.test(i) && o){
                            k=skey;
                            (ch[k]||(ch[k]={}))['on'+eventType[i]]=handler;
                        }
                    }
                }
            }

            return self;
        },
        getBehavior:function(){
            return this.$Behaviors;
        },
        $applyCSS:function( ){
            var self=linb.UI, cache1=self.$cache_css, cache2=self.$cache_css2;
            if(!self.$cssNo){
                self.$cssNo=1;
                var b=linb.browser;
                linb('body').addClass(
                          (b.ie ? ("linbcss-ie linbcss-ie" + b.ver + " ") :
                           b.gek ? ("linbcss-gek linbcss-gek" + b.ver + " ") :
                           b.kde ? ("linbcss-kde linbcss-kde" + b.ver + " ") :
                           b.opr ? ("linbcss-opr linbcss-opr" + b.ver + " ") : "")
                        + (b.isSafari ? "linbcss-safari ": b.isChrome ? "linbcss-chrome " :"")
                        + (b.isMac ? "linbcss-mac": b.isLinux ? "linbcss-linux " :"")
                );
                linb('html').addClass(b.isStrict?"linbcss-base linbcss-strict":"linbcss-base ");
            }
            if(cache1){
                linb.CSS.addStyleSheet(cache1, 'linb.UI-CSS'+(self.$cssNo++));
                linb.UI.$cache_css='';
            }
            if(cache2){
                linb.CSS.addStyleSheet(cache2, 'linb.UI-CSS'+(self.$cssNo++),true);
                linb.UI.$cache_css2='';
            }
        },
        buildCSSText:function(hash){
            var self=this,
                me=arguments.callee,
                r1=me._r1||(me._r1=/(^|\s|,)([0-9A-Z_]+)/g),
                h=[], r=[],
                browser=linb.browser,
                ie6=browser.ie6,
                ie=browser.ie,
                gek=browser.gek,
                ks=self.$cssKeys,
                t,v,o;

            for(var i in hash){
                o=hash[i];
                t=i.replace(r1,function(a,b,c){return  b + '.' + (ks[c]||c)}).toLowerCase();
                o.$order=parseInt(o.$order)||0;
                o.$=t;
                h[h.length]=o;
            };
            h.sort(function(x,y){
                x=x.$order;y=y.$order;
                return x>y?1:x==y?0:-1;
            });

            for(var i=0,l=h.length;i<l;){
                o=h[i++];
                r[r.length]=o.$+"{";
                if(t=o.$before)r[r.length]=t;
                if(t=o.$text)r[r.length]=t;
                for(var j in o){
                    switch(j.charAt(0)){
                        case '$':continue;break;
                        case '_':if(!ie6)continue;break;
                        case '*':if(!ie)continue;break;
                        case '-':if(!gek)continue;break;
                    }
                    //neglect '' or null
                    if((v=o[j])||o[j]===0){
                        //put string dir
                        switch(typeof v){
                        case 'string':
                        case 'number':
                            r[r.length]=j+":"+v+";";break;
                        case 'function':
                            r[r.length]=j+":"+v(self.KEY)+";";break;
                        //arrray
                        default:
                            _.arr.each(v,function(k){
                                //neglect '' or null
                                if(k)r[r.length]=j+":"+k+";";
                            });
                        }
                    }
                }
                if(v=o.$after)r[r.length]=v;
                r[r.length]="}";
            }
            return r.join('');
        },
        _droppable:function(key){
            var self=this,
                h2=linb.Event.$eventhandler2,
                o=self.$Behaviors,
                v=key=='KEY'?o:(o[key]||(o[key]={})),
                handler=linb.$cache.UIKeyMapEvents,
                k2=key=='KEY'?self.KEY:(self.KEY+'-'+key),
                ch=handler[k2]||(handler[k2]={});

            //attach Behaviors
            _.merge(v, {
                beforeMouseover:function(profile, e, src){
                    if(profile.properties.disabled||profile.properties.readonly)return;

                    // avoid no droppable keys
                    if(profile.box.NoDroppableKeys){
                        var sk = profile.getKey(linb.Event.getSrc(e).id || "").split('-')[1];
                        if(sk && _.arr.indexOf(profile.box.NoDroppableKeys, sk)!=-1)return;
                    }

                    var ns=src,
                        dd = linb.DragDrop,
                        pp = dd.getProfile(),
                        key = pp.dragKey,
                        data = pp.dragData,
                        item,box,t,args
                        ;

                    //not include the dragkey
                    if(!key
                    || !data
                    || !(new RegExp('\\b'+key+'\\b')).test(profile.box.getDropKeys(profile, ns))
                    )return;

                    box=profile.boxing();
                    if(box.getItemByDom)
                        item=box.getItemByDom(src);

                    args=[profile, e, ns, key, data, item];
                    if((t=profile.onDropTest) && (false===box.onDropTest.apply(box,args)))
                        return;
                    if((t=profile.box._onDropTest) && (false===t.apply(profile.host||profile, args)))
                        return;
                    //for trigger onDrop
                    dd.setDropElement(src);
                    if(profile.onDropMarkShow && (false===box.onDropMarkShow.apply(box,args))){}
                    else if((t=profile.box._onDropMarkShow) && (false===t.apply(profile.host||profile, args))){}
                    else
                        //show region
                        _.resetRun('setDropFace', dd.setDropFace, 0, [ns], dd);

                    if(t=profile.box._onDragEnter)t.apply(profile.host||profile, args);
                    if(profile.onDragEnter)box.onDragEnter.apply(box,args);
                    //dont return false, multi layer dd wont work well
                    //return false;
                },
                beforeMouseout:function(profile, e, src){
                    if(profile.properties.disabled||profile.properties.readonly)return;
                    var dd = linb.DragDrop,
                        pp = dd.getProfile(),
                        key = pp.dragKey,
                        data = pp.dragData,
                        item, box, args;

                    //not include the dragkey
                    if(pp.dropElement==src){
                        box=profile.boxing();
                        if(box.getItemByDom)
                            item=box.getItemByDom(src);

                        args=[profile, e, src, key, data, item];
                        if(profile.onDropMarkClear && (false===box.onDropMarkClear.apply(box,args))){}
                        else if((t=profile.box._onDropMarkClear) && (false===t.apply(profile.host||profile, args))){}
                        else _.resetRun('setDropFace', dd.setDropFace, 0, [null], linb.DragDrop);

                        if(t=profile.box._onDragLeave)t.apply(profile.host||profile, args);
                        if(profile.onDragLeave)box.onDragLeave.apply(box,args);
                        dd.setDropElement(null);
                    }
                    //return false;
                },
                beforeDrop:function(profile, e, src){
                    var dd = linb.DragDrop,
                        pp = dd.getProfile(),
                        key = pp.dragKey,
                        data = pp.dragData,
                        item,t,args,
                        box=profile.boxing();
                    if(box.getItemByDom)
                        item=box.getItemByDom(src);
                    args=[profile, e, src, key, data, item];

                    if(profile.onDropMarkClear && (false===box.onDropMarkClear.apply(box,args))){}
                    else if((t=profile.box._onDropMarkClear) && (false===t.apply(profile.host||profile, args))){}

                    if(profile.beforeDrop && (false===box.beforeDrop.apply(box,args)))
                        return;

                    if(profile.onDrop && (false===box.onDrop.apply(box,args))){
                        // dont call inner _onDrop
                    }else if(profile.box._onDrop)
                        profile.box._onDrop.apply(profile.host||profile, args);

                    if(profile.afterDrop)
                        box.afterDrop.apply(box,args);
                }
            }, 'all');
            _.merge(ch,{
                onmouseover:h2,
                onmouseout:h2,
                ondrop:h2,
                afterDrop:h2,
                beforeDrop:h2
            });
            return self;
        },
        _draggable:function(key){
            var self=this,
                h2=linb.Event.$eventhandler2,
                o=self.$Behaviors,
                v=key=='KEY'?o:(o[key]||(o[key]={})),
                handler=linb.$cache.UIKeyMapEvents,
                k2=key=='KEY'?self.KEY:(self.KEY+'-'+key),
                ch=handler[k2]||(handler[k2]={});
            //attach Behaviors
            _.merge(v, {
                beforeMousedown:function(profile, e, src){
                    if(linb.Event.getBtn(e)!="left")return;
                    if(profile.properties.disabled)return;
                    // not resizable or drag
                    if(!profile.properties.dragKey)return;

                    // avoid nodraggable keys
                    if(profile.box.NoDraggableKeys){
                        var sk = profile.getKey(linb.Event.getSrc(e).id || "").split('-')[1];
                        if(sk && _.arr.indexOf(profile.box.NoDraggableKeys, sk)!=-1)return;
                    }


                    var pos=linb.Event.getPos(e),box=profile.boxing(),args=[profile,e,src],t;
                    if(profile.onStartDrag && (false===box.onStartDrag.apply(box,args))){}
                    else if((t=profile.box._onStartDrag) && (false===t.apply(profile.host||profile, args))){}
                    else{
                        var con=profile.box;
                        linb.use(src).startDrag(e, {
                            dragType:'icon',
                            targetLeft:pos.left+12,
                            targetTop:pos.top+12,
                            dragCursor:'pointer',
                            dragDefer:1,
                            dragKey: con.getDragKey(profile, src),
                            dragData: con.getDragData(profile, e, src)
                        });
                    }
                },
                beforeDragbegin:function(profile, e, src){
                    linb.use(src).onMouseout(true,{$force:true}).onMouseup(true);
                },
                beforeDragstop:function(profile, e, src){
                    var t;
                    if(profile.onDragStop)profile.boxing().onDragStop(profile.e,src);
                    if(t=profile.box._onDragStop)t.apply(profile.host||profile, arguments);
                }
            }, 'all');
            _.merge(ch,{
                onmousedown:h2,
                ondragbegin:h2
            });

            return self;
        },
        /*copy item to hash, use 'without'
        exception: key start with $
        value(start with $) get a change to get value from lang setting
        */
        adjustData:function(profile, hashIn, hashOut){
            if(!hashOut)hashOut={};

            var dm = profile.box.$DataModel,
                prop=profile.properties;

            var i,o;
            for(i in hashIn){
                if(i.charAt(0)=='$')continue;
                if(hashIn.hasOwnProperty(i) &&  !hashOut.hasOwnProperty(i))
                    hashOut[i] = typeof (o=hashIn[i])=='string' ? linb.adjustRes(o,true) : o;
            }


            if('disabled' in dm)
                hashOut.disabled= ((_.isSet(hashOut.disabled) && hashOut.disabled) || (_.isSet(prop.disabled) && prop.disabled)) ?'ui-itemdisabled':'';
            if('readonly' in dm)
                hashOut.readonly= ((_.isSet(hashOut.readonly) && hashOut.readonly) || (_.isSet(prop.readonly) && prop.readonly)) ?'ui-itemreadonly':'';

            //todo:remove the extra para
            hashOut.imageDisplay = (hashOut.imageClass||hashOut.image)?'':'display:none';
            if(hashOut.image)
                hashOut.backgroundImage="background-image:url("+ hashOut.image +");";
            if(hashOut.imagePos)
                hashOut.backgroundPosition='background-position:'+hashOut.imagePos+';';
            else if(hashOut.image)
                hashOut.backgroundPosition='background-position:center;';

            if(hashOut.imageRepeat)
                hashOut.backgroundRepeat='background-repeat:'+hashOut.imageRepeat+';';
            else if(hashOut.image)
                hashOut.backgroundRepeat='background-repeat:no-repeat;';
            //must be here
            //Avoid Empty Image src
            if(!hashOut.image)hashOut.image=linb.ini.img_bg;
            
            if((typeof (o=hashOut.renderer)=='function') || (typeof (o=hashIn.renderer)=='function'))
                hashOut.caption=o.call(profile,hashIn,hashOut);

            return hashOut;
        },

        cacheData:function(key, obj){
            _.set(linb.$cache,['UIDATA', key], obj);
            return this;
        },
        getCachedData:function(key){
            var r = _.get(linb.$cache,['UIDATA', key]);
            if(typeof r == 'function')r=r();
            return _.clone(r);
        },

        Behaviors:{
            onContextmenu:function(profile, e, src){
                if(profile.onContextmenu)
                    return profile.boxing().onContextmenu(profile, e, src)!==false;
            }
        },
        DataModel:{
            tag:'',
            tagVar:{
                ini:{}
            },
            "className":{
                ini:"",
                action:function(v,ov){
                    if(ov)
                        this.getRoot().removeClass(ov);
                    this.getRoot().addClass(v);
                }
            },
            disableClickEffect:false,
            disableHoverEffect:false,
            disableTips:false,
            disabled:{
                ini:false,
                action: function(v){
                    var i=this.getRoot();
                    if(v)
                        i.addClass('ui-disabled');
                    else
                        i.removeClass('ui-disabled');
                }
            },
            dock:{
                ini:'none',
                listbox:['none','top','bottom','left','right','center','middle','origin','width','height','fill','cover'],
                action:function(v){
                    linb.UI.$dock(this,true,true);
                }
            },
            dockIgnore:{
                ini:false,
                action:function(v){
                    var self=this;
                    if(self.properties.dock!='none')
                        linb.UI.$dock(self,true,true);
                }
            },
            dockOrder:{
                ini: 1,
                action:function(v){
                    var self=this;
                    if(self.properties.dock!='none')
                        linb.UI.$dock(self,true,true);
                }
            },
            dockMargin:{
                ini:{left:0,top:0,right:0,bottom:0},
                action:function(v){
                    var self=this;
                    if(self.properties.dock!='none')
                        linb.UI.$dock(self,true,true);
                }
            },
            dockFloat:{
                ini:false,
                action:function(v){
                    var self=this;
                    if(self.properties.dock!='none')
                        linb.UI.$dock(self,true,true);
                }
            },
            dockMinW:0,
            dockMinH:0,
            tips:''
        },
        EventHandlers:{
            onRender:function(profile){},
            onLayout:function(profile){},
            onResize:function(profile,width,height){},
            onMove:function(profile,left,top,right,bottom){},
            onDock:function(profile,region){},
            beforePropertyChanged:function(profile,name,value,ovalue){},
            afterPropertyChanged:function(profile,name,value,ovalue){},
            beforeAppend:function(profile,child){},
            afterAppend:function(profile,child){},
            beforeRemove:function(profile,child,subId,bdestroy){},
            afterRemove:function(profile,child,subId,bdestroy){},
            onDestroy:function(profile){},
            beforeDestroy:function(profile){},
            onShowTips:function(profile, node, pos){},
            onContextmenu:function(profile, e, node, item){}
        },
        RenderTrigger:function(){
            var self=this, b=self.boxing(),p=self.properties;
            //avoid the resize blazzing
            if(self.box._onresize){
                var style=self.getRootNode().style,t
                if((t=style.visibility)!='hidden'){
                   self._$visibility=t;
                   style.visibility='hidden';
                }
                linb.UI.$tryResize(self,p.width,p.height);
                style=null;
            }
            if(p.disabled)
                b.setDisabled(true,true);

            self._inValid=1;
        },
        $doResize:function(profile,w,h,force,key){
            if(force || ((w||h) && (profile._resize_w!=w || profile._resize_h!=h))){
                //destroyed before resize
                if(!profile.getRootNode())return false;

                profile._resize_w=w;
                profile._resize_h=h;
                _.tryF(profile.box._onresize,[profile,w,h,force,key],profile.box);

                // for have _onresize widget only
                if(profile.onResize)
                    profile.boxing().onResize(profile,w,h);
            }

            //some control will set visible to recover the css class
            if('_$visibility' in profile){
                var node=profile.getRootNode(),
                    style=node.style;
                if(style.visibility!='visible' && !linb.getNodeData(node,'_setVisibility'))
                    style.visibility=profile._$visibility;
                node=style=null;
                clearTimeout(profile._$rs_timer);
                delete profile._$rs_timer;
                delete profile._$rs_args;
                delete profile._$visibility;
            }
        },
        $tryResize:function(profile,w,h,force,key){
            var s=profile.box,t=s._onresize;
            if(t&&(force||w||h)){
                //adjust width and height
                w=parseInt(w)||null;
                h=((h===""||h=='auto')?"auto":parseInt(h))||null;

                //if it it has delay resize, overwrite arguments
                if('_$visibility' in profile){
                    var args=profile._$rs_args;
                    // asyrun once only
                    if(!args){
                        args=profile._$rs_args=[profile,null,null];
                        profile._$rs_timer=_.asyRun(function(){
                            if(profile && profile._$rs_args)
                                linb.UI.$doResize.apply(null,profile._$rs_args);
                        });
                    }
                    //keep the last one, neglect zero and 'auto'
                    args[1]=w;
                    args[2]=h;
                    args[3]=force;
                    args[4]=key;
                //else, call resize right now
                }else{
//for performance checking
//console.log('resize',profile.$linbid,w,h,force,key);
                    linb.UI.$doResize(profile,w,h,force,key);
                }
            }
        },
        LayoutTrigger:function(){
            var self=this, b=self.boxing(),p=self.properties;
            if(p.dock && p.dock != 'none'){
                //first time, ensure _onresize to be executed.
                if(!self.$laidout){
                    self.$laidout=1;
                    var stl=self.getRootNode().style;
                    switch(p.dock){
                        case 'top':
                        case 'bottom':
                        case 'width':
                            stl.width=0;
                            break;
                        case 'left':
                        case 'right':
                        case 'height':
                            stl.height=0;
                            break;
                        default:
                            stl.width=stl.height=0;
                    }
                }
                linb.UI.$dock(this,false,true);
            }
        },
        $dock_args:['top','bottom','left','right','center','middle','width','height'],
        $dock_map:{middle:1,center:1},
        $dock:function(profile, force, trigger){
            var node = profile.getRoot(),
                p=linb((node.get(0) && node.get(0).parentNode)||profile.$dockParent);
            if(!p.get(0))
                return;
            var prop = profile.properties,
                margin=prop.dockMargin,
                auto = 'auto',
                value = prop.dock || 'none',
                pid=linb.Event.getId(p.get(0)),
                order=function(x,y){
                    x=parseInt(x.properties.dockOrder)||0;y=parseInt(y.properties.dockOrder)||0;
                    return x>y?1:x==y?0:-1;
                },
                region,
                inMatrix='$inMatrix',
                f,t,isWin,
                //for ie6 1px bug
                _adjust=function(v){return linb.browser.ie6?v-v%2:v}


            if(p.get(0)===document.body || p.get(0)===document || p.get(0)===window){
                pid='!document';
                isWin=true;
            }

            //attached to matrix
            if(pid && (pid==linb.Dom._ghostDivId || _.str.startWith(pid,linb.Dom._emptyDivId)))
                return;

            if(profile.$dockParent!=pid || profile.$dockType != value || force){
                profile.$dockParent=pid;
                profile.$dockType = value;

                //unlink first
                profile.unLink('$dockall');
                profile.unLink('$dock');
                profile.unLink('$dock1');
                profile.unLink('$dock2');

                //set the fix value first
                switch(value){
                    case 'middle':
                        region={right:auto, bottom:auto,left:prop.left||'',width:prop.width||'',height:prop.height||''};
                        break;
                    case 'center':
                        region={right:auto, bottom:auto,top:prop.top||'',width:prop.width||'',height:prop.height||''};
                        break;
                    case 'origin':
                        region={right:auto, bottom:auto,width:prop.width||'',height:prop.height||''};
                        break;
                    case 'top':
                        region={left:margin.left, right:margin.right, bottom:auto, height:prop.height||''};
                        //width top
                        break;
                    case 'bottom':
                        region={left:margin.left, right:margin.right, top:auto, height:prop.height||''};
                        //width bottom
                        break;
                    case 'left':
                        region={right:auto,width:prop.width||''};
                        //height top left
                        break;
                    case 'right':
                        region={left:auto,width:prop.width||''};
                        //height top right
                        break;
                    case 'width':
                        region={bottom:auto,height:prop.height||'',top:prop.top||''};
                        //width left
                        break;
                    case 'height':
                        region={right:auto,width:prop.width||'',left:prop.left||''};
                        //height top
                        break;
                    case 'fill':
                    case 'cover':
                        region={right:auto,bottom:auto};
                        break;
                    case 'none':
                        region={left:prop.left, top:prop.top, width:prop.width||'',height:prop.height||''};
                        break;
                }
                if(node.get(0))
                    node.cssRegion(region,true);
                //if in body, set to window
                if(isWin){
                    p=linb.win;
                    if(!linb.$cache._resizeTime)linb.$cache._resizeTime=1;
                }
                //set dynamic part
                if(value != 'none'){
                    f = p.$getEvent('onSize','dock');
                    if(!f){
                        f=function(arg){
                            //get self vars
                            var me=arguments.callee,
                                map=linb.UI.$dock_map,
                                arr=linb.UI.$dock_args,
                                rePos=me.rePos,
                                // the dock parent is window
                                win= me.pid=="!window" || me.pid=="!document",
                                node=win?linb.win:linb(me.pid);

                             if(!node.get(0))
                                return;

                             var style=node.get(0).style,
                                obj,i,k,o,key,target;

                            //window resize: check time span, for window resize in firefox
                            //force call when input $dockid
                            //any node resize
                            if( arg.$dockid || !win || (_() - linb.$cache._resizeTime > 100)){
                                //recruit call, give a short change
                                obj = {left:0,top:0,right:0,bottom:0,width:parseInt(style&&style.width)||node.width(),height:parseInt(style&&style.height)||node.height()};

                                for(k=0;key=arr[k++];){
                                    target = me[key];
                                    if(target.length){
                                        if(!map[key])arg.width=arg.height=1;
                                        for(i=0;o=target[i++];)
                                            if(!o.properties.dockIgnore)
                                                rePos(o, obj, key, arg.$dockid, win||arg.width, win||arg.height);

                                    }
                                }
                                
                                if(obj.later){
                                    _.each(obj.later, function(o){
                                        var profile;
                                        //for safari
                                        try{
                                            o.node.cssRegion(o, true);
                                            if(profile=linb.UIProfile.getFromDom(o.node.get(0))){
                                                delete o.node;
                                                // for no _onresize widget only
                                                if(!profile.box._onresize && profile.onResize && (o.width!==null||o.height!==null))
                                                    profile.boxing().onResize(profile,o.width,o.height);
                                                if(profile.onDock)profile.boxing().onDock(profile,o);
                                                if(profile.$onDock)profile.$onDock(profile,o);
                                            }
                                        }catch(e){
                                            _.asyRun(function(){
                                                o.width+=1;o.height+=1;
                                                o.node.cssRegion(o);
                                                o.width-=1;o.height-=1;
                                                o.node.cssRegion(o, true);

                                                if(profile=linb.UIProfile.getFromDom(o.node.get(0))){
                                                    delete o.node;
                                                    // for no _onresize widget only
                                                    if(!profile.box._onresize && profile.onResize && (o.width!==null||o.height!==null))
                                                        profile.boxing().onResize(profile,o.width,o.height);
                                                    if(profile.onDock)profile.boxing().onDock(profile,o);
                                                    if(profile.$onDock)profile.$onDock(profile,o);
                                                }
                                            })
                                        }
                                    });
                                }
                                // for those are not in obj.later
                                for(k=0;key=arr[k++];){
                                    target = me[key];
                                    if(target.length){
                                        for(i=0;o=target[i++];){
                                            if(!o.properties.dockIgnore){
                                                if(!obj.later || !obj.later[o.$linbid]){
                                                    if(o.onDock)o.boxing().onDock(o);
                                                    if(o.$onDock)o.$onDock(o);
                                                }
                                            }
                                        }
                                    }
                                }

                                //if window resize, keep the timestamp
                                if(win)
                                    linb.$cache._resizeTime = _();
                            }
                            me=node=style=null;
                        };
                        f.pid=pid;
                        _.arr.each(linb.UI.$dock_args,function(key){
                            f[key]=[];
                        });
                        f.dockall=[];
                        f.rePos=function(profile, obj, value, id, w, h){
                            //if $dockid input, and not the specific node, return
                            var flag=false;
                            if(id && profile.$linbid!=id)flag=true;
                            var prop = profile.properties,
                                flt=prop.dockFloat,
                                margin = prop.dockMargin,
                                node = profile.getRoot(),
                                style = profile.getRootNode().style,
                                left, top, right, bottom,temp, other,
                                x = parseInt(prop._dockBorderWidth) || 0,
                                y = parseInt(prop._dockBorderHeight) || 0,
                                region={}
                                ;
                            if(style.display=='none')
                                return;
                            //top/bottom/left/right must be set by order first
                            switch(value){
                                case 'middle':
                                    //use height() is ok
                                    node.top((obj.height - node.height())/2);
                                    break;
                                case 'center':
                                    node.left((obj.width - node.width())/2);
                                    break;
                                case 'top':
                                    if(!flag){
                                        left=margin.left;
                                        right=margin.right;
                                        top=(flt?0:obj.top)+margin.top;
                                        if(parseFloat(style.top)!=top)region.top=top;
                                        temp=obj.width - left - right - x;
                                        temp=_adjust(prop.dockMinW?Math.max(prop.dockMinW,temp):temp);
                                        if(parseFloat(style.width)!=temp)region.width=_adjust(temp);
                                        if(!_.isEmpty(region)){
                                            node.cssRegion(region,true);
                                        }
                                    }

                                    if(!flt)
                                        obj.top += (node.offsetHeight() + margin.top + margin.bottom);
                                    break;
                                case 'bottom':
                                    if(!flag){
                                        left=margin.left;
                                        right=margin.right;
                                        bottom=(flt?0:obj.bottom)+margin.bottom;
                                        if(parseFloat(style.bottom)!=bottom)region.bottom=bottom;
                                        temp=obj.width - left - right - x;
                                        temp=_adjust(prop.dockMinW?Math.max(prop.dockMinW,temp):temp);
                                        if(parseFloat(style.width)!=temp)region.width=_adjust(temp);
                                        if(!_.isEmpty(region))node.cssRegion(region,true);
                                    }
                                    if(!flt)
                                        obj.bottom += (node.offsetHeight() + margin.top + margin.bottom);
                                    break;
                                case 'left':
                                    if(!flag){
                                        left=(flt?0:obj.left)+margin.left;
                                        top=(flt?0:obj.top)+margin.top;
                                        bottom=(flt?0:obj.bottom)+margin.bottom;
                                        if(parseFloat(style.left)!=left)region.left=left;
                                        if(parseFloat(style.top)!=top)region.top=top;
                                        temp=obj.height - top - bottom - y;
                                        temp=_adjust(prop.dockMinH?Math.max(prop.dockMinH,temp):temp);
                                        if(parseFloat(style.height)!=temp)region.height=_adjust(temp);
                                        if(!_.isEmpty(region))node.cssRegion(region,true);
                                    }
                                    if(!flt)
                                        obj.left += (node.offsetWidth() + margin.left + margin.right);
                                    break;
                                case 'right':
                                    //if no top/bottom and change w only
                                    if(!flag){
                                        right=(flt?0:obj.right)+margin.right;
                                        top=(flt?0:obj.top)+margin.top;
                                        bottom=(flt?0:obj.bottom)+margin.bottom;
                                        if(parseFloat(style.right)!=right)region.right=right;
                                        if(parseFloat(style.top)!=top)region.top=top;
                                        temp=obj.height - top - bottom - y;
                                        temp=_adjust(prop.dockMinH?Math.max(prop.dockMinH,temp):temp);
                                        if(parseFloat(style.height)!=temp)region.height=_adjust(temp);
                                        if(!_.isEmpty(region))node.cssRegion(region,true);
                                    }
                                    if(!flt)
                                        obj.right += (node.offsetWidth() + margin.left + margin.right);
                                    break;
                                case 'width':
                                    //if no top/bottom/left/right and change h only
                                    if(!w)return;
                                    left = (prop.dock=='cover'?0:(flt?0:obj.left)) + margin.left;
                                    right = (prop.dock=='cover'?0:(flt?0:obj.right))  + margin.right;
                                    top = prop.dock=='width'?(parseInt(prop.top) || 0):( (prop.dock=='cover'?0:(flt?0:obj.top)) + margin.top);
                                    //later call for w/h change once
                                    temp=obj.width - left - right - x;
                                    obj.later=obj.later||{};
                                    obj.later[profile.$linbid] = obj.later[profile.$linbid] || {};
                                    _.merge(obj.later[profile.$linbid],{
                                        node:node,
                                        width: _adjust(prop.dockMinW?Math.max(prop.dockMinW,temp):temp),
                                        left:left,
                                        top:top
                                    },'all');
                                    break;
                                case 'height':
                                    //if no top/bottom/left/right and change w only
                                    if(!h)return;
                                    top = (prop.dock=='cover'?0:(flt?0:obj.top)) + margin.top;
                                    bottom = (prop.dock=='cover'?0:(flt?0:obj.bottom))  + margin.bottom;
                                    left = prop.dock=='height'?(parseInt(prop.left) || 0):((prop.dock=='cover'?0:(flt?0:obj.left))+ margin.left);
                                    //later call for w/h change once
                                    temp=obj.height - top - bottom - y;
                                    obj.later=obj.later||{};
                                    obj.later[profile.$linbid] = obj.later[profile.$linbid] || {};
                                    _.merge(obj.later[profile.$linbid],{
                                        node:node,
                                        height: _adjust(prop.dockMinH?Math.max(prop.dockMinH,temp):temp),
                                        left:left,
                                        top:top
                                    },'all');

                                    break;
                            }
                        };

                        //add handler to window or node
                        p.onSize(f,'dock');
                    }
                    //set link to node
                    if(value=='fill' || value=='cover'){
                        profile.link(f.height, '$dock1');
                        profile.link(f.width, '$dock2');
                        f.height.sort(order);
                        f.width.sort(order);
                    }else if(value=='origin'){
                        profile.link(f.center, '$dock1');
                        profile.link(f.middle, '$dock2');
                    }else{
                        profile.link(f[value], '$dock');
                        f[value].sort(order);
                    }
                    profile.link(f.dockall, '$dockall');

                    //
                    linb.$cache._resizeTime=1;

                    //set shortuct
                    profile.$dockFun=f;

                }
                if(isWin){
                    var f=linb.win.$getEvent('onSize','dock');
                    if(f && f.dockall && f.dockall.length){
                        linb('html').addClass('linbcss-viewport');
                        if(t=linb('body').get(0))
                            t.scroll='no';
                    }else{
                        linb('html').removeClass('linbcss-viewport');
                        if(t=linb('body').get(0))
                            t.scroll='';
                    }
                }
            }

            //run once now
            if(value != 'none' && trigger)
                profile.$dockFun({width:1, height:1, $dockid:_.arr.indexOf(['width','height','fill','cover'],value)!=-1?profile.$linbid:null, $type: value});
        },

        _beforeSerialized:function(profile){
            var r=profile.boxing(),b,t,o={};
            _.merge(o, profile, 'all');
            var p = o.properties = _.copy(profile.properties);
            switch(p.dock){
                case 'top':
                case 'bottom':
                    delete p.width;delete p.left;delete p.top;delete p.right;delete p.bottom;
                    break;
                case 'left':
                case 'right':
                    delete p.height;delete p.left;delete p.top;delete p.right;delete p.bottom;
                    break;
                case 'width':
                    delete p.width;delete p.left;delete p.right;
                    break;
                case 'height':
                    delete p.height;delete p.top;delete p.bottom;
                    break;
                case 'fill':
                case 'cover':
                    delete p.width;delete p.height;delete p.left;delete p.top;delete p.right;delete p.bottom;
                    break;
            }
            for(var i in linb.UI.$ps)
                if((i in p) && typeof p[i]!='number' && p[i]!='' && p[i]!='auto')p[i]=isNaN(p[i]=parseFloat(p[i]))?'auto':p[i];

            for(var i in profile.box._objectProp)
                if((i in p) && p[i] && _.isEmpty(p[i]))delete p[i];

            if(p.items && p.items.length){
                t=linb.absObj.$specialChars;
                p.items = _.clone(p.items,function(o,i){return !t[(i+'').charAt(0)]&&o!=undefined});
            }
            if((t=p.dockMargin)&&!t.left&&!t.top&&!t.right&&!t.bottom)
                delete p.dockMargin;
            if(p.items&&(p.items.length==0||p.listKey))
                delete p.items;

            return o;
        },
        getDropKeys:function(profile,node){
            return profile.properties.dropKeys;
        },
        getDragKey:function(profile,node){
            return profile.properties.dragKey;
        },
        getDragData:function(profile,event,node){
            return {
                profile:profile,
                domId:linb.use(node).id(),
                data: profile.onGetDragData ? profile.boxing().onGetDragData(profile,event,node) : null
            };
        },
        _prepareData:function(profile, data){
            var prop = profile.properties,
                dm = this.$DataModel,
                me = arguments.callee,
                map = me.map || (me.map=_.toArr('left,top,bottom,right,width,height')),
                a=[],
                ajd=profile.box.adjustData,
                t
                ;
            data = data||{};
            //can't input id in properties
            if(prop.id)delete prop.id;

            //give default caption
            if('caption' in dm && prop.caption!==null)
                prop.caption = prop.caption===undefined ? profile.alias : prop.caption;


            //give border width
            if('$hborder' in dm)
                data.bWidth=prop.width - (prop.$hborder||0)*2;
            if('$vborder' in dm)
                data.bHeight=prop.height - (prop.$vborder||0)*2;

            //set left,top,bottom,right,width,height,position,z-index,visibility,display
            for(var j=0,i;i=map[j];j++){
                if(prop[i] || prop[i]===0){
                    if(String(parseFloat(prop[i]))==String(prop[i]))
                        a[a.length]=i+':'+(parseInt(prop[i])||0)+'px';
                    else if(prop[i]!='auto' && prop[i])
                        a[a.length]=i+':'+prop[i];
                }
            }
            if(prop.position)a[a.length] = 'position:'+prop.position;
            if(prop.visibility)a[a.length]= 'visibility:'+prop.visibility;
            if(prop.zIndex)a[a.length]= 'z-index:'+prop.zIndex;
            if(prop.display)a[a.length]= 'display:'+ (prop.display=='inline-block'? linb.browser.gek?'-moz-inline-block;display:-moz-inline-box;display:inline-block;':'inline-block' :prop.display)

            data._style = ';'+a.join(';')+';';

            if('className' in dm)
            	data._className=prop.className||"";

            if('readonly' in dm)data.readonly=prop.readonly?"ui-readonly":"";
            if('href' in dm)data.href = prop.href || linb.$DEFAULTHREF;
            if('tabindex' in dm)data.tabindex = prop.tabindex || '-1';
            if('items' in dm){
                profile.ItemIdMapSubSerialId = {};
                profile.SubSerialIdMapItem = {};

                prop.items=profile.box._adjustItems(prop.items);
                data.items = this._prepareItems(profile, prop.items);
            }

            //default prepare
            data =  ajd(profile, prop, data);

            profile.prepared=true;
            return data;
        },
        _prepareItems:function(profile, items, pid, mapCache, serialId){
            var result=[],
                item,dataItem,t,
                SubID=linb.UI.$tag_subId,id ,
                tabindex = profile.properties.tabindex,
                ajd=profile.box.adjustData;
            //set map
            for(var i=0,l=items.length;i<l;i++){
                if(typeof items[i]!='object')
                    items[i]={id:items[i]};
                item=items[i];
                if(!item.hasOwnProperty('caption'))item.caption=item.id;

                dataItem={id: item.id};
                if(pid)dataItem._pid = pid;

                id=dataItem[SubID]=typeof serialId=='string'?serialId:profile.pickSubId('items');

                if(false!==mapCache){
                    profile.ItemIdMapSubSerialId[item.id] = id;
                    profile.SubSerialIdMapItem[id] = item;
                }
                if(t=item.object){
                    t=dataItem.object=t['linb.absBox']?t.get(0):t;
                    //relative it.
                    if(t['linb.UIProfile'])
                        t.properties.position='relative';
                    item.$linbid=t.$linbid;
                    t.$item=item;
                    t.$holder=profile;
                    if(!profile.$attached)profile.$attached=[];
                    profile.$attached.push(t);
                }else{
                    dataItem._tabindex=tabindex;
                    if(item.hidden)
                        item.itemDisplay='display:none;';

                    //others
                    ajd(profile, item, dataItem);
                    if(this._prepareItem)
                        this._prepareItem(profile, dataItem, item, pid, i,l,mapCache, serialId);
                }
                result.push(dataItem);
            }

            return result;
        },
        _showTips:function(profile, node, pos){
            if(profile.properties.disableTips)return;
            if(profile.onShowTips)
                return profile.boxing().onShowTips(profile, node, pos);
            //if(!linb.Tips)return;
        }
    }
});
//absList cls
Class("linb.absList", "linb.absObj",{
    Instance:{
        activate:function(){
            var profile = this.get(0),
                items = profile.getSubNode('ITEM',true);
            if(!items.isEmpty())
                items.focus();
            return this;
        },
        /*
        [x] ,valid id   ,true  => insert [x] before node
        [x] ,valid id   ,false => insert [x ]after node
        [x] ,null ,true  => insert [x ] to head
        [x] ,null ,false => insert [x ] to tail
        */
        insertItems:function(arr, base, before){
            var node,arr2,
                items, index, r,
                data,box,
                b=this._afterInsertItems;
            return this.each(function(profile){
                box=profile.box;

                arr2=box._adjustItems(arr);

                items = profile.properties.items;
                index = _.arr.subIndexOf(items,'id',base);

                //if in dom, create it now
                if(profile.renderId){
                    // prepare properties format
                    data = box._prepareItems(profile, arr2, base);

                    r=profile._buildItems('items', data);

                    // try to render inner linb.UI
                    if(profile.$attached){
                        for(var i=0,v;v=profile.$attached[i++];)
                            if(v._render)
                                v._render(true);
                        delete profile.$attached;
                    }

                    if(index==-1){
                        //if no base specified
                        node = profile.getSubNode(box._ITEMSKEY || profile.keys.ITEMS || profile.keys.KEY);
                        //items.length==1 for that one have fake item(for example: editable poll)
                        if(before)
                            node.prepend(r);
                        else
                            node.append(r);
                    }else{
                        node=profile.getSubNodeByItemId(box._ITEMKEY || 'ITEM', base);
                        if(before)
                            node.addPrev(r);
                        else
                            node.addNext(r);
                    }
                }

                //must be here
                if(index==-1){
                    _.arr.insertAny(items,arr2, before?0:-1);
                }else
                    _.arr.insertAny(items,arr2, before?index:index+1);


                if(b)
                    profile.boxing()._afterInsertItems(profile, data, base, before);
            });
        },
        removeItems:function(arr, key){
            if(!(arr instanceof Array))arr=[arr];
            var obj,v,
                b=this._afterRemoveItems;
                remove=function(profile, arr, target, data, ns, force){
                    var self=arguments.callee;
                    if(!ns)ns=linb();
                    _.filter(arr,function(o){
                        var serialId,b;
                        if(force || (b=(_.arr.indexOf(target,o.id)!=-1))){
                            if(profile.renderId){
                                if(serialId=profile.ItemIdMapSubSerialId[o.id]){
                                    data.push(_.copy(profile.SubSerialIdMapItem[serialId]));
                                    // clear maps
                                    delete profile.SubSerialIdMapItem[serialId];
                                    delete profile.ItemIdMapSubSerialId[o.id];
                                    profile.reclaimSubId(serialId, 'items');

                                    //parent node is deleted
                                    if(!force){
                                        if(!(obj = profile.getSubNode(profile.keys[key]?key:(profile.box._ITEMKEY||'ITEM'), serialId) ).isEmpty() )
                                            ns.merge(obj);
                                        //for inner template or linb.UI
                                        if(o.$linbid)ns.get().push(linb.getObject(o.$linbid).getRootNode());
                                    }
                                }
                            }
                        }
                        //check sub
                        if(o.sub)self(profile, o.sub,target,  data, ns, force || b);
                        //filter it
                        if(b){
                            for(var i in o)o[i]=null;
                            return false;
                        }
                    });
                    ns.remove();
                };
            return this.each(function(profile){
                var p=profile.properties,data=[];
                // clear properties
                remove(profile, p.items, arr, data);
                // clear value
                if(v=p.$UIvalue){
                    if((v=v.split(';')).length>1){
                        _.filter(v,function(o){
                            return _.arr.indexOf(arr,o)==-1;
                        });
                        p.$UIvalue=v.join(';');
                    }else{
                        if(_.arr.indexOf(arr,p.$UIvalue)!=-1)
                            p.$UIvalue=null;
                    }
                }
                if(b && profile.renderId)
                    profile.boxing()._afterRemoveItems(profile, data);
            });
        },
        clearItems:function(key){
            return this.each(function(profile){
                if(!profile.SubSerialIdMapItem)return;
                //empty dom
                profile.getSubNode(profile.keys[profile.box._ITEMKEY||'ITEM'], true).remove();
                //save subid
                _.each(profile.SubSerialIdMapItem, function(o,serialId){
                    profile.reclaimSubId(serialId, 'items');
                });
                //delete items
                profile.properties.items.length=0;
                //clear cache
                profile.SubSerialIdMapItem={};
                profile.ItemIdMapSubSerialId={};

                profile.properties.$UIvalue=null;
                //keep the value
                //profile.properties.value=null;
            });
        },
        updateItem:function(subId,options){
            var self=this,
                profile=self.get(0),
                box=profile.box,
                items=profile.properties.items,
                rst=profile.queryItems(items,function(o){return typeof o=='object'?o.id===subId:o==subId},true,true,true),
                nid,item,serialId,arr,node,sub,t;
            if(!_.isHash(options))options={caption:options+''};

            if(rst && rst.length){
                rst=rst[0];
                if(typeof rst[0]!='object')
                    item=rst[2][rst[1]]={id:rst[0]};
                else
                    item=rst[0];

                // [[modify id
                if(_.isSet(options.id))options.id+="";
                if(options.id && subId!==options.id){
                    nid=options.id;
                    var m2=profile.ItemIdMapSubSerialId, v;
                    if(!m2[nid]){
                        if(v=m2[subId]){
                            m2[nid]=v;
                            delete m2[subId];
                            profile.SubSerialIdMapItem[v].id=nid;
                        }else{
                            item.id=nid;
                        }
                    }
                }
                delete options.id;
                // modify id only
                if(_.isEmpty(options))
                    return self;
                //]]

                //merge options
                _.merge(item, options, 'all');

                //in dom already?
                node=profile.getSubNodeByItemId('ITEM',nid || subId);
                if(!node.isEmpty()){
                    //prepared already?
                    serialId=_.get(profile,['ItemIdMapSubSerialId',nid || subId]);
                    arr=box._prepareItems(profile, [item],item._pid,false, serialId);

                    //for the sub node
                    if(options.sub){
                        delete item._created;
                        delete item._checked;
                    }else if(item.sub){
                        sub=profile.getSubNodeByItemId('SUB',nid || subId);
                    }
                    node.replace(profile._buildItems(arguments[2]||'items',arr),false);
                    //keep sub
                    if(sub && !sub.isEmpty()){
                        if(!(t=profile.getSubNodeByItemId('SUB',nid || subId)).isEmpty())
                            t.replace(sub);
                    }
                    if(typeof self.setUIValue=='function'){
                        var uiv=profile.properties.$UIvalue||"", arr=uiv.split(';');
                        if(arr.length && _.arr.indexOf(arr, subId)!=-1){
                            if(nid)_.arr.removeValue(arr,subId);
                            self.setUIValue(arr.join(';'), true);
                        }
                    }
                }
            }
            return self;
        },
        getItems:function(type){
            var v=this.get(0).properties.items;
            if(type=='data')
                return _.clone(v,true);
            else if(type=='min'){
                var a=_.clone(v,true),b;
                _.arr.each(a,function(o,i){
                    a[i]=o.id;
                });
                return a;
            }else
                return v;
        },
        fireItemClickEvent:function(subId){
            this.getSubNodeByItemId(this.constructor._focusNodeKey, subId).onClick();
            return this;
        }
    },
    Initialize:function(){
        var o=this.prototype;
        _.arr.each(_.toArr('getItemByItemId,getItemByDom,getSubIdByItemId,getSubNodeByItemId'),function(s){
            o[s]=function(){
                var t=this.get(0);
                return t[s].apply(t,arguments);
            };
            Class._fun(o[s],s,o.KEY,null,'instance');
        });
    },
    Static:{
        _focusNodeKey:'ITEM',
        $abstract:true,
        DataModel:{
            listKey:{
                set:function(value){
                    var o=this,
                        t = o.box.getCachedData(value);
                    if(t)
                        o.boxing().setItems(t);
                    else
                        o.boxing().setItems(o.properties.items);
                    o.properties.listKey = value;
                }
            },
            items:{
                ini:[],
                set:function(value){
                    var o=this;
                    if(o.renderId)
                        o.boxing().clearItems().insertItems(value);
                    else
                        o.properties.items = _.copy(value);
                }
            }
        },
        RenderTrigger:function(){
            this.destroyTrigger=function(){
                _.each(this.SubSerialIdMapItem,function(o){
                    _.breakO(o)
                });
                this.properties.items.length=0;
            };
        },
        _adjustItems:function(arr){
            if(!arr)arr=[];
            if(_.isStr(arr))arr=[arr];

            var a=_.copy(arr),m;
            _.arr.each(a,function(o,i){
                if(typeof o!= 'object')
                    a[i]={id:o+''};
                else{
                    a[i]=_.copy(o);
                    a[i].id=_.isSet(a[i].id)?(a[i].id+''):_.id();
                }
            });
            return a;
        },
        //
        _showTips:function(profile, node, pos){
            if(profile.properties.disableTips)return;
            if(profile.onShowTips)
                return profile.boxing().onShowTips(profile, node, pos);
            if(!linb.Tips)return;

            var t=profile.properties,
                id=node.id,
                sid=profile.getSubId(id),
                map=profile.SubSerialIdMapItem,
                item=map&&map[sid];

            if(item && item.tips){
                linb.Tips.show(pos, item);
                return true;
            }else
                return false;
        }
    }
});

Class("linb.absValue", "linb.absObj",{
    Instance:{
        /*
        getUIValue:         return $UIvalue
        setUIValue:         set $UIvalue,and _setCtrlValue                   beforeUIValueSet/afterUIValueSet
        getValue:           return value
        setValue:           set value, set $UIvalue, and _setCtrlValue       beforeValueSet/afterValueSet
        resetValue:         reset value,UIvalue,Ctrlvalue not trigger event
        updateValue:        set $UIvalue to value

        _setCtrlValue:      change control value                *need to be overwritten
        _getCtrlValue:      get value from control              *need to be overwritten
        _setDirtyMark:      mark UI ctrl when value!==UIvalue   *need to be overwritten
        */
        _getCtrlValue:function(){return this.get(0).properties.$UIvalue},
        _setCtrlValue:function(value){return this},
        _setDirtyMark:function(key){
          return this.each(function(profile){
                if(!profile.renderId)return;
                var properties = profile.properties,
                    flag=properties.value !== properties.$UIvalue,
                    o=profile.getSubNode(key||"KEY"),
                    d=linb.UI.$css_tag_dirty;
                if(profile._dirtyFlag!==flag){
                    if(properties.dirtyMark && properties.showDirtyMark){
                        if(profile.beforeDirtyMark && false===profile.boxing().beforeDirtyMark(profile,flag)){}
                        else{
                            if(flag) o.addClass(d);
                            else o.removeClass(d);
                        }
                    }
                    profile._dirtyFlag=flag;
                }
            });
        },

        getValue:function(){return this.get(0).properties.value},
        getUIValue:function(){
            var prf=this.get(0),
                prop=prf.properties,
                cv=this._getCtrlValue();
            if(!prf.box._checkValid || false!==prf.box._checkValid(prf,cv))
                prf.$UIvalue=cv;
            return prf.$UIvalue;
        },
        resetValue:function(value){
            var self=this;
            self.each(function(profile){
                var r,pro=profile.properties;
                if(typeof (r=profile.box._ensureValue)=='function')
                    value=r.call(profile.box, profile, value);
                if(pro.value !== value || pro.$UIvalue!==value){
                    if(profile.box._beforeResetValue)profile.box._beforeResetValue(profile);
                    // _setCtrlValue maybe use $UIvalue
                    profile.boxing()._setCtrlValue(pro.value = value);
                    // So, maintain $UIvalue during _setCtrlValue call
                    pro.$UIvalue = value;
                    if(typeof(r=profile.$onValueSet)=='function')r.call(profile,value);
                }
                if(!profile._inValid)profile._inValid=1;
            });
            self._setDirtyMark();
            return self;
        },
        setUIValue:function(value, force){
            var self=this;
            this.each(function(profile){
                var prop=profile.properties, r,
                    ovalue = prop.$UIvalue,
                    box = profile.boxing();

                if(ovalue !== value || force){
                    if(
                        (profile.box._checkValid && false===profile.box._checkValid(profile, value)) ||
                        (profile.beforeUIValueSet && false===(r=box.beforeUIValueSet(profile, ovalue, value)))
                      )
                        return;

                    //can get return value
                    if(r!==undefined && typeof r!=='boolean')value=r;
                    //before _setCtrlValue
                    if(typeof (r=profile.box._ensureValue)=='function')
                        value = r.call(profile.box, profile, value);
                    if(typeof(r=profile.$onValueUpdated)=='function')r.call(profile,value);
                    //before value copy
                    if(profile.renderId)box._setCtrlValue(value);
                    
                    //value copy
                    prop.$UIvalue = value;

                    if(profile.renderId)box._setDirtyMark();
                    
                    if(profile.afterUIValueSet)box.afterUIValueSet(profile, ovalue, value);
                    if(profile.onChange)box.onChange(profile, ovalue, value);

                    if(!prop.dirtyMark)
                        box.setValue(value);
                }
            });
            return this;
        },
        updateValue:function(){
            return this.each(function(profile){
                var prop = profile.properties;
                if(prop.value!==prop.$UIvalue){
                    var ins=profile.boxing();
                    if(ins.checkValid()){
                        // prop.value = ins.getUIValue();
                        ins.setValue(ins.getUIValue(),true);
                        ins._setDirtyMark();
                    }
                }
            });
        },
        isDirtied:function(){
            var dirtied=false;
            this.each(function(profile){
                var p=profile.properties;

                // inner value is alway string
                dirtied = (p.value+" ") !== (p.$UIvalue+" ");
                if(dirtied)
                    return false;
            });
            return dirtied
        },
        checkValid:function(value){
            var prop,tr,r=true,outv=_.isSet(value);
            this.each(function(profile){
                prop=profile.properties;
                tr=true;
                
                // for checking html ctrl valid, <input> only
                if(profile.box._checkValid2)
                    // r must be at the end
                    r = (tr=profile.box._checkValid2(profile)) && r;
                if(tr && profile.box._checkValid)
                    //r must be at the end
                    r = profile.box._checkValid(profile, outv?value:prop.$UIvalue) && r;

                if(!outv && profile.renderId)
                    profile.boxing()._setDirtyMark();
            });
            return r;
        }
    },
    Static:{
        $abstract:true,
        DataModel:{
            dataBinder:{
                combobox:function(){
                    return _.toArr(linb.DataBinder._pool,true);
                },
                set:function(value,ovalue){
                    var profile=this,
                        p=profile.properties;
                    if(ovalue)
                        linb.DataBinder._unBind(ovalue, profile);
                    p.dataBinder=value;
                    linb.DataBinder._bind(value, profile);
                }
            },
            dataField:{
                ini:'',
                set:function(value,ovalue){
                    var profile=this,t,
                        p=profile.properties;
                    p.dataField=value;

                    if(!p.dataBinder)return;
                    // set control value 2
                    var db=linb.DataBinder.getFromName(p.dataBinder);
                    if(db && (t=db.get(0)) && (t=t._valuesMap) && _.isSet(t=t[value]))
                        //p.value=t;
                        profile.boxing().setValue(t,true);
                }
            },
            readonly:{
                ini:false,
                action: function(v){
                    var i=this.getRoot();
                    if(v)
                        i.addClass('ui-readonly');
                    else
                        i.removeClass('ui-readonly');
                }
            },
            // setValue and getValue
            value:{
                ini:null,
                set:function(value){
                    var profile=this,
                        p=profile.properties,r,
                        ovalue = p.value,
                        box=profile.boxing(),
                        nv=value;

                    //check format
                    if(profile.box._checkValid && profile.box._checkValid(profile, nv)===false)return;
                    //if return false in beforeValueSet, not set
                    if(profile.beforeValueSet && false=== (r=box.beforeValueSet(profile, ovalue, nv)))return;
                    // can get return value
                    if(r!==undefined)nv=r;
                    //before _setCtrlValue
                    //ensure value
                    if(typeof (r=profile.box._ensureValue)=='function')
                        nv = r.call(profile.box, profile, nv);
                    if(typeof(r=profile.$onValueSet)=='function')r.call(profile,nv);
                    //before value copy
                    if(profile.renderId)box._setCtrlValue(nv);
                    //value copy
                    p.value = p.$UIvalue = nv;

                    if(!profile._inValid)profile._inValid=1;
                    if(profile.renderId)box._setDirtyMark();
                    if(profile.afterValueSet)box.afterValueSet(profile, ovalue, nv);
                }
            },
            dirtyMark:true,
            showDirtyMark:true
        },
        EventHandlers:{
           //real value set
            beforeValueSet:function(profile, oldValue, newValue){},
            afterValueSet:function(profile, oldValue, newValue){},

            //ui value set
            beforeUIValueSet:function(profile, oldValue, newValue){},
            afterUIValueSet:function(profile, oldValue, newValue){},
            onChange:function(profile, oldValue, newValue){},

            beforeDirtyMark:function(profile, dirty){}
        },
        RenderTrigger:function(){
            var self=this, b=self.boxing(),p=self.properties,t;

            if(t=p.dataBinder)b.setDataBinder(t,true);
            if(t=p.dataField)b.setDataField(t);

            if(p.value!==undefined){
                if(typeof (t=self.box._ensureValue)=='function'){
                    p.value = t.call(self.box, self, p.value);
                    if(p.$UIvalue)
                        p.$UIvalue = t.call(self.box, self, p.$UIvalue);
                }
                if(!p.$UIvalue)
                    p.$UIvalue=p.value;
                b._setCtrlValue(p.$UIvalue);
            }
        }
    }
});

//som base widgets Classes
new function(){
    var u='linb.UI';
    //Widget cls
    Class(u+".Widget", u,{
        Static:{
            Appearances:{
                KEY:{
                    'font-size':linb.browser.ie?0:null,
                    'line-height':linb.browser.ie?0:null
                }
            },
            Templates:{
                className:'uiw-shell {_className}',
                style:'{_style}',
                FRAME:{
                    className:'uiw-frame ',
                    BORDER:{
                        style:'width:{bWidth}px;height:{bHeight}px;',
                        className:'uiw-border'
                    }
                }
            },
            Behaviors:{
                onSize:linb.UI.$onSize
            },
            DataModel:{
                width:100,
                height:100,
                //hide props
                $hborder:0,
                $vborder:0
            },
            RenderTrigger:function(){
                var self=this, p=self.properties, o=self.boxing();

                if(self.renderId)
                    if((!self.$noB) && p.border && o._border)o._border();

                if((!self.$noR) && p.resizer && o.setResizer)
                    o.setResizer(p.resizer,true);
                if((!self.$noS) && p.shadow && o._shadow)
                    o._shadow();
            },
            _onresize:function(profile,width,height){
                var t = profile.properties,
                    o = profile.getSubNode('BORDER'),
                    region,
                    ww=width,
                    hh=height,
                    left=Math.max(0, (t.$b_lw||0)-(t.$hborder||0)),
                    top=Math.max(0, (t.$b_tw||0)-(t.$vborder||0));
                if(ww&&'auto'!==ww){
                    ww -= Math.max((t.$hborder||0)*2, (t.$b_lw||0)+(t.$b_rw||0));
                    /*for ie6 bug*/
                    /*for example, if single number, 100% width will add 1*/
                    /*for example, if single number, attached shadow will overlap*/
                    if(linb.browser.ie6)ww=(parseInt(ww/2))*2;
                }
                if(hh&&'auto'!==hh){
                    hh -=Math.max((t.$vborder||0)*2, (t.$b_lw||0) + (t.$b_rw||0));

                    if(linb.browser.ie6)hh=(parseInt(hh/2))*2;
                    /*for ie6 bug*/
                    if(linb.browser.ie6&&null===width)o.ieRemedy();
                }
                region={left:left,top:top,width:ww,height:hh};
                o.cssRegion(region);

                /*for ie6 bug*/
                if((profile.$border||profile.$shadow||profile.$resizer) && linb.browser.ie)o.ieRemedy();

                return region;
            }
        }
    });
    Class(u+".Link", u,{
        Static:{
            Appearances:{
                KEY:{
                   'font-size':linb.browser.ie?'12px':null,
                   'line-height':linb.browser.ie?'14px':null
                }
            },
            Templates:{
                tagName:'a',
                className:'{_className}',
                style:'{_style}',
                href :"{href}",
                target:'{target}',
                tabindex: '{tabindex}',
                text:'{caption}'
            },
            Behaviors:{
                HoverEffected:{KEY:'KEY'},
                ClickEffected:{KEY:'KEY'},
                onClick:function(profile, e, src){
                    var r;
                    if(!profile.properties.disabled && profile.onClick)
                        r = profile.boxing().onClick(profile, e, src);
                    //**** if dont return false, this click will break sajax in IE
                    //**** In IE, click a fake(javascript: or #) href(onclick not return false) will break the current script downloading
                    var href=linb.use(src).attr('href');
                    return typeof r=='boolean'?r:(href.indexOf('javascript:')===0||href.indexOf('#')===0)?false:true;
                }
            },
            DataModel:{
                caption:{
                    ini:undefined,
                    action:function(v){
                        v=(_.isSet(v)?v:"")+"";
                        this.getRoot().html(linb.adjustRes(v,true));
                    }
                },
                href:{
                    ini:linb.$DEFAULTHREF,
                    action:function(v){
                        this.getRoot().attr('href',v);
                    }
                },
                target:{
                    action:function(v){
                        this.getRoot().attr('target',v);
                    }
                }
            },
            EventHandlers:{
                onClick:function(profile, e){}
            }
        }
    });
    Class(u+".SLabel", u,{
        Static:{
            Templates:{
                className:'{_className}',
                style:'{_style}text-align:{hAlign}',
                text:'{caption}'
            },
            Appearances:{
                KEY:{
                   'padding-right':'6px'
                }
            },
            DataModel:{
                caption:{
                    ini:undefined,
                    action: function(v){
                        v=(_.isSet(v)?v:"")+"";
                        this.getRoot().html(linb.adjustRes(v,true));
                    }
                },
                hAlign:{
                    ini:'right',
                    listbox:['left','center','right'],
                    action: function(v){
                        this.getRoot().css('textAlign',v);
                    }
                }
            }
        }
    });
    Class(u+".SButton", u,{
        Instance:{
            activate:function(){
                this.getSubNode('FOCUS').focus();
                return this;
            }
        },
        Static:{
            Templates:{
                className:'{_clsName} {_className}',
                style:'{_style}',
                BTN:{
                    className:'ui-btn',
                    BTNI:{
                        className:'ui-btni',
                        BTNC:{
                            className:'ui-btnc',
                            FOCUS:{
                                tabindex: '{tabindex}',
                                style:"{_align}",
                                text:'{caption}'
                            }
                        }
                    }
                }
            },
            Appearances:{
                BTN:{
                    overflow:'hidden'
                },
                'KEY-auto BTN, KEY-auto BTNI, KEY-auto BTNC, KEY-auto FOCUS':{
                    $order:1,
                    display:linb.$inlineBlock
                },
                'BTN,BTNI,BTNC':{
                    display:'block'
                },
                'KEY FOCUS':{
                    cursor:'pointer',
                    'font-size':'12px',
                    'line-height':'14px',
                    'text-align':'center',
                    display:'block'
                }
            },
            Behaviors:{
                HoverEffected:{BTN:['BTN']},
                ClickEffected:{BTN:['BTN']},
                NavKeys:{FOCUS:1},
                onClick:function(profile, e, src){
                    var p=profile.properties;
                    if(p.disabled)return false;
                    profile.getSubNode('FOCUS').focus();
                    if(profile.onClick)
                        profile.boxing().onClick(profile, e, src);
                }
            },
            DataModel:{
/*custom property test for UIDesigner
                test:{
                    ini:1,
                    custom:function(p,k,v,submit){
                        console.log(p,k,v);
                        _.asyRun(function(){
                            submit(++v);
                        });
                    }
                },
*/
                caption:{
                    ini:undefined,
                    action: function(v){
                        v=(_.isSet(v)?v:"")+"";
                        this.getSubNode('FOCUS').html(linb.adjustRes(v,true));
                    }
                },
                hAlign:{
                    ini:'center',
                    listbox:['left','center','right'],
                    action: function(v){
                        this.getSubNode('FOCUS').css('textAlign',v);
                    }
                },
                width:{
                    ini:'auto',
                    action:function(value){
                        if(value=='auto'){
                            this.getRoot().width('auto').tagClass('-auto');
                        }else
                            this.getRoot().width(value).tagClass('-auto',false);
                    }
                },
                height:{
                    readonly:true
                }
            },
            EventHandlers:{
                onClick:function(profile, e, src, value){}
            },
            _prepareData:function(profile){
                var data=arguments.callee.upper.call(this, profile);
                data._align = 'text-align:'+data.hAlign+';';
                data._clsName=parseInt(data.width)?'':profile.getClass('KEY','-auto');
                return data;
            }
        }
    });
    Class(u+".SCheckBox", [u,"linb.absValue"],{
        Instance:{
            activate:function(){
                this.getSubNode('FOCUS').focus();
                return this;
            },
            _setCtrlValue:function(value){
                return this.each(function(profile){
                   profile.getSubNode('MARK').tagClass('-checked', !!value);
                });
            },
            //update UI face
            _setDirtyMark:function(){
                return arguments.callee.upper.apply(this,['CAPTION']);
            }
        },
        Static:{
            Templates:{
                className:'{_clsName} {_className}',
                style:'{_style}',
                FOCUS:{
                    tabindex: '{tabindex}',
                    MARK:{
                        className:'uicmd-check'
                    },
                    CAPTION:{
                        $order:1,
                        text:'{caption}'
                    }
                }
            },
            Appearances:{
                KEY:{
                    overflow:'visible'
                },
                FOCUS:{
                    cursor:'default',
                    'vertical-align':'middle',
                    padding:'2px 0',
                    'font-size':'12px',
                    'line-height':'14px'
                },
                CAPTION:{
                    'vertical-align':linb.browser.ie6?'baseline':'middle'
                }
            },
            Behaviors:{
                HoverEffected:{KEY:'MARK'},
                ClickEffected:{KEY:'MARK'},
                NavKeys:{FOCUS:1},
                onClick:function(profile, e, src){
                    var p=profile.properties,b=profile.boxing();
                    if(p.disabled)return false;
                    if(p.readonly)return false;
                    b.setUIValue(!p.$UIvalue);
                    if(profile.onChecked)b.onChecked(profile, e, p.$UIvalue);
                    profile.getSubNode('FOCUS').focus();
                },
                FOCUS:{
                    onKeydown:function(profile, e, src){
                        var key = linb.Event.getKey(e).key;
                        if(key ==' ' || key=='enter'){
                            profile.getRoot().onClick(true);
                            return false;
                        }
                    }
                }
            },
            DataModel:{
                value:false,
                caption:{
                    ini:undefined,
                    action: function(v){
                        v=(_.isSet(v)?v:"")+"";
                        this.getSubNode('CAPTION').html(linb.adjustRes(v,true));
                    }
                }
            },
            EventHandlers:{
                onChecked:function(profile, e, value){}
            },
            _ensureValue:function(profile, value){
                return !!value;
            }
        }
    });
    Class(u+".Span", u,{
        Static:{
            Templates:{
                className:'{_className}',
                style:'{_style}',
                //for firefox div focus bug: outline:none; tabindex:'-1'
                tabindex:'-1',
                text:'{html}'+linb.UI.$childTag
            },
            DataModel:{
                width:'16',
                height:'16',
                html:{
                    action:function(v){
                        this.getRoot().html(v);
                    }
                }
            }
        }
    });

    Class(u+".Div", u,{
        Static:{
            Appearances:{
                KEY:{
                   // overflow:(linb.browser.gek && !linb.browser.gek3)?'auto':null,
                    outline:linb.browser.gek?'none':null,
                    zoom:linb.browser.ie6?'1':null,
                    background:linb.browser.ie?'url('+linb.ini.img_bg+') no-repeat left top':null
                }
            },
            Templates:{
                tagName:'div',
                className:'{_className}',
                style:'{_style}',
                //for firefox div focus bug: outline:none; tabindex:'-1'
                tabindex:'-1',
                text:'{html}'+linb.UI.$childTag
            },
            DataModel:{
                iframeAutoLoad:"",
                ajaxAutoLoad:"",
                width:'100',
                height:'100',
                html:{
                    action:function(v){
                        this.getRoot().html(v);
                    }
                }
            },
            RenderTrigger:function(){
                // only div
                var ns=this;
                if(ns.box.KEY=="linb.UI.Div")
                    if(ns.properties.iframeAutoLoad||ns.properties.ajaxAutoLoad)
                        ns.box._applyAutoLoad(this);
            },
            _applyAutoLoad:function(prf){
                var prop=prf.properties, ins=prf.boxing();
                if(prop.iframeAutoLoad){
                    ins.getContainer().css('overflow','hidden');
                    if(typeof prop.iframeAutoLoad=='string')
                        prop.iframeAutoLoad={url:prop.iframeAutoLoad};
                    var hash=prop.iframeAutoLoad,
                        id="biframe_"+_(),
                        e=linb.browser.ie && parseInt(linb.browser.ver)<9,
                        ifr=document.createElement(e?"<iframe name='"+id+"'>":"iframe");
                    ifr.id=ifr.name=id;
                    ifr.src=hash.url;
                    ifr.frameBorder='0';
                    ifr.marginWidth='0';
                    ifr.marginHeight='0';
                    ifr.vspace='0';
                    ifr.hspace='0';
                    ifr.allowTransparency='true';
                    ifr.width='100%';
                    ifr.height='100%';
                    ins.append(ifr);
                    linb.Dom.submit(hash.url, hash.query, hash.method, ifr.name, hash.enctype);
                }else if(prop.ajaxAutoLoad){
                    if(typeof prop.ajaxAutoLoad=='string')
                        prop.ajaxAutoLoad={url:prop.ajaxAutoLoad};
                    var hash=prop.ajaxAutoLoad;
                    ins.busy();
                    linb.Ajax(hash.url, hash.query, function(rsp){
                        var n=linb.create("div");
                        n.html(rsp,false,true);
                        ins.append(n.children());
                        ins.free();
                    }, function(err){
                        ins.append("<div>"+err+"</div>");
                        ins.free();
                    }, null, hash.options).start();
                }
            }
        }
    });
    Class(u+".Tag", u+".Div",{
        Static:{
            Templates:{
                tagName:'div',
                className:'{_className}',
                style:'overflow:auto;border:dashed blue 1px;text-align:center;background:#EBEADB;{_style}',
                text:'{tagKey}'+linb.UI.$childTag
            },
            DataModel:{
                html:null,
                tagKey:{
                    action:function(v){
                        this.getRoot().html(v);
                    }
                }
            },
            _l:_.toArr('left,top,bottom,right,width,height,zIndex,tabindex,position,dock,dockFloat,dockMinW,dockMinH,dockOrder,dockMargin'),
            //replace tag profile with other UI profile
            replace:function(tagProfile, profile, com){
                //reset properties
                _.arr.each(this._l,function(s){
                    if(s in tagProfile.properties)profile.properties[s]=tagProfile.properties[s];
                });
                _.merge(profile.CS,tagProfile.CS,'all');
                _.merge(profile.CC,tagProfile.CC,'all');
                if(typeof tagProfile.theme =="string")
                    profile.theme=tagProfile.theme;

                //if parent exist, replace
                if(tagProfile.parent){
                    //get tag link
                    var clink = tagProfile.parent.children,
                        linkObj = clink['$'+tagProfile.$linbid],
                        index = _.arr.indexOf(clink,linkObj);
                    tagProfile.parent.boxing().append(profile, linkObj[1]);
                    // set to tag index
                    clink[index] = clink.pop();

                    //detach tag from parent
                    tagProfile.unLink('$parent');
                    delete tagProfile.parent;
                //for _nodes in com
                }else if(com){
                    _.arr.each(com._nodes,function(o,i){
                        if(o===tagProfile){
                            com._nodes[i]=profile;
                            return false;
                        }
                    });
                }

                if(tagProfile.renderId)
                    profile.boxing().renderOnto(tagProfile.getRootNode());
            }
        }
    });
    Class(u+".Pane", u+".Div",{
        Static:{
            Behaviors:{
                DroppableKeys:['KEY']
            },
            RenderTrigger:function(){
                // only div
                var ns=this;
                if(ns.box.KEY=="linb.UI.Pane")
                    if(ns.properties.iframeAutoLoad||ns.properties.ajaxAutoLoad)
                        ns.box._applyAutoLoad(this);
            }
        }
    });
};