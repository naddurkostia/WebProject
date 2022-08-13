const {series, parallel, src, dest, watch} = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')(require('sass'))
const minifyjs = require('gulp-js-minify')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')

const serv = () => {
	browserSync.init({
		server: {
			baseDir: './',
		},
		open: true,
	})
}

const scripts = done => {
	src('./src/js/*.js')
		.pipe(concat('index.js'))
		.pipe(uglify())
		.pipe(minifyjs())
		.pipe(dest('./dist/js'))
		.pipe(browserSync.stream())
	done()
}

const styles = done => {
	src('./src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cleanCSS())
		.pipe(dest('./dist/css'))
		.pipe(browserSync.stream())
	done()
}

const images = () => {
	src('./src/img/**/*.{jpg,jpeg,png,svg}').pipe(dest('./dist/img'))
}

const watcher = () => {
	watch('*.html').on('change', browserSync.reload)
	watch('./src/js/*.js').on('change', series(scripts, browserSync.reload))
	watch('./src/scss/**/*.scss', styles)
	watch('./src/img/**/*.{jpg,jpeg,png,svg}').on(
		'change',
		series(images, browserSync.reload)
	)
}

exports.default = parallel(serv, watcher, series(styles, scripts, images))
