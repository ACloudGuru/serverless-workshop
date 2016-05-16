/**
 * Created by Peter Sbarski
 * Last Updated: 28/03/2016
 */
'use strict';

var jwt = require('jsonwebtoken');
var env = require('./config');

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

exports.handler = function(event, context, callback){
    if (!event.authorizationToken) {
    	callback('Could not find authToken');
    	return;
    }

    var token = event.authorizationToken.split(' ')[1];

    var secretBuffer = new Buffer(env.AUTH0_SECRET, 'base64');
    jwt.verify(token, secretBuffer, function(err, decoded){
    	if(err){
    		console.log('Failed jwt verification: ', err, 'auth: ', event.authorizationToken);
    		callback('Authorization Failed');
    	} else {
    		callback(null, generatePolicy('user', 'allow', event.methodArn));
    	}
    })
};
