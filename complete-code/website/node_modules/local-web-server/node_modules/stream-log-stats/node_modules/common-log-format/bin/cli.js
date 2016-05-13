#!/usr/bin/env node
"use strict";

var clf = require("../");

process.stdin.pipe(clf()).pipe(process.stdout);