/**
 * Created by Peter Sbarski
 * Updated by Mike Chambers
 * Last Updated: 1/02/2017
 *
 * Required Env Vars:
 * AUTH0_DOMAIN
 */
'use strict';

var request = require('request');

function generateResponse(status, message){
    return {
      statusCode: status,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({'message':message})
    }
}

exports.handler = function(event, context, callback){
    var authToken = event.headers.Authorization;

    if (!authToken) {
      var response = generateResponse(400, 'AuthToken not found');

    	callback(null, response);
    	return;
    }

    var token = authToken.split(' ')[1];

    var body = {
        'id_token': token
    };

    var options = {
        url: 'https://' +  process.env.AUTH0_DOMAIN + '/tokeninfo',
        method: 'POST',
        json: true,
        body: body
    };

    request(options, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var response = generateResponse(200, body);

            callback(null, response);
        } else {
            var response = generateResponse(400, error);

            callback(null, response);
        }
    });
};
