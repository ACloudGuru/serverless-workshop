'use strict';

/**
 * Created by Peter Sbarski
 * Updated by Mike Chambers
 * Updated by Julian Pittas
 * Last Updated: 27/02/2018
 *
 * Required Env Vars:
 * AUTH0_DOMAIN
 */

const rp = require('request-promise');

const generateResponse = (status, message) => {
    return {
        statusCode: status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({'message':message})
    }
};

const handler = (event, context, callback) => {

    console.log(JSON.stringify(event, null, 2));

    // Grab the Id token from the request header, the access token from the url
    // and the auth0 doimain name from the environment variables
    const idToken = event.headers.Authorization;
    const accessToken = event.queryStringParameters.accessToken;
    const auth0Domain = process.env.AUTH0_DOMAIN;


    // Check to make sure we have the ID token
    if (!idToken) {
      const response = generateResponse(400, 'ID token not found');

    	callback(null, response);
    	return;
    }

    // Check to make sure we have the access token
    if (!accessToken) {
        const response = generateResponse(400, 'AccessToken not found');
  
        callback(null, response);
        return;
    }


    // Build and make a request to Auth0's userinfo endpoint
    // to get information on the user from the access token
    const options = {
        url: `https://${auth0Domain}/userinfo`,
        method: 'POST',
        json: true,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    return rp(options).then((body) => {

            // Success
            const response = generateResponse(200, body);
            callback(null, response);

        })
        .catch((error) => {

            // Failure
            const response = generateResponse(400, error);
            callback(null, response);

        });
};

module.exports = {
    handler
};