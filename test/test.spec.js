describe('index.js: ', function() {
    it('Load Javascript', function() {
        require.js("/base/dest/demo/test.js", function(){
            console.log('Load js 1');
        });
        require.js("/base/dest/demo/test1.js", function(){
            console.log('Load js 1');
        });
        require.js("/base/dest/demo/test.js", {"reload": true, "noCache": true}, function(){
            console.log('Load js 2');
        });
        require.js("/base/dest/demo/test.js", {"reload": false, "noCache": true}, function(){
            console.log('Load js 3');
        });
        require.js("/base/dest/demo/test.js", {"reload": true, "noCache": false}, function(){
            console.log('Load js 4');
        });
        require.js("/base/dest/demo/test.js", {"reload": false, "noCache": false}, function(){
            console.log('Load js 5');
        });

    });
    it('Load css', function() {
        require.css("/base/dest/demo/test1.css", {"dom": document.body}, function(){
            console.log('Load css 1');
        });
        require.css("/base/dest/demo/test.css", {"dom": document.body}, function(){
            console.log('Load css 1');
        });
        require.css("/base/dest/demo/test.css", {"reload": true, "noCache": true}, function(){
            console.log('Load css 2');
        });
        require.css("/base/dest/demo/test.css", {"reload": false, "noCache": true}, function(){
            console.log('Load css 3');
        });
        require.css("/base/dest/demo/test.css", {"reload": true, "noCache": false}, function(){
            console.log('Load css 4');
        });
        require.css("/base/dest/demo/test.css", {"reload": false, "noCache": false}, function(){
            console.log('Load css 5');
        });
        require.css.remove("/base/dest/demo/test.css");

        document.body.loadCss("/base/dest/demo/test.css");

    });
    it('Load html', function() {
        require.html("/base/dest/demo/test1.html", {"dom": document.body}, function(){
            console.log('Load html 1');
        });
        require.html("/base/dest/demo/test.html", {"dom": document.body}, function(){
            console.log('Load html 1');
        });
        require.html("/base/dest/demo/test.html", {"reload": true, "noCache": true}, function(){
            console.log('Load html 2');
        });
        require.html("/base/dest/demo/test.html", {"reload": true, "noCache": false}, function(){
            console.log('Load html 3');
        });
        require.html("/base/dest/demo/test.html", {"reload": false, "noCache": true}, function(){
            console.log('Load html 4');
        });
        require.html("/base/dest/demo/test.html", {"reload": false, "noCache": false}, function(){
            console.log('Load html 5');
        });
        document.body.loadHtml("/base/dest/demo/test.html");

    });
    it('Load all', function() {
        require({
            "html": "/base/dest/demo/test.html",
            "css": "/base/dest/demo/test.css",
            "js": "/base/dest/demo/test.js"
        }, {
            "dom": document.body
        },function(){
            console.log('Load all 1');
        });

    });
});