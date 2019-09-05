const { src, dest, watch } = require('gulp');

const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");

const paths = {
	styles: {
		src: 'public/styles/src/*.scss',
		dist: 'public/styles/dist/'
	}
};


function buildCSS() {
    return src(paths.styles.src)
    	// Convertit le SCSS en CSS
        .pipe(sass())
        .on("error", sass.logError)

        // Minification
        .pipe(sourcemaps.init())
        .pipe(postcss([cssnano()]))

        // Ecrit les sourcemaps
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.styles.dist));
}

function watchTask() {
	buildCSS();

	watch([paths.styles.src], buildCSS);
}

exports.buildCSS = buildCSS;
exports.watchTask = watchTask;
