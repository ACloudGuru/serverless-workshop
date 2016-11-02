'use strict';

var AWS = require('aws-sdk');
var firebase = require('firebase');
var config = require('./config');

var elasticTranscoder = new AWS.ElasticTranscoder({
    region: config.ELASTIC_TRANSCODER_REGION
});

firebase.initializeApp({
  serviceAccount: config.SERVICE_ACCOUNT,
  databaseURL: config.DATABASE_URL
});

function pushVideoEntryToFirebase(callback, key) {
    console.log("Adding video entry to firebase at key:", key);

    var database = firebase.database().ref();

    // create a unique entry for this video in firebase
    database.child('videos').child(key)
        .set({
            transcoding: true
        })
        .then(function () {
            callback(null, "Video saved");
        })
        .catch(function (err) {
            callback(err);
        });
}

exports.handler = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    var key = event.Records[0].s3.object.key;
    console.log("Object key:", key);

    //the input file may have spaces so replace them with '+'
    var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));
    console.log("Source key:", sourceKey);

    //remove the extension
    var outputKey = sourceKey.split('.')[0];
    console.log("Output key:", sourceKey);

    // get the unique video key (the folder name)
    var uniqueVideoKey = outputKey.split('/')[0];

    var params = {
        PipelineId: config.ELASTIC_TRANSCODER_PIPELINE_ID,
        OutputKeyPrefix: outputKey + '/',
        Input: {
            Key: sourceKey
        },
        Outputs: [
            {
                Key: outputKey + '-web-480p' + '.mp4',
                PresetId: '1351620000001-000020' //480p 16:9 format
            }
        ]
    };

    elasticTranscoder.createJob(params, function (error, data) {
        if (error) {
            console.log("Error creating elastic transcoder job.");
            callback(error);
            return;
        }

        // the transcoding job started, so let's make a record in firebase
        // that the UI can show right away
        console.log("Elastic transcoder job created successfully");
        pushVideoEntryToFirebase(callback, uniqueVideoKey);
    });
};
