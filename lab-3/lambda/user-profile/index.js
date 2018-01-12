/**
 * Created by Peter Sbarski
 * Updated by Mike Chambers
 * Updated by Julian Pittas
 * Last Updated: 10/01/2018
 *
 * Required Env Vars:
 * AUTH0_DOMAIN
 */
'use strict';

var request = require('request');

function generateResponse(status, message){
    return {
      statusCode: status,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({'message':message})
    }
}

exports.handler = function(event, context, callback){
    console.log(event);
    var idToken = event.headers.Authorization;
    var accessToken = event.queryStringParameters.accessToken;

    if (!idToken) {
      var response = generateResponse(400, 'ID token not found');

    	callback(null, response);
    	return;
    }

    if (!accessToken) {
        var response = generateResponse(400, 'AccessToken not found');
  
        callback(null, response);
        return;
    }

    var options = {
        url: 'https://' +  process.env.AUTH0_DOMAIN + '/userinfo',
        method: 'POST',
        json: true,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
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
