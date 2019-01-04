var _loadedCss = {};
var _getCssOptions = function(options){
    var doc = (options && options.doc) || document;
    if (!doc.unid) doc.unid = _uuid();
    return {
        "noCache": !!(options && options.nocache),
        "reload": !!(options && options.reload),
        "sequence": !!(options && options.sequence),
        "doc": (options && options.doc) || document,
        "dom": (options && options.dom) || null
    }
};
var _loadSingleCss = function(module, callback, op, uuid){
    var url = module;
    var uid = _uuid();
    if (op.noCache) url = (url.indexOf("?")!==-1) ? url+"&v="+uid : url+"?v="+uid;

    var key = encodeURIComponent(url+op.doc.unid);
    if (!op.reload) if (_loadedCss[key]){ if (callback)callback(_loadedCss[key]); return; }

    var success = function(xhr){
        var cssText = xhr.responseText;
        try{
            if (cssText){
                if (op.dom){
                    var rex = new RegExp("(.+)(?=\\{)", "g");
                    var match;
                    while ((match = rex.exec(cssText)) !== null) {
                        var prefix = "." + uuid + " ";
                        var rule = prefix + match[0];
                        cssText = cssText.substring(0, match.index) + rule + cssText.substring(rex.lastIndex, cssText.length);
                        rex.lastIndex = rex.lastIndex + prefix.length;
                    }
                }
                var style = op.doc.createElement("style");
                style.setAttribute("type", "text/css");
                var head = (op.doc.head || op.doc.getElementsByTagName("head")[0] || op.doc.documentElement);
                head.appendChild(style);
                if(style.styleSheet){
                    var setFunc = function(){
                        style.styleSheet.cssText = cssText;
                    };
                    if(style.styleSheet.disabled){
                        setTimeout(setFunc, 10);
                    }else{
                        setFunc();
                    }
                }else{
                    var cssTextNode = op.doc.createTextNode(cssText);
                    style.appendChild(cssTextNode);
                }
            }
            style.id = uid;
            var styleObj = {"module": module, "id": uid, "style": style, "doc": op.doc};
            _loadedCss[key] = styleObj;
            if (callback) callback(styleObj);
        }catch (e){
            if (callback) callback();
            return;
        }
    };
    var failure = function(xhr){
        console.log("Error: load css module: "+module);
        if (callback) callback();
    };
    _xhr_get(url, success, failure);
};

var _parseDomString = function(dom, fn, sourceDoc){
    var doc = sourceDoc || document;
    var list = doc.querySelectorAll(dom);
    if (list.length) for (var i=0; i<list.length; i++) _parseDomElement(list[i], fn);
};
var _parseDomElement = function(dom, fn){
    if (fn) fn(dom);
};
var _parseDom = function(dom, fn, sourceDoc){
    var domType = _typeOf(dom);
    if (domType==="string") _parseDomString(dom, fn, sourceDoc);
    if (domType==="element") _parseDomElement(dom, fn);
    if (domType==="array") for (var i=0; i<dom.length; i++) _parseDom(dom[i], fn, sourceDoc);
};
var _loadCss = function(modules, options, callback){
    var ms = (_typeOf(modules)==="array") ? modules : [modules];
    var op =  (_typeOf(options)==="object") ? _getCssOptions(options) : _getCssOptions(null);
    var cb = (_typeOf(options)==="function") ? options : callback;

    var uuid = "css"+_uuid();
    if (op.dom) _parseDom(op.dom, function(node){ node.className += ((node.className) ? " "+uuid : uuid)}, op.doc);

    var thisLoaded = [];
    if (op.sequence){
        _loadSequence(ms, cb, op, 0, thisLoaded, _loadSingleCss, uuid);
    }else{
        _loadDisarray(ms, cb, op, thisLoaded, _loadSingleCss, uuid);
    }
};
var _remove = function(module){
    var k = encodeURIComponent(module);
    var removeCss = _loadedCss[k];
    if (!removeCss) for (key in _loadedCss){
        if (_loadedCss[key].id==module){
            removeCss = _loadedCss[key];
            k = key;
            break;
        }
    }
    if (removeCss){
        delete _loadedCss[k];
        var styleNode = removeCss.doc.getElementById(removeCss.id);
        if (styleNode) styleNode.parentNode.removeChild(styleNode);
        removeCss = null;
    }
};

require.css = _loadCss;
require.css.remove = _remove;

Element.prototype.loadCss = function(modules, options, callback){
    var op =  (_typeOf(options)==="object") ? options : {};
    var cb = (_typeOf(options)==="function") ? options : callback;
    op.dom = this;
    _loadCss(modules, op, cb);
};