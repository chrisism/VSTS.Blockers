const gulp = require('gulp');
const replace = require('gulp-replace');
const gulpSequence = require('gulp-sequence');
const shell = require('gulp-shell')
const del = require('del');
const ts = require("gulp-typescript");
const cp = require('child_process');

var tsProject = ts.createProject("tsconfig.json");
var spawnSync = cp.spawnSync;

gulp.task('clean', () => {
    return del(['_build/']);
});

var gitVersionObj;
gulp.task('getVersion', () => {

    var cmd = spawnSync('gitversion', []);
    gitVersionObj = JSON.parse(cmd.stdout.toString())
    return;
});

gulp.task('copyTokenizedFiles', () => {

    var packageVersion = gitVersionObj.MajorMinorPatch;
    
    return gulp.src([
        './vss-extension.json'], {base : "./" })
        .pipe(replace("__VERSION__", packageVersion))
        .pipe(replace("__VERSIONMAJOR__", gitVersionObj.Major))
        .pipe(replace("__VERSIONMINOR__", gitVersionObj.Minor))
        .pipe(replace("__VERSIONPATCH__", gitVersionObj.Patch))
        .pipe(gulp.dest('./_build/'));
});

gulp.task('copyPackageFiles', () => {
    return gulp.src([
            './*.md',
            './*.jpg',
            './*.png'], {base:'./'})
        .pipe(gulp.dest('./_build/'));
 });

gulp.task('copyStaticSourceFiles', () => {
    return gulp.src([
            './src/static/**/*.*'], {base:'./src'})
        .pipe(gulp.dest('./_build/'));
 });

gulp.task("compile", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./_build/scripts/"));
});

gulp.task('createPackage', shell.task([
    'tfx extension create --manifest-globs vss-extension.json'
], {cwd: "./_build/"}));

gulp.task('build', gulpSequence('clean', ['getVersion', 'copyPackageFiles', 'copyStaticSourceFiles'], 'copyTokenizedFiles', 'compile'));
gulp.task('buildpackage', gulpSequence('build', 'createPackage'));
gulp.task('default', ['build']);