'use strict';

var AWS = require('aws-sdk');
var firebase = require('firebase');
var config = require('./config');

// save the URL to firebase
firebase.initializeApp({
  serviceAccount: config.SERVICE_ACCOUNT,
  databaseURL: config.DATABASE_URL
});

exports.handler = function(event, context, callback){
    context.callbackWaitsForEmptyEventLoop = false;

    var key = event.Records[0].s3.object.key;
    var bucket = event.Records[0].s3.bucket.name;

    var regionIdentifier = config.BUCKET_REGION === 'us-east-1' ? 's3' : 's3-' + config.BUCKET_REGION;

    var videoUrl = config.S3 + '/' + key;

    // construct S3 URL based on bucket and key
    // the input file may have spaces so replace them with '+'
    var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));

    // get the unique video key (the folder name)
    var uniqueVideoKey = sourceKey.split('/')[0];

    var database = firebase.database().ref();

    // update the unique entry for this video in firebase
    database.child('videos').child(uniqueVideoKey).set({
        transcoding: false,
        source: videoUrl
    })
    .then(function(){
        callback(null, 'Added URL' + videoUrl);
    })
    .catch(function(err) {
        callback(err);
    });
};
