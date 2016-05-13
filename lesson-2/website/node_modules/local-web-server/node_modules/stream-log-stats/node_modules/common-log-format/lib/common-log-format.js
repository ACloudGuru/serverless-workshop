"use strict";
var Transform = require("stream").Transform,
    util = require("util");

module.exports = Clf;

function Clf(options){
    if (!(this instanceof Clf)) return new Clf(options);
    Transform.call(this, options);
}
util.inherits(Clf, Transform);

Clf.prototype._transform = function(chunk, enc, done){
    var self = this;
    var input = chunk.toString();
    input.split(/\n/).forEach(function(line){
        var re = /([^ ]*) ([^ ]*) ([^ ]*) \[([^\]]*)\] "([^"]*)" ([^ ]*) ([^ ]*)/;
        var matches = line.match(re);
        if (matches){
            var obj = {
                remoteHost: matches[1],
                remoteLogName: matches[2],
                authUser: matches[3],
                date: new Date(matches[4]),
                request: matches[5],
                status: Number(matches[6]),
                bytes: Number(matches[7]) || 0
            };
            self.push(JSON.stringify(obj));
        }
    });
    done();
}