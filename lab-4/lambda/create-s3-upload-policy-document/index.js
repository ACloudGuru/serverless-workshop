/**
 * Created by Peter Sbarski
 * Updated by Mike Chambers
 * Last Updated: 1/02/2017
 *
 * Required Env Vars:
 * UPLOAD_BUCKET
 * SECRET_ACCESS_KEY
 * ACCESS_KEY_ID
 * UPLOAD_URI - https://s3.amazonaws.com
 */

'use strict';

var AWS = require('aws-sdk');
var async = require('async');
var crypto = require('crypto');

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
          {bucket: process.env.UPLOAD_BUCKET},
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
  var signature = crypto.createHmac('sha1', process.env.SECRET_ACCESS_KEY).update(encoding).digest('base64');
  next(null, key, policy, encoding, signature);
}

function generateResponse(status, message){
    return {
      statusCode: status,
      headers: { "Access-Control-Allow-Origin": "*" },
      body : JSON.stringify(message)
    }
}

exports.handler = function(event, context, callback){
  var filename = decodeURI(event.queryStringParameters.filename);

  async.waterfall([
      async.apply(generatePolicyDocument, filename),
      encode,
      sign
  ],
    function (err, key, policy, encoding, signature) {
      if (err) {
        var response = generateResponse(400, err);

        callback(null, response);
      } else {
        var body = {
          signature: signature,
          encoded_policy: encoding,
          access_key: process.env.ACCESS_KEY_ID,
          upload_url: (process.env.UPLOAD_URI  || 'https://s3.amazonaws.com') + '/' + process.env.UPLOAD_BUCKET,
          key: key
        };
        var response = generateResponse(200, body);

        callback(null, response);
      }
    }
  )
};
