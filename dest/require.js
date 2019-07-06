(function(){
/****************************************************************************

 The MIT License (MIT)

 Copyright © 2018, Tommy, huqi1980, O2 Team
 All rights reserved.
 https://github.com/huqi1980/require

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included
 in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL T
 HE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
 ****************************************************************************/

var _getAllOptions = function(options){
    var doc = (options && options.doc) || document;
    if (!doc.unid) doc.unid = _uuid();
    return {
        "noCache": !!(options && options.nocache),
        "reload": !!(options && options.reload),
        "sequence": !!(options && options.sequence),
        "doc": (options && options.doc) || document,
        "dom": (options && options.dom) || document.body,
        "position": "beforeend" //'beforebegin' 'afterbegin' 'beforeend' 'afterend'
    }
};
window.require = function(modules, options, callback){
    //var ms = (_typeOf(modules)==="array") ? modules : [modules];
    var op =  (_typeOf(options)==="object") ? _getAllOptions(options) : _getAllOptions(null);
    var cb = (_typeOf(options)==="function") ? options : callback;

    var ms, htmls, styles, sctipts;
    var _htmlLoaded=(!modules.html), _cssLoaded=(!modules.css), _jsLoaded=(!modules.js);
    var _checkloaded = function(){
        if (_htmlLoaded && _cssLoaded && _jsLoaded) if (cb) cb(htmls, styles, sctipts);
    }
    if (modules.html){
        require.html(modules.html, op, function(h){
            htmls = h;
            _htmlLoaded = true;
            _checkloaded();
        });
    }
    if (modules.css){
        require.css(modules.css, op, function(s){
            styles = s;
            _cssLoaded = true;
            _checkloaded();
        });
    }
    if (modules.js){
        require.js(modules.js, op, function(s){
            sctipts = s;
            _jsLoaded = true;
            _checkloaded();
        });
    }
};
var _pick = function(){
    for (var i = 0, l = arguments.length; i < l; i++){
        try {
            arguments[i]();
            return arguments[i];
        } catch (e){}
    }
    return null;
};
var _typeOf = function(item){
    if (item == null) return 'null';
    if (item.$family != null) return item.$family();
    if (item.constructor == window.Array) return "array";

    if (item.nodeName){
        if (item.nodeType == 1) return 'element';
        if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
    } else if (typeof item.length == 'number'){
        if (item.callee) return 'arguments';
    }
    return typeof item;
};
var _addListener = function(dom, type, fn){
    if (type == 'unload'){
        var old = fn, self = this;
        fn = function(){
            _removeListener(dom, 'unload', fn);
            old();
        };
    }
    if (dom.addEventListener) dom.addEventListener(type, fn, !!arguments[2]);
    else dom.attachEvent('on' + type, fn);
};
var _removeListener = function(dom, type, fn){
    if (dom.removeEventListener) dom.removeEventListener(type, fn, !!arguments[2]);
    else dom.detachEvent('on' + type, fn);
};

var _request = (function(){
    var XMLHTTP = function(){ return new XMLHttpRequest(); };
    var MSXML2 = function(){ return new ActiveXObject('MSXML2.XMLHTTP'); };
    var MSXML = function(){ return new ActiveXObject('Microsoft.XMLHTTP'); };
    return _pick(XMLHTTP, MSXML2, MSXML);
})();

var _returnBase = function(number, base) {
    return (number).toString(base).toUpperCase();
};
var _getIntegerBits = function(val, start, end){
    var base16 = _returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '')
            quadString += '0';
        else
            quadString += quadArray[i];
    }
    return quadString;
};
var _rand = function(max) {
    return Math.floor(Math.random() * (max + 1));
};
var _uuid = function(){
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = _getIntegerBits(t, 0, 31);
    var tm = _getIntegerBits(t, 32, 47);
    var thv = _getIntegerBits(t, 48, 59) + '1';
    var csar = _getIntegerBits(_rand(4095), 0, 7);
    var csl = _getIntegerBits(_rand(4095), 0, 7);

    var n = _getIntegerBits(_rand(8191), 0, 7)
        + _getIntegerBits(_rand(8191), 8, 15)
        + _getIntegerBits(_rand(8191), 0, 7)
        + _getIntegerBits(_rand(8191), 8, 15)
        + _getIntegerBits(_rand(8191), 0, 15);
    return tl + tm + thv + csar + csl + n;
};

