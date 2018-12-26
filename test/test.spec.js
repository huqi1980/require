describe('index.js: ', function() {
    it('Load Javascript', function() {
        require.js("test.js", function(){
            console.log('Load js 1');
        });
        require.js("test.js", {"reload": true, "noCache": true}, function(){
            console.log('Load js 2');
        });
        require.js("test.js", {"reload": false, "noCache": true}, function(){
            console.log('Load js 3');
        });
        require.js("test.js", {"reload": true, "noCache": false}, function(){
            console.log('Load js 4');
        });
        require.js("test.js", {"reload": false, "noCache": false}, function(){
            console.log('Load js 5');
        });

    });
    it('Load css', function() {
        require.css("test.css", {"dom": document.body}, function(){
            console.log('Load css 1');
        });
        require.css("test.css", {"reload": true, "noCache": true}, function(){
            console.log('Load css 2');
        });
        require.css("test.css", {"reload": false, "noCache": true}, function(){
            console.log('Load css 3');
        });
        require.css("test.css", {"reload": true, "noCache": false}, function(){
            console.log('Load css 4');
        });
        require.css("test.css", {"reload": false, "noCache": false}, function(){
            console.log('Load css 5');
        });
        require.css.remove("test.css");

        document.body.loadCss("test.css");

    });
    it('Load html', function() {
        require.html("test.html", {"dom": document.body}, function(){
            console.log('Load html 1');
        });
        require.html("test.html", {"reload": true, "noCache": true}, function(){
            console.log('Load html 2');
        });
        require.html("test.html", {"reload": true, "noCache": false}, function(){
            console.log('Load html 3');
        });
        require.html("test.html", {"reload": false, "noCache": true}, function(){
            console.log('Load html 4');
        });
        require.html("test.html", {"reload": false, "noCache": false}, function(){
            console.log('Load html 5');
        });
        document.body.loadHtml("test.html");

    });
    it('Load all', function() {
        require({
            "html": "test.html",
            "css": "test.css",
            "js": "test.js"
        }, {
            "dom": document.body
        },function(){
            console.log('Load all 1');
        });

    });
});