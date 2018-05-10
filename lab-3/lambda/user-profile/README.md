# User Profile

A user profile lambda that retrieves information for the authenticated Auth0 user

## Environment variables
AUTH0_DOMAIN

## Deployment

### Prerequisites
This function requires an Auth0 Account

### Deployment steps
1. Run "npm install" to install dependencies
2. Run "npm run predeploy" to package the function into a zip file
3. Upload it the resulting Lambda-Deployment.zip using the AWS Lambda Console
4. Add it as an API Gateway Resource with a GET method
