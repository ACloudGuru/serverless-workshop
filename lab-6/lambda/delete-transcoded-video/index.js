/**
 * Created by Manabu Uchida
 * Updated by Manabu Uchida
 * Last Updated: 11/23/2017
 *
 * Required Env Vars:
 * TRANSCODED_BUCKET
 */

'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    var key = event.Records[0].Sns.Message;
    var bucket = process.env.TRANSCODED_BUCKET;
    console.log("key: " + key);
    console.log("bucket: " + bucket);

    // Get object list from bucket and delete all.
    // to-do: It is necessary to consider cases exceeding 1000 objects.
    s3.listObjects({
        Bucket: bucket,
        Prefix: key,
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        } else {
            var len = data.Contents.length;

            for (var i = 0; i < len; i++) {
                var obj = data.Contents[i];
                s3.deleteObject({
                    Bucket: bucket,
                    Key: obj.Key
                }, function (err, data) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    }
                });
            }
        }
    });
};
