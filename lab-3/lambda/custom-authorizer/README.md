# Custom Authorizer

A custom authorizer for AWS API Gateway to authorize Auth0 accounts

## Environment variables
AUTH0_DOMAIN

## Deployment

### Prerequisites
This function requires an Auth0 Account and an API Gateway

### Deployment steps
1. Run "npm install" to install dependencies
2. Run "npm run predeploy" to package the function into a zip file
3. Upload it the resulting Lambda-Deployment.zip using the AWS Lambda Console
4. Add it as a custom authorizer in the API Gateway console
