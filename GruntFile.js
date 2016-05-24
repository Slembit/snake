module.exports = function(grunt) {
	//npm install grunt-contrib-uglify --save-dev
	// sudo npm install grunt --save-dev

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/* SASS */
		sass: {
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none',
					precision: 2,
					update: true
				},
				files: {
					// målfil : källfil
					'css/style.css' : 'src/scss/style.scss'
				}
			}
		},
		//post (efter) css
		postcss:{
			options:{
				map: false,
				proccessors: [
				require('autoprefixer')({browsers: 'last 2 versions'}), 
				require('cssnano')()
				]
			},
			dist: {
				src: 'css/*.css'
			}
		},

		//jscs

		jscs: {
			src: 'src/js/*.js', 
			options: {
				'preset': 'google'
			}

		},

		//watch 
		watch:{
			css: {
				files: ['**/*.scss'], 
				tasks: ['sass',  'postcss']
			},
			js:{
				files: ['src/js/*.js'],
				tasks: [/*'jscs'*/]
			},
			options: {
				nospawn: true
			}
		}

	});
	grunt.registerTask('default', ['watch']);
}
