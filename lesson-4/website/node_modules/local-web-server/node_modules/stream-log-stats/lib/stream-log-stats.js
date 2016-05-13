'use strict'
var Clf = require('common-log-format')
var view = require('./view')
var stats = require('./stats')
var JSONStream = require('JSONStream')
var streamVia = require('stream-via')
var throttle = require('lodash.throttle')

module.exports = streamLogStats

function streamLogStats (options) {
  options = options || {}
  var throttledRender = throttle(view.render, options.refreshRate || 500)

  function renderLogObject (logObject) {
    var requestSplit = logObject.request.split(' ')
    stats.addBytes(logObject.bytes)
    stats.requests++
    stats.addClient(logObject.remoteHost)
    var resourceLine
    try {
      resourceLine = decodeURI(requestSplit[1])
    } catch (err) {
      resourceLine = requestSplit[1]
    }

    var availableSpace = process.stdout.columns - 37
    if (resourceLine.length > availableSpace) {
      stats.addResource(logObject.status + ' ' + requestSplit[0] + ' ...' + resourceLine.substr(-(availableSpace)), logObject.bytes)
    } else {
      stats.addResource(logObject.status + ' ' + requestSplit[0] + ' ' + resourceLine, logObject.bytes)
    }

    throttledRender(stats)
  }

  var clf = new Clf(options)
  clf
    .pipe(JSONStream.parse())
    .pipe(streamVia(renderLogObject, { objectMode: true }))
    .resume()
  return clf
}
