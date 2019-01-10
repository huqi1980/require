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
