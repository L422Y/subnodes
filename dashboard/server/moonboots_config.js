var Moonboots = require('moonboots-express')
    ,stylizer = require('stylizer')
    ,templatizer = require('templatizer')
    ,path = require('path');
    

// a little helper for fixing paths for various environments
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};

var MoonbootsCfg = function(options) {

    var self = this;

    self.app = options.app;
    self.config = options.config;

    self.init = function() {

        return new Moonboots({
        	moonboots: {
                jsFileName: 'app',
                cssFileName: 'app',
                main: fixPath('dashboard/public/js/dashboard.js'),
                developmentMode: self.config.isDev,
                libraries: [
                ],
                stylesheets: [
                    fixPath('dashboard/public/css/bootstrap.css'),
                    fixPath('dashboard/public/css/dashboard.css')
                ],
                browserify: {
                    debug: false
                },
                beforeBuildJS: function () {
                    // This re-builds our template files from jade each time the app's main
                    // js file is requested. Which means you can seamlessly change jade and
                    // refresh in your browser to get new templates.
                    if (self.config.isDev) {
                        templatizer(fixPath('dashboard/server/templates'), fixPath('dashboard/public/js/templates.js'));
                    }
                },
                beforeBuildCSS: function (done) {
                    // This re-builds css from stylus each time the app's main
                    // css file is requested. Which means you can seamlessly change stylus files
                    // and see new styles on refresh.
                    if (self.config.isDev) {
                        stylizer({
                            infile: fixPath('dashboard/public/css/dashboard.styl'),
                            outfile: fixPath('dashboard/public/css/dashboard.css'),
                            development: true
                        }, done);
                    } else {
                        done();
                    }
                }
            },
            server: self.app
        });
    }
}

module.exports = MoonbootsCfg;