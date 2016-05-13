var detect = require('feature-detect-es6')

if (detect.all('spread', 'generators')) {
  module.exports = require('./lib/config-master')
} else {
  require('babel-polyfill')
  module.exports = require('./es5/config-master')
}
