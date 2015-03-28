var gulp = require('gulp');
 
// browser Sync
var browserSync = require('browser-sync');
 
// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});
 
gulp.task('default', ['browser-sync']);
 
// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});
 
// Watch scss AND html files, doing different things with each.
gulp.task('default', ['browser-sync'], function () {
    gulp.watch("*.html", ['bs-reload']);
    gulp.watch("./*.html", ['bs-reload']);
    gulp.watch("*.js", ['bs-reload']);
});