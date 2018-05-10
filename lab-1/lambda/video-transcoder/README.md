# Video Transcoder

The video transcoder function that takes a PipelineID and creates a job from the S3 event trigger

## Environment variables
ELASTIC_TRANSCODER_REGION
ELASTIC_TRANSCODER_PIPELINE_ID

## Deployment

### Prerequisites
This function requires an ElasticTranscoder

### Deployment steps
1. Run "npm install" to install dependencies
2. Run "npm run predeploy" to package the function into a zip file
3. Upload it the resulting Lambda-Deployment.zip using the AWS Lambda Console
