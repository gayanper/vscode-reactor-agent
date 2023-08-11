'use strict';
const gulp = require('gulp');
const exec = require('child_process');

gulp.task('build-agent', function(done) {
    exec.execSync('./mvnw clean package', { cwd: 'agent/vscode-reactor-agent', stdio: [0,1,2]});
    gulp.src('agent/vscode-reactor-agent/target/ragent.jar').pipe(gulp.dest('ajars/'));
    done();
});