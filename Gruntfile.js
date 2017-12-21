module.exports = function(grunt) {

    // load .env file
    require('dotenv').config({silent: true});
    var localDomain = process.env.LOCAL_DOMAIN ? process.env.LOCAL_DOMAIN : 'amnesty.localhost';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        compass: {
            dev: {
                options: {
                    config: 'config.rb',
                    force: true
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'css/runner.min.css': [
                        'css/runner.css'
                    ]
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'IE >= 8'],
                map: true
            },
            my_target: {
                src: ['css/*.css']
            }
        },
        watch: {
            sass: {
                files: ['sass/*.scss'],
                tasks: ['compass:dev','autoprefixer']
            },

        },
        browserSync: {
            bsFiles: {
                src : [
                    'js/*.min.js',
                    'css/*.css'
                ]
            },
            options: {
                watchTask: true,
                proxy: localDomain
            }
        }

    });

    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', ['compass', 'autoprefixer', 'concat', 'uglify']);

}
