var gulp = require('gulp'),
		jade = require('gulp-jade'),
		sass = require('gulp-ruby-sass'),
		uglify = require('gulp-uglify'),
		browserSync = require('browser-sync').create(),
		cp = require('child_process');

// Compile HTML files to Jade
gulp.task('jade', function(){
	return gulp.src('jade/*.jade')
				.pipe(jade({
					pretty: true
				}))
				.pipe(gulp.dest(''))
});

// Compile SASS files to CSS
gulp.task('sass', function(){
	return sass('sass/*.sass', {sourcemap: true})
				.pipe(gulp.dest('css/'))
				.pipe(browserSync.stream()) // We can use this to inject changed files to browserSync
});

// Compress JavaScript files into the 'min' folder
gulp.task('compress', function(){
	return gulp.src('js/*.js')
				.pipe(uglify())
				.pipe(gulp.dest('js/min/')) 
});

// Watch changes for the files and execute compilations
gulp.task('watch', function(){
	gulp.watch('sass/*.sass', ['sass']);
	gulp.watch('jade/*jade', ['jade']);
	gulp.watch('js/*js', ['compress']);
});

// Build Jekyll site
gulp.task('jekyll', function (done){
		cp.exec('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

// Serve a local server with browserSync, notice that we also use 'jekyll' and 'sass' tasks
gulp.task('serve', ['sass', 'jekyll'], function() {
    browserSync.init({
        server: ""
    });
    gulp.watch("index.html").on('change', browserSync.reload);
});

// This is the default task, just type 'gulp' on your favorite command line
// tool and the site will be built. 
gulp.task('default', ['watch', 'serve']);