module.exports = {
  diff: true,
  extension: ['js'],
  opts: false,
  recursive: true,
  require: ['esm', './mocha-helper.js'],
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  spec: 'src/**/*.spec.js',
  'watch-files': ['src/**/*.js'],
  'watch-ignore': []
}