var _xhr_get = function(url, success, failure, completed){
    var xhr = new _request();
    xhr.open("GET", url, true);

    var _checkCssLoaded= function(_, err){
        if (!(xhr.readyState == 4)) return;
        if (err){
            if (completed) completed(xhr);
            return;
        }

        _removeListener(xhr, 'readystatechange', _checkCssLoaded);
        _removeListener(xhr, 'load', _checkCssLoaded);
        _removeListener(xhr, 'error', _checkCssErrorLoaded);

        if (err) {failure(xhr); return}
        var status = xhr.status;
        status = (status == 1223) ? 204 : status;
        if ((status >= 200 && status < 300))
            success(xhr);
        else if ((status >= 300 && status < 400))
            failure(xhr);
        else
            failure(xhr);
        if (completed) completed(xhr);
    };
    var _checkCssErrorLoaded= function(err){ _checkCssLoaded(err) };

    if ("load" in xhr) _addListener(xhr, "load", _checkCssLoaded);
    if ("error" in xhr) _addListener(xhr, "load", _checkCssErrorLoaded);
    _addListener(xhr, "readystatechange", _checkCssLoaded);
    xhr.send();
}

var _loadSequence = function(ms, cb, op, n, thisLoaded, loadSingle, uuid, fun){
    loadSingle(ms[n], function(module){
        if (module) thisLoaded.push(module);
        n++;
        if (fun) fun(module);
        if (n===ms.length){
            if (cb) cb(thisLoaded);
        }else{
            _loadSequence(ms, cb, op, n, thisLoaded, loadSingle, uuid, fun);
        }
    }, op, uuid);
};
var _loadDisarray = function(ms, cb, op, thisLoaded, loadSingle, uuid, fun){
    var count=0;
    for (var i=0; i<ms.length; i++){
        loadSingle(ms[i], function(module){
            if (module) thisLoaded.push(module);
            count++;
            if (fun) fun(module);
            if (count===ms.length) if (cb) cb(thisLoaded);
        }, op, uuid);
    }
};

