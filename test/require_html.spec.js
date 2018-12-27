describe('require_css: ', function() {
    beforeEach(function(done) {
        require.html.clear();
        done();
    });

    it('Load html default', function(done) {
        require.html("/base/test/res/test.html", {"dom": document.body}, function(h){
            done();
            expect(h.length).toBeGreaterThan(0);
        });
    });
    it('Load html error', function(done) {
        require.html("/base/test/res/test1.html", {"dom": document.body}, function(h){
            done();
            expect(h.length).toEqual(0);
        });
    });
    it('Load html true-true', function(done) {
        require.html("/base/test/res/test.html", {"dom": document.body, "reload": true, "noCache": true}, function(h){
            done();
            expect(h.length).toBeGreaterThan(0);
        });
    });
    it('Load html true-false', function(done) {
        require.html("/base/test/res/test.html", {"dom": document.body, "reload": true, "noCache": false}, function(h){
            done();
            expect(h.length).toBeGreaterThan(0);
        });
    });
    it('Load html false-true', function(done) {
        require.html("/base/test/res/test.html", {"dom": document.body, "reload": false, "noCache": true}, function(h){
            done();
            expect(h.length).toBeGreaterThan(0);
        });
    });
    it('Load html false-false', function(done) {
        require.html("/base/test/res/test.html", {"dom": document.body, "reload": false, "noCache": false}, function(h){
            done();
            expect(h.length).toBeGreaterThan(0);
        });
    });
    it('Load html node', function(done) {
        document.body.loadHtml("/base/test/res/test.html", {"reload": false, "noCache": false}, function(h){
            done();
            expect(h.length).toBeGreaterThan(0);
        });
    });
});