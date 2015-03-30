module.exports = function (grunt) {

    var bowerFiles = [
            'bower_components/modernizr/modernizr.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/angular/angular.js',
            'bower_components/json3/lib/json3.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/velocity/jquery.velocity.js',
            'bower_components/ustream-embedapi/src/ustream-embedapi.js',
            'bower_components/materialize/dist/js/materialize.js',
        ],
        appFiles = ['app.js', 'scripts/{,*/}*.js'],
        lessFiles = 'less/{,*/}*.less';

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        concat : {
            vendor : {
                src  : bowerFiles,
                dest : 'build/js/vendor.js'
            },
            app    : {
                src  : appFiles,
                dest : 'build/js/app.js'
            }
        },
        less   : {
            all : {
                files : {
                    'build/css/style.css' : lessFiles
                }
            }
        },
        watch  : {
            options   : {
                interrupt : true,
                spawn     : false
            },
            bower     : {
                files : bowerFiles,
                tasks : ['less', 'concat']
            },
            app       : {
                files : appFiles,
                tasks : ['less', 'concat']
            },
            css       : {
                files : lessFiles,
                tasks : ['less', 'concat']
            },
            gruntfile : {
                files : ['Gruntfile.js'],
                tasks : ['less', 'concat']
            }
        }
    });

    grunt.registerTask('default', ['less', 'concat']);
};
