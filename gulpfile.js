'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();

// production 환경 여부 (build 태스크에서 true 로 설정)
let isProd = false;

// 경로 설정
const paths = {
  html: {
    src: 'src/html/**/*.html',
    dest: 'dist',
  },
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css',
  },
  js: {
    src: 'src/js/**/*.js',
    dest: 'dist/js',
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images',
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts',
  },
  assets: {
    src: 'src/assets/**/*',
    dest: 'dist/assets',
  },
};

/**
 * dist 폴더 초기화
 * gulp 5 + del v7(ESM) 동적 import 사용
 */
async function clean() {
  const { deleteAsync } = await import('del');
  return deleteAsync(['dist']);
}

/**
 * HTML 복사
 * src/html/index.html -> dist/index.html
 * src/html/pages/*.html -> dist/pages/*.html
 */
function html() {
  return src(paths.html.src, { base: 'src/html', encoding: false })
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

/**
 * SCSS 컴파일 + Tailwind CSS 빌드 + PostCSS(Autoprefixer) + CSS 압축
 */
function styles() {
  const plugins = [tailwindcss(), autoprefixer()];
  if (isProd) {
    plugins.push(cssnano());
  }

  let stream = src(paths.scss.src);

  if (!isProd) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(plugins));

  if (!isProd) {
    stream = stream.pipe(sourcemaps.write('.'));
  }

  return stream.pipe(dest(paths.scss.dest)).pipe(browserSync.stream());
}

/**
 * JavaScript 복사 및 압축
 */
function scripts() {
  let stream = src(paths.js.src);

  if (!isProd) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(terser());

  if (!isProd) {
    stream = stream.pipe(sourcemaps.write('.'));
  }

  return stream.pipe(dest(paths.js.dest)).pipe(browserSync.stream());
}

// 이미지 복사
function images() {
  return src(paths.images.src, { encoding: false, allowEmpty: true })
    .pipe(dest(paths.images.dest))
    .pipe(browserSync.stream());
}

// 폰트 복사
function fonts() {
  return src(paths.fonts.src, { encoding: false, allowEmpty: true })
    .pipe(dest(paths.fonts.dest))
    .pipe(browserSync.stream());
}

// 기타 정적 자원 복사
function assets() {
  return src(paths.assets.src, { encoding: false, allowEmpty: true })
    .pipe(dest(paths.assets.dest))
    .pipe(browserSync.stream());
}

/**
 * 로컬 개발 서버 실행 + 파일 변경 감지 후 자동 새로고침
 */
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    port: 3000,
    open: true,
    notify: false,
  });

  watch(paths.html.src, html);
  // Tailwind 가 HTML/JS 클래스를 스캔하므로 styles 도 함께 다시 빌드
  watch([paths.scss.src, paths.html.src, paths.js.src], styles);
  watch(paths.js.src, scripts);
  watch(paths.images.src, images);
  watch(paths.fonts.src, fonts);
  watch(paths.assets.src, assets);
}

// production 플래그 설정
function setProd(done) {
  isProd = true;
  done();
}

// 전체 빌드 (병렬 처리)
const buildTasks = parallel(html, styles, scripts, images, fonts, assets);

// 빌드: dist 초기화 후 production 빌드
const build = series(setProd, clean, buildTasks);

// 개발: dist 초기화 후 빌드 -> 개발 서버 + watch
const dev = series(clean, buildTasks, serve);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.assets = assets;
exports.build = build;
exports.default = dev;
