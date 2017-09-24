var gulp = require('gulp');
var webserver = require('gulp-webserver');

// 根目录
var root = gulp.src('app');
// 启动一个服务
gulp.task('webserver', function() {
    root.pipe(webserver({
        host: '127.0.0.1',
        port: 8080,
        livereload: true,
        directoryListing: true,
        open: './index.html'
    }));
});

gulp.task('default', ['webserver']);