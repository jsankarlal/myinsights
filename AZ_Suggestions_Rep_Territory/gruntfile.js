
/*build commands
    devlopment build --> grunt || grunt dev
    watch --> grunt watch
    production build --> grunt prod
*/

module.exports = function(grunt) {
    var scriptPath = 'js/';
    var customScript = [
        scriptPath + 'util.js',
        scriptPath + 'queries.js',
 //       scriptPath + 'customWidgets.js',
        scriptPath + 'script.js',
        scriptPath + 'hcp.js',
        scriptPath + 'suggestion.js'
        
    ];
    
    var libJs = [
        //scriptPath+'polyfill-ie8.js',
        scriptPath + 'lib/jquery.js',
        scriptPath + 'lib/bootstrap.js',
      //  scriptPath + 'touch.js',
        scriptPath + 'lib/lodash.js'
		/* 
        scriptPath+'lib/velocity.js',
        scriptPath+'lib/velocity.ui.js',
        scriptPath+'lib/jquery.withinviewport.js',
        scriptPath+'lib/intlTelInput.js',
        scriptPath+'lib/intlTelInpututils.js',
        scriptPath+'lib/summernote.js',
        scriptPath+'lib/picker-date/picker.js',
        scriptPath+'lib/picker-date/picker.date.js',
        scriptPath+'lib/moment.js',
        scriptPath+'lib/jquery.validate.js',
        scriptPath+'lib/openseadragon.min.js' */
    ];
    
	grunt.initConfig({
		uglify: {
			dist: {
				files: {
					'build/js/myinsight.min.js': 'build/js/myinsight.js'
				}
			},
            release: {
                files: {
					'build/jsmin/myinsight.min.js': 'build/js/myinsight.js'
				}
            }
		},
		concat : {
			dist : {
				files: {
					'build/js/myinsight.js': [ libJs, customScript ]
				}
			}
		},
		jscs: {
            src: 'js/*.js',
			options: {
				config: ".jscsrc"
			}
		},
        compass: {                  // Task 
            dist: {                   // Target 
              options: {              // Target options 
                sassDir: 'sass',
                cssDir: 'dist/css',
                environment: 'production'
              }
            },
            dev: {                    // Another target 
              options: {
                sassDir: 'scss',
                cssDir: 'build/css'
              }
            }
          },
		sass: {
            dev: {
				options: {
                    style: 'expanded'
                },
				files: {
                    '/build/css/style.css': '/scss/main.scss'
                }
            },
            prod: {
				options: {
					style: 'compressed'
				},
				files: [{
                    '/build/css/style.min.css': '/scss/main.scss'
                },{
					expand: true,
					cwd: '/scss/custom/themes',
					src: ['*.scss'],
					dest: '/build/css/themes',
					ext: '.min.css'
				}]
			}
		},
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'build/css',
                    src: ['*.css'],
                    dest: 'build/cssmin',
                    ext: '.min.css'
                }]
            }
        },
		watch: {
			scripts: {
				files: ['js/**/*.js', 'scss/**/*.scss', 'scss/*.scss'],
				tasks: ['dev'],
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compass');



	grunt.registerTask('dev', [
		'newer:concat',
		'newer:jscs',
		'sass:dev',
        //'compass:dev',
        'newer:copy:css',
        'newer:copy:js'
	]);
    
    grunt.registerTask('release', [
		'newer:concat',
		'newer:jscs',
        'newer:uglify:release',
		'sass:prod',
        //'compass:dev',
        'newer:cssmin',
        'newer:copy'
	]);
    
	
	grunt.registerTask('prod', [
		'concat',
		'jscs',
		'uglify:dist',
        'sass:prod',
        'cssmin',
        'copy'
	]);
	
	grunt.registerTask('default', ['watch']);
} 