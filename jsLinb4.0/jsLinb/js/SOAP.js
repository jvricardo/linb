Class('linb.SOAP',null,{
    Static:{
        RESULT_NODE_NAME:"return",

        getNameSpace:function(wsdl){
            var ns=wsdl.documentElement.attributes["targetNamespace"];
            return ns===undefined?wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue:ns.value;
        },
        wrapRequest:function(methodName, params, wsdl){
            if(typeof methodName=="object"){
                wsdl=params;
                params=methodName.params;
                methodName=methodName.methodName;
            }
            var ns=this, namespace=ns.getNameSpace(wsdl);
            //return "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
            return  "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                    "<soap:Body>" +
                    "<" + methodName + " xmlns=\""+namespace+"\">" +
                    ns._wrapParams(params) +
                    "</"+methodName+"></soap:Body></soap:Envelope>";
        },
        parseResponse:function(xmlObj, methodName, wsdl){
            if(typeof methodName=="object"){
                methodName=methodName.methodName;
            }
            var ns=this,
                hash={},
                nd=xmlObj.getElementsByTagName(methodName+"Result");
            if(!nd.length)
                nd=xmlObj.getElementsByTagName(ns.RESULT_NODE_NAME);
            if(!nd.length){
                hash.fault={
                    faultcode:xmlObj.getElementsByTagName("faultcode")[0].childNodes[0].nodeValue,
                    faultstring:xmlObj.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue
                };
            }else{
                hash.result=ns._rsp2Obj(nd[0],wsdl);
            }
            return hash;
        },
        _rsp2Obj:function(xmlNode, wsdl){
            var ns=this,
                types=ns._getTypesFromWsdl(wsdl);
            return ns._node2obj(xmlNode,types);
        },
        _getTypesFromWsdl:function(wsdl){
            var types=[],
                ell,useNamedItem;

            ell=wsdl.getElementsByTagName("s:element");
            if(ell.length){
                useNamedItem=true;
            }else{
                ell=wsdl.getElementsByTagName("element");
                useNamedItem=false;
            }
            for(var i=0,l=ell.length;i<l;i++){
                if(useNamedItem){
                    if(ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("type") != null)
                        types[ell[i].attributes.getNamedItem("name").nodeValue] = ell[i].attributes.getNamedItem("type").nodeValue;
                }else{
                    if(ell[i].attributes["name"] != null && ell[i].attributes["type"] != null)
                        types[ell[i].attributes["name"].value] = ell[i].attributes["type"].value;
                }
            }
            return types;
        },
        _getTypeFromWsdl:function(elems, types){
            return types[elems]==undefined?"":types[elems];
        },
        _node2obj:function(xmlNode, types){
            if(xmlNode==null)return null;
            var ns=this,value;
            if(xmlNode.nodeType==3||xmlNode.nodeType==4){
                value=xmlNode.nodeValue;
                switch(ns._getTypeFromWsdl(xmlNode.parentNode.nodeName, types).toLowerCase()){
                    case "s:boolean":
                        return value+""=="true";
                    case "s:int":
                    case "s:long":
                        return value===null?0:parseInt(value+"", 10);
                    case "s:double":
                        return value===null?0:parseFloat(value+"");
                    case "s:datetime":
                        if(value == null)
                            return null;
                        else{
                            value = value + "";
                            value = value.substring(0, (value.lastIndexOf(".") == -1 ? value.length : value.lastIndexOf(".")));
                            value = value.replace(/T/gi," ");
                            value = value.replace(/-/gi,"/");
                            var d = new Date();
                            d.setTime(Date.parse(value));
                            return d;
                        }
                    //case "s:string":
                    default:
                        return value===null?"":(value+"");
                }
            }else if(xmlNode.childNodes.length==1&&(xmlNode.childNodes[0].nodeType==3||xmlNode.childNodes[0].nodeType==4))
                return ns._node2obj(xmlNode.childNodes[0], types);
            else{
                if(ns._getTypeFromWsdl(xmlNode.nodeName, types).toLowerCase().indexOf("arrayof") == -1){
                    var obj=xmlNode.hasChildNodes()?{}:null;
                    for(var i=0,l=xmlNode.childNodes.length;i<l;i++)
                        obj[xmlNode.childNodes[i].nodeName]=ns._node2obj(xmlNode.childNodes[i], types);
                    return obj;
                }else{
                    var arr =[];
                    for(var i=0,l=xmlNode.childNodes.length;i<l;i++)
                        arr.push(ns._node2obj(xmlNode.childNodes[i], types));
                    return arr;
                }
            }
            return null;
        },
         _wrapParams:function(params){
            var ns=this,arr=[];
            for(var p in params){
                switch(typeof(params[p])){
                    case "string":
                    case "number":
                    case "boolean":
                    case "object":
                        arr.push("<" + p + ">" + ns._wrapParam(params[p]) + "</" + p + ">");
                        break;
                    default:
                        break;
                }

            }
            return arr.join('');
        },
        _wrapParam:function(param){
            var ns=this,s="";
            switch(typeof(param)){
                case "string":
                    s += param.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    break;
                case "number":
                case "boolean":
                    s += param+"";
                    break;
                case "object":
                    // Date
                    if(param.constructor.toString().indexOf("function Date()") > -1){
                        var year = param.getFullYear().toString();
                        var month = (param.getMonth() + 1).toString(); month = (month.length == 1) ? "0" + month : month;
                        var date = param.getDate().toString(); date = (date.length == 1) ? "0" + date : date;
                        var hours = param.getHours().toString(); hours = (hours.length == 1) ? "0" + hours : hours;
                        var minutes = param.getMinutes().toString(); minutes = (minutes.length == 1) ? "0" + minutes : minutes;
                        var seconds = param.getSeconds().toString(); seconds = (seconds.length == 1) ? "0" + seconds : seconds;
                        var milliseconds = param.getMilliseconds().toString();
                        var tzminutes = Math.abs(param.getTimezoneOffset());
                        var tzhours = 0;
                        while(tzminutes >= 60){
                            tzhours++;
                            tzminutes -= 60;
                        }
                        tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
                        tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
                        var timezone = ((param.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
                        s += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
                    }
                    // Array
                    else if(param.constructor.toString().indexOf("function Array()") > -1){
                        for(var p in param){
                            if(!isNaN(p)){
                                (/function\s+(\w*)\s*\(/ig).exec(param[p].constructor.toString());
                                var type = RegExp.$1;
                                switch(type)
                                {
                                    case "":
                                        type = typeof(param[p]);
                                    case "String":
                                        type = "string"; break;
                                    case "Number":
                                        type = "int"; break;
                                    case "Boolean":
                                        type = "bool"; break;
                                    case "Date":
                                        type = "DateTime"; break;
                                }
                                s += "<" + type + ">" + ns._wrapParam(param[p]) + "</" + type + ">"
                            }
                            else    // associative array
                                s += "<" + p + ">" + ns._wrapParam(param[p]) + "</" + p + ">"
                        }
                    }
                    // Object or custom function
                    else
                        for(var p in param)
                            s += "<" + p + ">" + ns._wrapParam(param[p]) + "</" + p + ">";
                    break;
            }
            return s;
        }
    }
});