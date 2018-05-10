'use strict';


/**
 * Created by Peter Sbarski
 * Updated by Mike Chambers
 * Updated by Julian Pittas
 * Last Updated: 27/02/2018
 *
 * Required Env Vars:
 * ELASTIC_TRANSCODER_REGION
 * ELASTIC_TRANSCODER_PIPELINE_ID
 */


const AWS = require('aws-sdk');


const elasticTranscoder = new AWS.ElasticTranscoder({
    region: process.env.ELASTIC_TRANSCODER_REGION
});


const handler = (event, context, callback) => {

    console.log('Welcome');
    console.log('event: ' + JSON.stringify(event));

    // Grab the pipeline ID from the environment variables and the key name from the event passed in
    const pipelineId = process.env.ELASTIC_TRANSCODER_PIPELINE_ID;
    const key = event.Records[0].s3.object.key;

    // The input file may have spaces so replace them with '+'
    const sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));

    // Remove the file extension
    const outputKey = sourceKey.split('.')[0];

    // Build the parameters for the Job pipeline. 
    // Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticTranscoder.html#createJob-property
    const params = {
        PipelineId: pipelineId,
        OutputKeyPrefix: outputKey + '/',
        Input: {
            Key: sourceKey
        },
        Outputs: [
            {
                Key: outputKey + '-1080p' + '.mp4',
                PresetId: '1351620000001-000001' //Generic 1080p
            },
            {
                Key: outputKey + '-720p' + '.mp4',
                PresetId: '1351620000001-000010' //Generic 720p
            },
            {
                Key: outputKey + '-web-720p' + '.mp4',
                PresetId: '1351620000001-100070' //Web Friendly 720p
            }
    ]};


    // Call our function that creates an ElasticTranscoder Job
    return elasticTranscoder.createJob(params)
        .promise()
        .then((data) => {

            // Success
            console.log(`ElasticTranscoder callback data: ${JSON.stringify(data)}`);
            callback(null, data);

        }).catch((error) => {

            // Failure
            console.log(`An error occured ${JSON.stringify(error, null, 2)}`);
            callback(error);

        });

};


module.exports = {
    handler
};