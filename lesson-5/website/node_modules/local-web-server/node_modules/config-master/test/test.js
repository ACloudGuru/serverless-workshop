'use strict'
var test = require('tape')
var loadConfig = require('../')

test('new API', function (t) {
  var config = loadConfig('test-app', { startFrom: __dirname + '/fixture/one/two' })
  t.deepEqual(config, {
    one: 1,
    two: 2,
    three: 3,
    four: 'package'
  })
  t.end()
})
