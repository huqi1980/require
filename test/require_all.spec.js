describe('require_css: ', function() {
    beforeEach(function(done) {
        require.html.clear();
        require.js.clear();
        test="";
        done();
    });

    it('Load all', function(done) {
        require({
            "html": "/base/test/res/test.html",
            "css": "/base/test/res/test.css",
            "js": "/base/test/res/test.js"
        }, {
            "dom": document.body
        },function(h, c, s){
            done();
            expect(h.length).toBeGreaterThan(0);
            expect(c.length).toBeGreaterThan(0);
            expect(s.length).toBeGreaterThan(0);
            expect(text).toEqual('my name is test.js');
        });

    });
});