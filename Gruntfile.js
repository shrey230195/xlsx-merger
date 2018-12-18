module.exports = function(grunt) {

    // Project configuration.
    grunt.loadNpmTasks('grunt-build-control');
    var pkg = require('./package.json');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					'dist/js/app.min.js': ['src/js/**/*.js']
				}
			}
		},
		bower_concat: {
			all: {
				dest: 'dist/js/dependencies.js',
				cssDest: 'dist/css/dependencies.css',
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'dist/css/app.min.css': ['src/css/*.css']
				}
			}
		},
		processhtml: {
			dist: {
				files: {
					'dist/index.html': ['src/index.html','src/partials/*.html']
				}
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, flatten: true, src: ['src/partials/*', 'src/img/*', 'src/fonts/*'], dest: 'dist/partials', filter: 'isFile'},
					{expand: true, flatten: true, src: ['src/css/bootstrap.min.css'], dest: 'dist/css', filter: 'isFile'}
				],
			},
		},
		less: {
			development: {   
				options: {
					paths: ['src/less']
				},
				// target name
				files: [{
					// no need for files, the config below should work
					expand: true,
					cwd:    'src/less',
					src:    "*.less",
					dest: 'src/css',
					ext:    ".css"
				}]
			}
		},
		connect: {
			dev: {
				options: {
					port: 9000,
					base: {
						path: 'src',
						options: {
							index: 'index.html',
							maxAge: 300000
						}
					}
				}
			},
			dist: {
				options: {
					port: 8000,
					base: {
						path: 'dist',
						options: {
							index: 'index.html',
							maxAge: 300000
						}
					}
				}
			}
		},
		open : {
			dev : {
				path: 'http://localhost:9000',
				app: 'chrome'
			},
			dist : {
				path: 'http://localhost:8000',
				app: 'chrome'
			}
		},
		watch: {
			client: {
				// '**' is used to include all subdirectories
				// and subdirectories of subdirectories, and so on, recursively.
				files: ['src/**/*'],
				tasks:['less', 'bower_concat', 'cssmin', 'copy', 'processhtml'],
				options: {
					livereload: true
				}
			}
		},
		buildcontrol: {
	      options: {
	        dir: 'src',
	        commit: true,
	        push: true,
	        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
	      },
	      pages: {
	        options: {
	          remote: 'git@github.com:shrey230195/xlsx-merger.git',
	          branch: 'gh-pages'
	        }
	      },
	      local: {
	        options: {
	          remote: '../',
	          branch: 'build'
	        }
	      }
	    }
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-open');

	// Default task(s).
	grunt.registerTask('default', ['connect:dev', 'open:dev', 'watch:client']);
	grunt.registerTask('watch-dist', ['connect:dist', 'open:dist', 'watch:client']);
	grunt.registerTask('dist', ['less', 'uglify', 'bower_concat', 'cssmin', 'copy', 'processhtml']);

};