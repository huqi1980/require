describe('require_js: ', function() {
    beforeEach(function(done) {
        text="";
        require.js.clear();
        done();
    });

    it('Load Javascript default', function(done) {
        require.js("/base/test/res/test.js", function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
            expect(text).toEqual('my name is test.js');
        });
    });

    it('Load Javascript default', function(done) {
        require.js(["/base/test/res/test.js", "/base/test/res/test2.js"], function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
            expect(text2).toEqual('my name is test2.js');
        });
    });

    it('Load Javascript error', function(done) {
        require.js("/base/test/res/test1.js", function(s){
            done();
            expect(s.length).toEqual(0);
        });
    });

    it('Load Javascript true-true', function(done) {
        require.js("/base/test/res/test.js", {"reload": true, "noCache": true}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
            expect(text).toEqual('my name is test.js');
        });
    });
    it('Load Javascript false-true', function(done) {
        require.js("/base/test/res/test.js", {"reload": false, "noCache": true}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
            expect(text).toEqual('my name is test.js');
        });
    });
    it('Load Javascript true-false', function(done) {
        require.js("/base/test/res/test.js", {"reload": true, "noCache": false}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
            expect(text).toEqual('my name is test.js');
        });
    });
    it('Load Javascript false-false', function(done) {
        require.js("/base/test/res/test.js", {"reload": false, "noCache": false}, function(s){
            done();
            expect(s.length).toBeGreaterThan(0);
            expect(text).toEqual('my name is test.js');
        });
    });

});