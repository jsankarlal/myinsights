
/*build commands
    devlopment build --> grunt || grunt dev
    watch --> grunt watch
    production build --> grunt prod
*/

module.exports = function(grunt){
    var scriptPath = 'js/';
    var customScript = [
        scriptPath+'util.js',
        scriptPath+'queries.js',
        scriptPath+'customWidgets.js',
        scriptPath+'script.js'
    ];
    
    var libJs = [
        //scriptPath+'polyfill-ie8.js',
        scriptPath+'lib/jquery.js',
        scriptPath+'lib/bootstrap.js',
        scriptPath+'touch.js',
        scriptPath+'lib/lodash.js',
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
        scriptPath+'lib/openseadragon.min.js'
    ];
    
	grunt.initConfig({
		uglify: {
			dist: {
				files: {
					'build/js/multibrand.min.js': 'build/js/multibrand.js'
				}
			},
            release: {
                files: {
					'build/jsmin/multibrand.min.js': 'build/js/multibrand.js'
				}
            }
		},
		concat : {
			dist : {
				files: {
					'../../digital-code/ui.apps/src/main/content/jcr_root/etc/designs/digital/globaljs/js/multibrand.js': [ libJs, customScript ],
					'build/js/multibrand.js': [ libJs, customScript ]
				}
			}
		},
		jscs: {
            src: 'js/*.js',
			options: {
				config: ".jscsrc"
			}
		},
		sass: {
            dev: {
                options: {
                    sourceMap: 'sass',
					outputStyle: 'expanded'
				},
                files: [{
                    'build/css/style.css': 'scss/main.scss'
                },{
                    expand: 'true',
                    cwd: 'scss/custom/themes',
                    src: '*.scss',
                    dest: 'build/css/themes',
                    ext: '.css'
                }]
            },
            prod: {
				options: {
					outputStyle: 'compressed'
				},
                files: [{
                    'build/css/style.min.css': 'scss/main.scss'
                },{
                    expand: 'true',
                    cwd: 'scss/custom/themes',
                    src: '*.scss',
                    dest: 'build/css/themes',
                    ext: '.min.css'
                }]
			},
            release: {
                
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
        copy: {
            css: {
                files: [{
                    expand: true, 
                    cwd: 'build/css/',
                    src: ['**'],
                    dest: '../../digital-code/ui.apps/src/main/content/jcr_root/etc/designs/digital/globalcss/css/'
                }]
            },
            js: {
                files: [{
                    expand: true, 
                    cwd: 'build/js/',
                    src: ['**'],
                    dest: '../../digital-code/ui.apps/src/main/content/jcr_root/etc/designs/digital/globaljs/js/'
                }]
            },
            cssmin: {
                expand: true, 
                cwd: 'build/cssmin/',
                src: ['**'],
                dest: '../../digital-code/ui.apps/src/main/content/jcr_root/etc/designs/digital/globalmincss/css/'
            },
            jsmin: {
                expand: true, 
                cwd: 'build/jsmin/',
                src: ['**'],
                dest: '../../digital-code/ui.apps/src/main/content/jcr_root/etc/designs/digital/globalminjs/js/'
            }
        },
		watch: {
			scripts: {
				files: ['js/**/*.js', 'scss/**/*.scss'],
				tasks: ['dev'],
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');



	grunt.registerTask('dev', [
		'newer:concat',
		'newer:jscs',
		'sass:dev',
        'newer:copy:css',
        'newer:copy:js'
	]);
    
    grunt.registerTask('release', [
		'newer:concat',
		'newer:jscs',
        'newer:uglify:release',
		'sass:dev',
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