# Transcoder

The video transcoder function that takes a PipelineID and creates a job from the S3 event trigger. It then adds the created entry into a Firebase database

## Environment variables
- ELASTIC_TRANSCODER_REGION
- ELASTIC_TRANSCODER_PIPELINE_ID
- SERVICE_ACCOUNT
- DATABASE_URL


## Deployment

### Prerequisites
This function requires a Firebase account and an ElasticTrancoder

### Deployment steps
1. Run "npm install" to install dependencies
2. Run "npm run predeploy" to package the function into a zip file
3. Upload it the resulting Lambda-Deployment.zip using the AWS Lambda Console
