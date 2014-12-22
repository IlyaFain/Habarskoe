gulp = require 'gulp'
run  = require('gulp-load-plugins')()


paths =
	slim: 	'sources/templates/'
	stylus: 'sources/styles/'
	coffee: 'sources/scripts/'
	css: 	'public/assets/styles/'
	js: 	'public/assets/scripts/'
	html: 	'public/'

all =
	js: 	'**/*.js'
	coffee: '**/*.coffee'
	slim: 	'**/*.slim'
	stylus: '**/*.styl'
	css: 	'**/*.css'
	html: 	'**/*.html'

server = run.livereload()



# STYLES
gulp.task 'styles:compile', ['styles:clean', 'styles:main', 'styles:icons']
gulp.task 'styles:clean', ->
	gulp.src paths.css + all.css, { read: false }
		.pipe run.clean {force: true}
compileStylus = (name) ->
	gulp.src [paths.stylus + name + '.styl']
		.pipe run.plumber()
		.pipe run.stylus {'include css': true, url: 'inline', errors: false}
		.pipe run.autoprefixer 'last 3 version', '> 1%', 'ie 8', 'ie 7'
		.pipe gulp.dest paths.css
gulp.task 'styles:main', -> compileStylus('styles')
gulp.task 'styles:icons', -> compileStylus('icons')
gulp.task 'styles:watch', ->
	gulp.watch [
		paths.stylus + '00-settings.styl',
		paths.stylus + '01-helpers.styl',
		paths.stylus + '02-base.styl',
		paths.stylus + 'blocks/*.styl',
		paths.stylus + 'styles.styl'
	], ['styles:main']
	gulp.watch paths.stylus + 'icons.styl', ['styles:icons']
	gulp.watch paths.stylus + all.css, ['styles:main']
	gulp.watch paths.css + all.css
		.on 'change', (file) ->
			server.changed(file.path)


gulp.task 'templates:compile', ['templates:clean', 'templates:slim']
gulp.task 'templates:clean', ->
	gulp.src [paths.html + all.html], { read: false }
		.pipe run.clean {force: true}
gulp.task 'templates:slim', ->
	gulp.src [paths.slim + '*.slim']
		.pipe run.plumber()
		.pipe run.include()
		.pipe run.plumber()
		.pipe run.slim {pretty: true}
		.pipe gulp.dest paths.html
gulp.task 'templates:watch', ->
	gulp.watch [paths.slim + all.slim], ['templates:slim']

	gulp.watch paths.html + all.html
		.on 'change', (file) ->
			setTimeout ->
				server.changed(file.path)
			, 500



# SCRIPTS
gulp.task('scripts:compile', ['scripts:clean', 'scripts:js', 'scripts:coffee'])
gulp.task 'scripts:clean', ->
	gulp.src [paths.js + all.js], { read: false }
		.pipe run.clean {force: true}
gulp.task 'scripts:coffee', ->
	gulp.src [paths.coffee + '*.coffee']
		.pipe run.plumber()
		.pipe run.coffee bare: true, sourceMap: false
		.pipe run.concat('build.js')
		.pipe gulp.dest paths.js
gulp.task 'scripts:js',  ->
	gulp.src [paths.coffee + '**/*.js']
		.pipe run.plumber()
		.pipe run.concat('vendors.js')
		.pipe gulp.dest paths.js
gulp.task 'scripts:watch', ->
	gulp.watch paths.coffee + all.coffee, ['scripts:coffee']
	gulp.watch paths.coffee + all.js, ['scripts:js']
	gulp.watch paths.js + all.js
		.on 'change', (file) ->
			server.changed(file.path)

gulp.task 'default', [
	'styles:compile'
	'templates:compile'
	'scripts:compile'
]

gulp.task 'watch', [
	'styles:compile'
	'styles:watch'
	'templates:compile'
	'templates:watch'
	'scripts:compile'
	'scripts:watch'
]
