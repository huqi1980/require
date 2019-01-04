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