'use strict';

/**
 *
 * Required Env Vars:
 * UPLOAD_BUCKET_NAME
 */

const AWS = require('aws-sdk');
const crypto = require('crypto');
const s3 = new AWS.S3({signatureVersion: 'v4'});

const generateResponse = (status, message) => {
    return {
      statusCode: status,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body : JSON.stringify(message)
    }
};

const handler = (event, context, callback) => {
  
  // Get the bucket name to upload to
  const bucket = process.env.UPLOAD_BUCKET_NAME;
  if(!bucket) {
    callback('No upload bucket set, please add an output bucket in the environment variables');
    return;
  }
  if(!event.queryStringParameters.filename) {
    callback('No file uploaded');
    return;
  }

  // Get the filename from the query string parameters in the GET call
  const filename = decodeURI(event.queryStringParameters.filename);
  const directory = crypto.randomBytes(20).toString('hex');

  const key = directory + '/' + filename;

  const params = {
    'Bucket': bucket,
    'Fields': {
      'key': key
    },
    'Conditions': [
      {'acl': 'private'}
    ]
  }

  s3.createPresignedPost(params, function callbackToPost(error, data) {
    if (error) {
       // Failure
       const response = generateResponse(400, error);
       callback(null, response);
    } else {
       // Success
      const response = generateResponse(200, data);
      callback(null, response);
    }
  });

};

module.exports = {
  handler
};