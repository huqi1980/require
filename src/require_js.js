var _loaded = {};
var _getJsOptions = function(options){
    return {
        "noCache": !!(options && options.nocache),
        "reload": !!(options && options.reload),
        "doc": (options && options.doc) || document
    }
};
var _loadSingle = function(module, callback, op){
    var url = module;
    var uuid = _uuid();
    if (op.noCache) url = (url.indexOf("?")!==-1) ? url+"&v="+uuid : addr_uri+"?v="+uuid;
    var key = encodeURIComponent(url);
    if (!op.reload) if (_loaded[key]){ if (callback)callback(); return; }

    var head = (op.doc.head || op.doc.getElementsByTagName("head")[0] || op.doc.documentElement);
    var s = op.doc.createElement('script');
    head.appendChild(s);
    s.id = uuid;
    s.src = url;

    var _checkScriptLoaded = function(_, isAbort, err){
        if (isAbort || !s.readyState || s.readyState === "loaded" || s.readyState === "complete") {
            var scriptObj = {"module": "module", "id": uuid, "script": s, "doc": op.doc};
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

    var count=0;
    var thisLoaded = [];
    for (var i=0; i<ms.length; i++){
        _loadSingle(ms[i], function(script){
            if (script) thisLoaded.push(script);
            count++;
            if (count===ms.length) if (cb) cb(thisLoaded);
        }, op);
    }
};
require.js = _load;
require.js.clear = function(){
    _loaded = null;
    _loaded = {};
};