'use strict';

var AWS = require('aws-sdk');
var async = require('async');
var crypto = require('crypto');
var env = require('./config');

var s3 = new AWS.S3();

function base64encode (value) {
  return new Buffer(value).toString('base64');
}

function generateExpirationDate() {
  var currentDate = new Date();
  currentDate = currentDate.setDate(currentDate.getDate() + 1);
  return new Date(currentDate).toISOString();
}

function generatePolicyDocument(filename, next) {
  var directory = crypto.randomBytes(20).toString('hex');
  var key = directory + '/' + filename;
  var expiration = generateExpirationDate();

  var policy = {
      'expiration' : expiration,
      'conditions': [
          {key: key},
          {bucket: env.UPLOAD_BUCKET},
          {acl: 'private'},
          ['starts-with', '$Content-Type', '']
      ]
  };

  next(null, key, policy);
}

function encode(key, policy, next) {
  var encoding = base64encode(JSON.stringify(policy)).replace('\n','');
  next(null, key, policy, encoding);
}

function sign(key, policy, encoding, next) {
  var signature = crypto.createHmac('sha1', env.SECRET_ACCESS_KEY).update(encoding).digest('base64');
  next(null, key, policy, encoding, signature);
}

exports.handler = function(event, context, callback){
  var filename = decodeURI(event.filename);

  async.waterfall([
      async.apply(generatePolicyDocument, filename),
      encode,
      sign
  ],
    function (err, key, policy, encoding, signature) {
      if (err) {
        callback(err);
      } else {
        callback(null, {
          signature: signature,
          encoded_policy: encoding,
          access_key: env.ACCESS_KEY,
          upload_url: env.UPLOAD_URI + '/' + env.UPLOAD_BUCKET,
          key: key
        })
      }
    }
  )
};
