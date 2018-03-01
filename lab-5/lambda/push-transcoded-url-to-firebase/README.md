# Transcoded video URL to Firebase

This function updates a Firebase database entry with the URL for a transcoded video

## Environment variables
- SERVICE_ACCOUNT
- DATABASE_URL
- S3_TRANSCODED_BUCKET_URL : https://s3.amazonaws.com/YOUR_TRANSCODED_BUCKET_NAME_HERE

## Deployment

### Prerequisites
This function requires an S3 transcoded bucket and a Firebase account

### Deployment steps
1. Run "npm install" to install dependencies
2. Run "npm run predeploy" to package the function into a zip file
3. Upload it the resulting Lambda-Deployment.zip using the AWS Lambda Console
4. Create an S3 trigger from the transcoded bucket
