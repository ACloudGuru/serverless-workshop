'use strict'
var o = require('object-tools')
var path = require('path')
var urlUtil = require('url')
var byteSize = require('byte-size')

var stats = module.exports = {
  clients: {},
  clientCount: 0,
  bytes: 0,
  transferred: '0',
  requests: 0,
  resource: {},
  type: {},
  topResources: [],
  topTypes: []
}
stats.addClient = function (ip) {
  if (this.clients[ip]) {
    this.clients[ip]++
  } else {
    this.clients[ip] = 1
  }
  this.clientCount = Object.keys(this.clients).length
}
stats.addResource = function (url, bytes) {
  if (stats.resource[url]) {
    stats.resource[url].requests++
    stats.resource[url].bytes += bytes
  } else {
    stats.resource[url] = {
      requests: 1,
      bytes: bytes
    }
  }
  var parsedUrl = urlUtil.parse(url)
  var type = path.extname(parsedUrl.pathname) || '<none>'
  type = type.toLowerCase()
  if (stats.type[type]) {
    stats.type[type].requests++
    stats.type[type].bytes += bytes
  } else {
    stats.type[type] = {
      requests: 1,
      bytes: bytes
    }
  }

  stats.topResources = []
  stats.topTypes = []
  o.each(stats.resource, function (resource, key) {
    stats.topResources.push({
      resource: key,
      requests: resource.requests,
      bytes: byteSize(resource.bytes, { units: 'iec', precision: 2 })
    })
  })
  o.each(stats.type, function (type, key) {
    stats.topTypes.push({
      type: key,
      requests: type.requests,
      bytes: byteSize(type.bytes, { units: 'iec', precision: 2 })
    })
  })

  stats.topResources = stats.topResources.sort(function (a, b) {
    return b.requests - a.requests
  })
  stats.topTypes = stats.topTypes.sort(function (a, b) {
    return b.requests - a.requests
  })
}
stats.addBytes = function (bytes) {
  this.bytes += bytes
  this.transferred = byteSize(this.bytes, { units: 'iec', precision: 2 })
}
