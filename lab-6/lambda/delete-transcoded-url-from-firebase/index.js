/**
 * Created by Manabu Uchida
 * Updated by Manabu Uchida
 * Last Updated: 11/23/2017
 *
 * Required Env Vars:
 * SERVICE_ACCOUNT
 * DATABASE_URL
 * TOPIC_ARN
 */

'use strict';

var AWS = require('aws-sdk');
// publish message to Amazon SNS
var sns = new AWS.SNS()

var firebase = require('firebase');
// delete the URL from firebase
firebase.initializeApp({
    serviceAccount: process.env.SERVICE_ACCOUNT,
    databaseURL: process.env.DATABASE_URL
});

function publishVideoIdToSns(callback, key) {
    console.log("Publish message to Amazon SNS at key:", key);

    sns.publish({
        Message: key,
        TopicArn: process.env.TOPIC_ARN
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            var response = generateResponse(400, err);
            callback(null, response);
        } else {
            console.log("Publish message to Amazon SNS done.");
            console.log(data);
            var response = generateResponse(204, null);
            callback(null, response);
        }
    });
}

function generateResponse(status, message) {
    return {
        statusCode: status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(message)
    }
}

exports.handler = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    var id = decodeURI(event.queryStringParameters.id);
    console.log('video ID: ' + id);

    var database = firebase.database().ref();

    database.child('videos').child(id).remove()
        .then(function () {
            console.log("Deleted video id from firebase. : " + id);
            publishVideoIdToSns(callback, id)
        })
        .catch(function (err) {
            console.log("Error delete video id. : " + err);
            var response = generateResponse(400, err);
            callback(null, response);
        });
};