var _loadedCss = {};
var _loadCssRunning = {};
var _loadCssQueue = [];

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
    if (_loadCssRunning[key]){
        _loadCssQueue.push(function(){
            _loadSingleCss(module, callback, op, uuid);
        });
        return;
    }

    if (_loadedCss[key]) uuid = _loadedCss[key]["class"];
    if (op.dom) _parseDom(op.dom, function(node){ if (node.className.indexOf(uuid) == -1) node.className += ((node.className) ? " "+uuid : uuid);}, op.doc);

    var completed = function(){
        if (_loadCssRunning[key]){
            _loadCssRunning[key] = false;
            delete _loadCssRunning[key];
        }
        if (_loadCssQueue && _loadCssQueue.length){
            (_loadCssQueue.shift())();
        }
    };

    if (_loadedCss[key])if (!op.reload){
        if (callback)callback(_loadedCss[key]);
        completed();
        return;
    }

    var success = function(xhr){
        var cssText = xhr.responseText;
        try{
            if (cssText){
                if (op.dom){
                    var rex = new RegExp("(.+)(?=\\{)", "g");
                    var match;
                    var prefix = "." + uuid + " ";
                    while ((match = rex.exec(cssText)) !== null) {
                        var rulesStr = match[0];
                        if (rulesStr.indexOf(",")!=-1){
                            var rules = rulesStr.split(/\s*,\s*/g);
                            rules = rules.map(function(r){
                                return prefix + r;
                            });
                            var rule = rules.join(", ");
                            cssText = cssText.substring(0, match.index) + rule + cssText.substring(rex.lastIndex, cssText.length);
                            rex.lastIndex = rex.lastIndex + (prefix.length*rules.length);

                        }else{
                            var rule = prefix + match[0];
                            cssText = cssText.substring(0, match.index) + rule + cssText.substring(rex.lastIndex, cssText.length);
                            rex.lastIndex = rex.lastIndex + prefix.length;
                        }
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
            var styleObj = {"module": module, "id": uid, "style": style, "doc": op.doc, "class": uuid};
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

    _loadCssRunning[key] = true;

    _xhr_get(url, success, failure, completed);
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
var _remove = function(module, doc){
    var thisDoc = doc || document;
    var k = encodeURIComponent(module+(thisDoc.unid||""));
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
var _loadedHtml = {};

var _getHtmlOptions = function(options){
    var doc = (options && options.doc) || document;
    if (!doc.unid) doc.unid = _uuid();
    return {
        "noCache": !!(options && options.nocache),
        "reload": !!(options && options.reload),
        "sequence": !!(options && options.sequence),
        "doc": (options && options.doc) || document,
        "dom": (options && options.dom) || null,
        "position": "beforeend" //'beforebegin' 'afterbegin' 'beforeend' 'afterend'
    }
};
_loadSingleHtml = function(module, callback, op){
    var url = module;
    var uid = _uuid();
    if (op.noCache) url = (url.indexOf("?")!==-1) ? url+"&v="+uid : url+"?v="+uid;
    var key = encodeURIComponent(url+op.doc.unid);
    if (!op.reload) if (_loadedHtml[key]){ if (callback)callback(_loadedHtml[key]); return; }

    var success = function(xhr){
        var htmlObj = {"module": module, "id": uid, "data": xhr.responseText, "doc": op.doc};
        _loadedHtml[key] = htmlObj;
        if (callback) callback(htmlObj);
    };
    var failure = function(){
        console.log("Error: load html module: "+module);
        if (callback) callback();
    };
    _xhr_get(url, success, failure);
};

var _injectHtml = function(op, data){
    if (op.dom) _parseDom(op.dom, function(node){ node.insertAdjacentHTML(op.position, data) }, op.doc);
};
var _loadHtml = function(modules, options, callback){
    var ms = (_typeOf(modules)==="array") ? modules : [modules];
    var op =  (_typeOf(options)==="object") ? _getHtmlOptions(options) : _getHtmlOptions(null);
    var cb = (_typeOf(options)==="function") ? options : callback;

    //var count = 0;
    var thisLoaded = [];
    if (op.sequence){
        _loadSequence(ms, cb, op, 0, thisLoaded, _loadSingleHtml, null, function(html){ if (html) _injectHtml(op, html.data ); });
    }else{
        _loadDisarray(ms, cb, op, thisLoaded, _loadSingleHtml, null, function(html){ if (html) _injectHtml(op, html.data ); });
    }

    // for (var i=0; i<ms.length; i++){
    //     _loadSingleHtml(ms[i], function(html){
    //         if (html){
    //             thisLoaded.push(html);
    //             if (op.dom) _parseDom(op.dom, function(node){ node.insertAdjacentHTML(op.position, html.data) }, op.doc);
    //         }
    //         count++;
    //         if (count===ms.length) if (cb) cb(thisLoaded);
    //     }, op);
    // }
};
require.html = _loadHtml;

Element.prototype.loadHtml = function(modules, options, callback){
    var op =  (_typeOf(options)==="object") ? options : {};
    var cb = (_typeOf(options)==="function") ? options : callback;
    op.dom = this;
    _loadHtml(modules, op, cb);
};
require.html.clear = function(){
    _loadedHtml = null;
    _loadedHtml = {};
};
var _loaded = {};
var _getJsOptions = function(options){
    var doc = (options && options.doc) || document;
    if (!doc.unid) doc.unid = _uuid();
    return {
        "noCache": !!(options && options.nocache),
        "reload": !!(options && options.reload),
        "sequence": !!(options && options.sequence),
        "doc": (options && options.doc) || document
    }
};
var _loadSingle = function(module, callback, op){
    var url = module;
    var uuid = _uuid();
    if (op.noCache) url = (url.indexOf("?")!==-1) ? url+"&v="+uuid : addr_uri+"?v="+uuid;
    var key = encodeURIComponent(url+op.doc.unid);
    if (!op.reload) if (_loaded[key]){ if (callback)callback(); return; }

    var head = (op.doc.head || op.doc.getElementsByTagName("head")[0] || op.doc.documentElement);
    var s = op.doc.createElement('script');
    head.appendChild(s);
    s.id = uuid;
    s.src = url;

    var _checkScriptLoaded = function(_, isAbort, err){
        if (isAbort || !s.readyState || s.readyState === "loaded" || s.readyState === "complete") {
            var scriptObj = {"module": module, "id": uuid, "script": s, "doc": op.doc};
            if (!err) _loaded[key] = scriptObj;
            _removeListener(s, 'readystatechange', _checkScriptLoaded);
            _removeListener(s, 'load', _checkScriptLoaded);
            _removeListener(s, 'error', _checkScriptErrorLoaded);
            if (!isAbort || err){
                if (err){
                    if (s) head.removeChild(s);
                    if (callback)callback();
                }else{
                    head.removeChild(s);
                    if (callback)callback(scriptObj);
                }
            }
        }
    };
    var _checkScriptErrorLoaded = function(e, err){
        console.log("Error: load javascript module: "+module);
        _checkScriptLoaded(e, true, "error");
    };

    if ('onreadystatechange' in s) _addListener(s, 'readystatechange', _checkScriptLoaded);
    _addListener(s, 'load', _checkScriptLoaded);
    _addListener(s, 'error', _checkScriptErrorLoaded);
};

var _load = function(modules, options, callback){
    var ms = (_typeOf(modules)==="array") ? modules : [modules];
    var op =  (_typeOf(options)==="object") ? _getJsOptions(options) : _getJsOptions(null);
    var cb = (_typeOf(options)==="function") ? options : callback;

    var thisLoaded = [];
    if (op.sequence){
        _loadSequence(ms, cb, op, 0, thisLoaded, _loadSingle);
    }else{
        _loadDisarray(ms, cb, op, thisLoaded, _loadSingle);
    }
};
require.js = _load;
require.js.clear = function(){
    _loaded = null;
    _loaded = {};
};
})();