const gulp = require('gulp')
const through = require('through2')
const rollup = require('rollup')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const pkg = require('./package.json')
const concat = require('gulp-concat')
const cleancss = require('gulp-clean-css')
const filter = require('gulp-filter')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const reload = browserSync.reload
sass.compiler = require('node-sass')

// 开发环境
const env = process.env.NODE_ENV
const isDev = env == 'development'
const plugins = require('./rollup.config')(isDev)

const bundleTypescript = async () => {
  // 监听目录
  const dirs = isDev ? ['./src/components/index.ts'] : ['src/components/**/*.ts', '!src/components/**/*.e2e.ts', '!src/components/**/*.spec.ts']
  // rollup导出格式
  const format = isDev ? ['umd'] : ['umd', 'cjs', 'amd', 'es', 'iife']
  gulp.src(dirs)
    .pipe(through.obj((file, enc, cb) => {
      format.forEach((f, i) => {
        bundleRollup(file.relative, f)
      })
      cb()
    }))
}

// 启动本地服务器
const startServer = async () => {
  var server = browserSync.init({
    server: {
      baseDir: './'
    },
    open: false
  })
  // 监听文件
  gulp.watch('./src/**/*.scss', gulp.series(bundleSass))
  gulp.watch(['src/components/**/*.ts', 'src/components/*.ts'], gulp.series(bundleTypescript))
  gulp.watch([
    './src/components/**/*.html',
    './src/components/**/*.md',
    './docs/*.md'
  ]).on('change', reload)
}

// 复制component中的readme到doc
const copyMarkdown = async () => {
  gulp.src('./src/components/**/*.md')
    .pipe(gulp.dest('./doc/web'))
}

// 开发环境打包sass
const bundleSass = async () => {
  const output = isDev ? `${pkg.output}` : `${pkg.output}/${pkg.version}`
  gulp.src('./src/components/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      sourceMap: true
    }).on('error', (err) => {
      console.log(err)
      reload({ stream: true })
    }))
    .pipe(autoprefixer(pkg.browserslist))
    .pipe(cleancss())
    .pipe(concat(`${pkg.name}.css`))
    .pipe(gulp.dest(output))
    .pipe(reload({stream: true}))
    .pipe(concat(`components.css`))
    .pipe(gulp.dest('docs/assets/styles'))
    .pipe(filter('**/*.css'))
}

// 生产环境打包主题文件
const bundleTheme = async () => {
  gulp.src('./src/themes/**/index.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      sourceMap: true
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer(pkg.browserslist))
    .pipe(cleancss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${pkg.output}/${pkg.version}/themes/`))
}

// rollup打包
const bundleRollup = async (filepath, format) => {
  const narr = filepath.split('-')
  const name = narr[narr.length - 1].replace('.ts', '')
  console.log(`开始打包${name}[${format}]`)
  rollup.rollup({
    input: `src/components/${filepath}`,
    plugins
  }).then(bundle => {
    let file = isDev ? `${pkg.output}/${pkg.name}.js` : `${pkg.output}/${pkg.version}/hc-${name}/index.${format}.js`
    if (name == 'index' && !isDev) {
      file = `${pkg.output}/${pkg.version}/${pkg.name}.min.js`
    }
    bundle.write({
      file,
      format,
      name
    })
  })
}

exports.dev = gulp.series(startServer, bundleSass, bundleTypescript)
exports.bundle = gulp.series(bundleTypescript, bundleSass, bundleTheme)
