module.exports = function (grunt) {

    var APPLICATION_VERSION_NUMBER = "2.0.0"; //This controls the version number in the distribution artifact name

    var currentTime = (new Date()).getTime();

    var APP_DIRECTORY = "";
    var BUILD_STAGING_DIRECTORY = 'build-stage/app/';
    var DISTRIBUTION_DIRECTORY = 'dist/app/';
    var COMPILED_JS_FILENAME = 'main-built.js';
    var SRC_ROOT_DIRECTORY = "app/";
    var DISTRIBUTION_FILENAME = "backbonespa-" + APPLICATION_VERSION_NUMBER + ".tar";//Change tar to ZIP if you are using window machine

    var ENV_PARAM_NAME = "env";
    var CONFIGURED_ENVIRONMENT = grunt.option(ENV_PARAM_NAME);
    var APPLICATION_ENVIRONMENT_TOKEN_REGEX = /\$\{build\.env\}/g;  //This regex is used to match the environment token that is replaced to configure the application.
    var TIMESTAMP_TOKEN_REGEX = /\$\{build\.timestamp\}/g;  //This regex is used to match the environment token that is replaced to configure the application.

    var REQUIRE_CONFIG_PATH = 'start.js';
    //var I18N_NLS_PATH = /(:.*module\/.*\/src\/js\/nls\/(resource|links|tableHeaders))/g;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            compile: {
                options: {
                    baseUrl: BUILD_STAGING_DIRECTORY,
                    mainConfigFile: BUILD_STAGING_DIRECTORY + 'start.js',
                    name: 'start',
                    out: BUILD_STAGING_DIRECTORY + COMPILED_JS_FILENAME,
                    paths: {
                        configBuilder: 'module/common/src/js/ConfigPathBuilder',
                        configuration: 'empty:',  //this path will be set at runtime,
                        envconfig: 'empty:'
                    },
                    optimize: 'uglify2',
                    findNestedDependencies: 'true'
                }
            }
        },
        copy: {
            /* "build" copies source files necessary for building into the build staging directory */
            build: {
                files: [
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: [APP_DIRECTORY + 'scripts/**/*.js'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: [APP_DIRECTORY + 'scripts/template/*.html'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: [APP_DIRECTORY + 'scripts/*.js'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: [APP_DIRECTORY + 'start.js'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: [APP_DIRECTORY + 'styles/*.css'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: [APP_DIRECTORY + 'index.html'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: [APP_DIRECTORY + 'img/*'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: '', src: ['routes.js'], dest: 'build-stage'},
                    {expand: true, cwd: '', src: ['server.js'], dest: 'build-stage'},
                    {expand: true, cwd: '', src: ['initial_data.json'], dest: 'build-stage'},
                ]
            },
            /* "dist" copies only the resources required to be deployed from the build staging directory into the distribution directory in their proper location */
            dist: {
                files: [
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'scripts/conf/*.js'], dest: DISTRIBUTION_DIRECTORY},
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'styles/style.css'], dest: DISTRIBUTION_DIRECTORY},
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'img/*'], dest: DISTRIBUTION_DIRECTORY},
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: ['index.html'], dest: DISTRIBUTION_DIRECTORY},
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'scripts/vendors/require.js'], dest: DISTRIBUTION_DIRECTORY},
                    {expand: true, cwd: '', src: ['routes.js'], dest: 'dist'},
                    {expand: true, cwd: '', src: ['server.js'], dest: 'dist'},
                    {expand: true, cwd: '', src: ['initial_data.json'], dest: 'dist'},
                    {   // rename the compiled javascript source and put it in the proper place
                        expand: true,
                        cwd: BUILD_STAGING_DIRECTORY,
                        src: [COMPILED_JS_FILENAME],
                        dest: [DISTRIBUTION_DIRECTORY + APP_DIRECTORY],
                        rename: function (dest, src) {
                            return dest + "start.js";
                        }
                    },
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'scripts/conf/*.js'], dest: DISTRIBUTION_DIRECTORY},
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'index.html'], dest: DISTRIBUTION_DIRECTORY}
                    //need following files since the path is determined at runtime
                ]
            },
            'module-local': {
                files:[
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: ['scripts/**/*'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: ['styles/*'], dest: BUILD_STAGING_DIRECTORY},
                    {expand: true, cwd: SRC_ROOT_DIRECTORY, src: ['*.html'], dest: BUILD_STAGING_DIRECTORY}
                ]

            },
            'module-dist': {
                files: [
                    //{expand: true, cwd: SRC_ROOT_DIRECTORY, src: ['scripts/**/*', '!scripts/**/nls/**/*.js'], dest: BUILD_STAGING_DIRECTORY},
                ]
            }
        },
        clean: {
            main: [
                'build-stage',
                'dist'
            ]
        }
            ,
        compress: {
            main: {
                options: {
                    archive: DISTRIBUTION_DIRECTORY + DISTRIBUTION_FILENAME
                },
                files: [
                    {expand: true, cwd: DISTRIBUTION_DIRECTORY, src: ['**'], dest: ''} // makes all src relative to cwd
                ]
            }
        },
        concat: { 
            css: { 
                src: [BUILD_STAGING_DIRECTORY+'styles/style.css',BUILD_STAGING_DIRECTORY+'styles/harmony.css'], 
                dest: BUILD_STAGING_DIRECTORY+'styles/style.css'
            }
        },
        cssmin : {
            minify: {
                expand: true,
                cwd: BUILD_STAGING_DIRECTORY+'styles',
                src: ['*.css'],
                dest: BUILD_STAGING_DIRECTORY+'styles',
                ext: '.css'
          }
        },
        "string-replace": { //replaces tokens at build-time.  Note this must run before optimization or our configuration mechanism will not work.
            dist: {
                files: [
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'start.js'], dest: BUILD_STAGING_DIRECTORY}, 
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'index.html'], dest: BUILD_STAGING_DIRECTORY}//,  //replace timestamp tokens in-place in index.html
                    ],
                options: {
                    replacements: [
                        {
                            pattern: APPLICATION_ENVIRONMENT_TOKEN_REGEX,
                            replacement: CONFIGURED_ENVIRONMENT !== undefined ? CONFIGURED_ENVIRONMENT : "${build.env}"
                        },
                        {
                            pattern: TIMESTAMP_TOKEN_REGEX,
                            replacement: "." + currentTime  //add the timestamp for distribution builds
                        }
                    ]
                }
            },
            dev: {
                files: [
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + '/start.js'], dest: BUILD_STAGING_DIRECTORY}, 
                    {expand: true, cwd: BUILD_STAGING_DIRECTORY, src: [APP_DIRECTORY + 'index.html'], dest: BUILD_STAGING_DIRECTORY}
                    ],
                options: {
                    replacements: [
                        {
                            pattern: APPLICATION_ENVIRONMENT_TOKEN_REGEX,
                            replacement: CONFIGURED_ENVIRONMENT !== undefined ? CONFIGURED_ENVIRONMENT : "${build.env}"
                        },
                        {
                            pattern: TIMESTAMP_TOKEN_REGEX,
                            replacement: '' //no timestamp for dev builds
                        }
                    ]
                }
            },
            
        },
        watch: {
            sass: {  //watch for changes to scss files to trigger compass compilation
                files: SRC_ROOT_DIRECTORY + '**/*.scss',
                tasks: ['sync:sass', 'compass:dev']
            },
            js: {  //watch for changes to js files to trigger the copying of changed files to the build staging directory
                files: ['scripts/**/*.js', 'start.js',  SRC_ROOT_DIRECTORY + 'scripts/*.js'],
                tasks: ['sync:js', 'string-replace:dev']
            },
            html: {  //watch for changes to html files to trigger the copying of changed files to the build staging directory
                files: ['scripts/template/*.html', SRC_ROOT_DIRECTORY + 'scripts/template/*.html'],
                tasks: ['sync:html']
            }
        },
        sync: {    //use sync to copy modified scss files from the source to the build staging dirs.  sync is like copy but only moves modified files.
            sass: {
                files: [
                    { cwd: SRC_ROOT_DIRECTORY, src: APP_DIRECTORY + 'styles/*.scss', dest: BUILD_STAGING_DIRECTORY },
                    { cwd: SRC_ROOT_DIRECTORY, src: ['styles/*.scss'], dest: BUILD_STAGING_DIRECTORY}
                ]
            },
            js: {   //sync source js file changes with the build staging directory.  changes to library files are not synced and require a rebuild.
                files: [
                    { cwd: SRC_ROOT_DIRECTORY, src: APP_DIRECTORY + 'scripts/**/*.js', dest: BUILD_STAGING_DIRECTORY },
                    { cwd: SRC_ROOT_DIRECTORY, src: APP_DIRECTORY + 'start.js', dest: BUILD_STAGING_DIRECTORY },
                    { cwd: SRC_ROOT_DIRECTORY, src: ['scripts/*.js'], dest: BUILD_STAGING_DIRECTORY}

                ]
            },
            html: {   //sync source js file changes with the build staging directory.  changes to library files are not synced and require a rebuild.
                files: [
                    { cwd: SRC_ROOT_DIRECTORY, src: APP_DIRECTORY + 'vmwas/template/*.html', dest: BUILD_STAGING_DIRECTORY }
                ]
            }
        },
        /*karma: {    //run unit tests and code coverage
            options: {
                configFile: 'karma.conf.js',
                coverageReporter: {
                    dir : APP_DIRECTORY + COVERAGE_DIRECTORY  //need full path because Karma's working directory is the SRC_ROOT_DIRECTORY
                }
            },
            dev: {   //produce html results for dev
                coverageReporter: {
                    type : 'html'
                }
            },
            ci: {   //produce cobertura results for CI
                reporters: ['coverage'],
                coverageReporter: {
                    type : 'cobertura'
                }
            }
        }*/
       
        
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sync');
    //grunt.loadNpmTasks('grunt-karma');

   //"default" outputs a runnable, non-optimized application to the build staging directory, useful for development.  The environment is configured according to the "env" parameter from the command line.
    grunt.registerTask('default', 'create runnable, non-optimized application in staging directory', function () {
        console.log("Creating runnable, non-optimized application in '" + BUILD_STAGING_DIRECTORY + "'.");
        grunt.task.run('clean', 'stage-build','concat', 'copy:module-local', 'string-replace:dev');
    });

    //"distribute" outputs an optimized, distributable application to the distribution directory.  The environment is configured according to the "env" parameter from the command line.
    grunt.registerTask('distribute', 'Prepare a distribution package', function () {
        console.log("Creating application distribution.");
        grunt.task.run('clean', 'stage-build','concat','copy:module-dist', 'string-replace:dist', 'requirejs', 'create-distribution');
    });

    grunt.registerTask('code-coverage', 'Run code coverage for the CI system.', function() {
        grunt.task.run('clean:coverage', 'karma:ci');
    });

    grunt.registerTask('stage-build', 'Stage the build in the ' + BUILD_STAGING_DIRECTORY + ' directory.', function() {
        console.log('Staging build in the ' + BUILD_STAGING_DIRECTORY + ' directory.');
        grunt.task.run("copy:build");
    });

    grunt.registerTask('create-distribution', 'Create the optimized, distributable application in the ' + DISTRIBUTION_DIRECTORY + ' directory.', function() {
        console.log('Creating distribution in the ' + DISTRIBUTION_DIRECTORY + ' directory.');
        grunt.task.run('copy:dist', 'compress');
    });
};

