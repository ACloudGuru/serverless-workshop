/**
 * Created by Peter Sbarski
 * Last Updated: 28/03/2016
 * Copyright: Manning Publications Co 2016
 */
'use strict';

var jwt = require('jsonwebtoken');
var request = require('request');
var env = require('auth0-variables');
var secret = env.AUTH0_SECRET;

exports.handler = function(event, context){
    if (!event.authToken) {
    	context.fail('Could not find authToken');
    	return;
    }

    var token = event.authToken.split(' ')[1];

    var secretBuffer = new Buffer(secret, 'base64');
    jwt.verify(token, secretBuffer, function(err, decoded){
    	if(err){
    		console.log('Failed jwt verification: ', err, 'auth: ', event.authToken);
    		context.fail('Authorization Failed');
    	} else {

        var body = {
          'id_token': token
        };

        var options = {
          url: 'https://' +  env.AUTH0_DOMAIN + '/tokeninfo',
          method: 'POST',
          json: true,
          body: body
        };

        request(options, function(error, response, body){
          if (!error && response.statusCode === 200) {
            context.succeed(body);
          } else {
            context.fail(error);
          }
        });
    	}
    })
};
