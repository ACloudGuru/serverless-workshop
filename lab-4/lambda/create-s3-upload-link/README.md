# S3 Policy creator

This function creates an S3 upload policy for browser based S3 uploads

## Environment variables
- UPLOAD_BUCKET
- SECRET_ACCESS_KEY
- ACCESS_KEY_ID
- UPLOAD_URI


## Deployment

### Prerequisites
This function requires an IAM upload user and S3 upload bucket

### Deployment steps
1. Run "npm install" to install dependencies
2. Run "npm run predeploy" to package the function into a zip file
3. Upload it the resulting Lambda-Deployment.zip using the AWS Lambda Console
