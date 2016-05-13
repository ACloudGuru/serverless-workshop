#!/usr/bin/env node
'use strict'

var statsView = require('../')

process.stdin.pipe(statsView({ refreshRate: 100 }))
