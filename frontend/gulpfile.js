'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

var sources_root = 'src/';
var dest_root = 'build/';

var src = {
    css: [sources_root + 'styles/style.scss')],
    js: [sources_root + 'scripts/**/'],
    html: [src_path('**/*.html')]
};

var watched_js = ['gulpfile.js'].concat(src.js);

var dest = {
    css: dest_root + 'build/css/',
    js: dest_root + 'build/js/*'
};


gulp.task('scripts+lint', ['jshint', 'scripts']);

gulp.task('scripts', function() {
    return gulp.src(src.js)
        .pipe(sourcemaps.init())
            .pipe(concat('application.js', {newLine: ';'}))
            .pipe(ngAnnotate({single_quotes: true})
            // run uglify if --minify is set
            .pipe(gutil.env.minify ? uglify() : gutil.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(using())
        .pipe(gulp.dest(dest.js)));
});

gulp.task('styles+lint', ['scss-lint', 'styles']);

gulp.task('styles', function() {
    gulp.src(src.scss_mainfile)
        .pipe(newer(dest.css))
        .pipe(sourcemaps.init())
            .pipe(sass.sync({
                // compressed output if --minify is set
                outputStyle: gutil.env.minify ? 'compressed' : 'nested'
            }).on('error', sass.logError))
            .pipe(postcss([
                require('autoprefixer-core')({
                    browsers: ['last 1 version', 'ios 6', 'ios 7', 'android 4']
                })
            ]))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest.css))
        .pipe(using())
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('cordova-xml', function() {
    var app = buildConfig;
    app.id = app.options[environment].id;
    app.name = app.options[environment].name;

    gulp.src('./config.base.xml')
        .pipe(frep([
            { pattern: '$APP_ID', replacement: app.id },
            { pattern: '$APP_VERSION', replacement: app.version },
            { pattern: '$APP_BUILDID', replacement: versionDateString() },
            { pattern: '$APP_NAME', replacement: app.name },
            { pattern: '$AUTHOR_NAME', replacement: app.author.name },
            { pattern: '$AUTHOR_EMAIL', replacement: app.author.email },
            { pattern: '$AUTHOR_URL', replacement: app.author.href }

        ]))
        .pipe(rename('config.xml'))
        .pipe(gulp.dest('./'));
});

gulp.task('html', function() {
    gulp.src([src_path('**/*.html'), src_path('app/index.html', '!')])
        .pipe(flatten())
        .pipe(gulp.dest(dest.html));
    gulp.src(src_path('app/index.html'))
        .pipe(flatten())
        .pipe(gulp.dest(dest_root));
});

gulp.task('bower', function() {
    var jsFilter = filter('*.js');
    var cssFilter = filter('*.css');
    var fontFilter = filter(['*.woff', '*.woff2']);

    return gulp.src(mainBowerFiles())

        .pipe(jsFilter)
            .pipe(newer(dest.js + 'vendor.min.js'))
            // .pipe(using())
            .pipe(sourcemaps.init())
            .pipe(concat('vendor.min.js', {newLine: ';'}))
            // .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(dest.js))
        .pipe(jsFilter.restore())

        .pipe(cssFilter)
            .pipe(newer(dest.css + 'vendor.min.css'))
            // .pipe(using())
            .pipe(sourcemaps.init())
            .pipe(concat('vendor.min.css'))
            // .pipe(minifyCss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(dest.css))
        .pipe(cssFilter.restore())

        .pipe(fontFilter)
            .pipe(newer(dest.fonts))
            // .pipe(using())
            .pipe(flatten())
            .pipe(gulp.dest(dest.fonts))
        .pipe(fontFilter.restore());

});

gulp.task('watch', ['init'], function() {
    browserSync.init({
        open: false,
        host: 'app.merithon.com',
        port: 8000,
        server: './www'
    });
    gulp.watch(watched_js, ['scripts+lint'], browserSync.reload);
    gulp.watch(src.scss, ['styles+lint']);
    gulp.watch(src.html, ['html'], browserSync.reload);
});

gulp.task('deploy', ['init', 'cordova-xml']);
gulp.task('init', ['bower', 'scripts', 'styles', 'html']);
gulp.task('default', ['watch']);


function versionDateString() {
    return new Date().toJSON().substring(2).split('.')[0].replace(/[-:ZT\.]/g, '');
}
