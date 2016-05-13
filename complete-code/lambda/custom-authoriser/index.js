/**
 * Created by Peter Sbarski
 * Last Updated: 28/03/2016
 * Copyright: Manning Publications Co 2016
 */
'use strict';

var jwt = require('jsonwebtoken');
var env = require('auth0-variables');
var secret = env.AUTH0_SECRET;

var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}

exports.handler = function(event, context){
    if (!event.authorizationToken) {
    	context.fail('Could not find authToken');
    	return;
    }

    var token = event.authorizationToken.split(' ')[1];

    var secretBuffer = new Buffer(secret, 'base64');
    jwt.verify(token, secretBuffer, function(err, decoded){
    	if(err){
    		console.log('Failed jwt verification: ', err, 'auth: ', event.authorizationToken);
    		context.fail('Authorization Failed');
    	} else {
    		context.succeed(generatePolicy('user', 'allow', event.methodArn));
    	}
    })
};
