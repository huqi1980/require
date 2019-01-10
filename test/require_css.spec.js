describe('require_css: ', function() {
    beforeEach(function(done) {
        require.css.remove('/base/test/res/test.css');
        done();
    });

    it('Load css default', function(done) {
        require.css("/base/test/res/test.css", function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
        });
    });
    it('Load css error', function(done) {
        require.css("/base/test/res/test1.css", function(s){
            done();
            expect(s.length).toEqual(0);
        });
    });
    it('Load css dom', function(done) {
        require.css("/base/test/res/test.css", {"dom": document.body}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
        });
    });
    it('Load css true-true', function(done) {
        require.css("/base/test/res/test.css", {"reload": true, "noCache": true}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
        });
    });
    it('Load css true-false', function(done) {
        require.css("/base/test/res/test.css", {"reload": true, "noCache": false}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
        });
    });
    it('Load css false-true', function(done) {
        require.css("/base/test/res/test.css", {"reload": false, "noCache": true}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
        });
    });
    it('Load css false-false', function(done) {
        require.css("/base/test/res/test.css", {"reload": false, "noCache": false}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
        });
    });
    it('Load css node', function(done) {
        document.body.loadCss("/base/test/res/test.css", {"reload": false, "noCache": false}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
        });
    });
    it('Load css remove', function(done) {
        document.body.loadCss("/base/test/res/test.css");
        done();
    });
});