'use strict'
var ansi = require('ansi-escape-sequences')
var columnLayout = require('column-layout')

exports.render = render

var visible = false
var previouslyRenderedLines = 0

function render (stats) {
  var clientsData = [
    {
      one: ansi.format('Clients', ['underline']),
      two: ansi.format('Requests', ['underline']),
      three: ansi.format('Transferred', ['underline'])
    },
    {
      one: stats.clientCount,
      two: stats.requests,
      three: stats.transferred
    }
  ]
  var clientsTable = columnLayout.table(clientsData)

  var extensionTable = columnLayout.table([
    {
      type: ansi.format('Extension', ['underline']),
      requests: ansi.format('Requests', ['underline']),
      bytes: ansi.format('Transferred', ['underline'])
    }
  ].concat(stats.topTypes))

  var resourceTable = columnLayout.table(
    [
      {
        resource: ansi.format('Resource', ['underline']),
        requests: ansi.format('Requests', ['underline']),
        bytes: ansi.format('Transferred', ['underline'])
      }
    ].concat(stats.topResources),
    {
      columns: [{ name: 'resource', break: true }]
    }
  )

  var output = clientsTable.render() + '\n' + extensionTable.render() + '\n' + resourceTable.render()

  if (visible) {
    process.stderr.write(
      ansi.cursor.up(previouslyRenderedLines + (process.platform === 'win32' ? 1 : 0))
    )
  } else {
    visible = true
  }
  process.stderr.write(ansi.erase.display())
  var lines = output.split('\n')

  previouslyRenderedLines = 0
  for (var i = 0; i < lines.length && i < (process.stdout.rows - 1); i++) {
    console.error(lines[i])
    previouslyRenderedLines++
  }
}
