'use strict';

/**
 * Created by Peter Sbarski
 * Updated by Mike Chambers
 * Updated by Julian Pittas
 * Last Updated: 27/02/2018
 *
 * Required Env consts:
 * AUTH0_DOMAIN
 */

const jwt = require('jsonwebtoken');
const rp = require('request-promise');


const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const statementOne = {
            Action: 'execute-api:Invoke', // default action
            Effect: effect,
            Resource: resource,
        }
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [statementOne]
        }
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};


const verifyJWTToken = (jwtToken, pubKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(jwtToken, pubKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

const handler = (event, context, callback) => {
    
    if (!event.authorizationToken) {
    	callback('Could not find authToken');
    	return;
    }

    const jwtToken = event.authorizationToken.split(' ')[1];
    if (!jwtToken) {
        callback('Could not find authToken');
    	return;
    }
    const decodedToken = jwt.decode(jwtToken, {complete: true});

    const Auth0ApiBaseUrl = process.env.AUTH0_DOMAIN;
    if(!Auth0ApiBaseUrl) {
        callback('Base Url not found');
    	return;
    }

    return rp(`https://${Auth0ApiBaseUrl}/.well-known/jwks.json`)
        .then((jwks) => {

            const jwksKey = JSON.parse(jwks).keys[0];

            //Validate the algorithm
            if (!jwksKey) {
                throw new Error('No supported jwt keys');
             }

            //Validate the algorithm
            if (jwksKey.alg !== 'RS256' || decodedToken.header.alg !== 'RS256') {
               throw new Error('Invalid algorithm used, only RS256 supported');
            }

            //Validate the signing key
            if (!jwksKey.kid || decodedToken.header.kid !== jwksKey.kid) {
                throw new Error('Invalid signing algorithm');
            }

            //Validate the certificate
            if (!jwksKey.x5c[0]) {
                throw new Error('No certificate found');
            }

            const cert = `-----BEGIN CERTIFICATE-----\n${jwksKey.x5c[0]}\n-----END CERTIFICATE-----\n`;

            return cert;

        })
        .then((pubKey) => verifyJWTToken(jwtToken, pubKey))
        .then(() => {
            callback(null, generatePolicy('user', 'allow', event.methodArn));
        })
        .catch((err) => {

            console.log('Failed jwt verification: ', err, 'auth: ', event.authorizationToken);
            callback('Authorization Failed');

        });

};

module.exports = {
    handler
};