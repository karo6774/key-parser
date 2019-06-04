const
    gulp = require("gulp"),
    NearleyLib = require("nearley"),
    NearleyCompile = require("nearley/lib/compile"),
    NearleyGenerate = require("nearley/lib/generate"),
    NearleyGrammar = require("nearley/lib/nearley-language-bootstrapped"),
    rename = require("gulp-rename"),
    ts = require("gulp-typescript"),
    through = require("through2"),
    del = require("del")
;

gulp.task("clean", function () {
    return del("lib/**/*");
});

gulp.task("nearley", function () {
    return gulp
        .src("src/**/*.ne")
        .pipe(Nearley())
        .pipe(rename({extname: ".js"}))
        .pipe(gulp.dest("lib/"));
});

gulp.task("typescript", function () {
    const project = ts.createProject("tsconfig.json");
    return project
        .src()
        .pipe(project())
        .pipe(gulp.dest("lib/"));
});

gulp.task("build", gulp.series("nearley", "typescript"));

gulp.task("default", gulp.series("clean", "build"));

function Nearley() {
    return through.obj(function (file, encoding, callback) {
        const contents = file.contents.toString(encoding);
        const parser = new NearleyLib.Parser(NearleyGrammar);
        parser.feed(contents);
        const ast = parser.results[0];

        const info = NearleyCompile(ast, {});
        const js = NearleyGenerate(info, "grammar");
        file.contents = Buffer.from(js, "utf-8");
        callback(null, file);
    });
}
