const { exec } = require('child_process');

const paths = {
	styles: {
		src: 'public/styles/src/',
		dist: 'public/styles/dist/'
	}
};

async function compileSass() {
	exec(`npx sass ${paths.styles.src}:${paths.styles.dist} --style=compressed --source-map`);
}

async function compileAndWatchSass() {
	exec(`npx sass ${paths.styles.src}:${paths.styles.dist} --watch --style=compressed --source-map`);
}

exports.compileSass = compileSass;
exports.compileAndWatchSass = compileAndWatchSass;

// exports = {
// 	compileSass,
// 	compileAndWatchSass
// }
