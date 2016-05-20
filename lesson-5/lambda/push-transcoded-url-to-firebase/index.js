'use strict';
var AWS = require('aws-sdk');
var Firebase = require('firebase');
var config = require('./config');

exports.handler = function(event, context){
    var key = event.Records[0].s3.object.key;
    var bucket = event.Records[0].s3.bucket.name;

    var videoUrl = config.S3 + '/' + key;

    // construct S3 URL based on bucket and key
    // the input file may have spaces so replace them with '+'
    var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));

    // get the unique video key (the folder name)
    var uniqueVideoKey = sourceKey.split('/')[0];

    // save the URL to firebase
    var firebaseRef = new Firebase(config.FIREBASE_URL);

    // update the unique entry for this video in firebase
    firebaseRef.child('videos').child(uniqueVideoKey).set({
        transcoding: false,
        source: videoUrl
    })
    .then(function() {
        context.succeed("Updated Firebase");
    })
    .catch(function(err) {
        console.log("Error writing transcoded video location to firebase");
        context.fail(err);
    });
};
