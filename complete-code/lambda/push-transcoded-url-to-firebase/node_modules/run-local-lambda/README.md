# run-local-lambda
> An npm module to help you run and test Lambda functions locally

This module has been designed to be run by npm as part of a test script. It is a replacement for similar grunt/gulp Lambda plugins and is useful for developers wishing to use npm for everything.

* This module allows you to run and test Lambda functions on your computer or in a continuous integration setting.
* You can pass in any event data JSON object to simulate a Lambda event.
* The context object is taken care off for you by the module.

## Getting Started
This module is designed to be run by npm to facilitate testing of Lambda functions. To install it run:

```shell
npm install run-local-lambda --save-dev
```

Your Lambda function should have a package.json which you can modify to add a test script like so:

```js
"scripts": {
    "test": "run-local-lambda --file index.js --event tests/event.json --timeout 3"
}
```

Finally, you can invoke your test by simply running:

```shell
npm test
```

## Global Installation

You can also install this module globally and run it from the command line:

```shell
npm install -g run-local-lambda
```


To run your Lambda function, invoke the following:
```shell
run-local-lambda --file index.js --event event.json
```

## Overview
### Parameters
This module accepts the following parameters which are all optional.

* --file [lambda file name] 	- Lambda function file name. Default: index.js
* --event [event file name] 	- Event data file name. Default: event.json
* --handler [handler name]  	- Lambda function handler. Default: handler
* --timeout [timeout seconds] 	- The timeout in seconds. Default: 3

### Context
The context object provides the following public methods:
* context.succeed(Object result)
* context.fail(Error error)
* context.done(Error error, Object result)
* context.getRemainingTimeInMillis()

Please note that the implementation of these methods are approximations to enable Lambda functions to execute.
See [AWS docs](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html) for more information.  

### Event
The event data file can be provided using the --event parameter. An event is just a JSON object such as:

```js
{  
   "Records":[  
      {  
         "eventVersion":"2.0",
         "eventSource":"aws:s3",
         "awsRegion":"us-west-2",
         "eventTime":"1970-01-01T00:00:00.000Z",
         "eventName":"ObjectCreated:Put",
         "userIdentity":{  
            "principalId":"AIDAJDPLRKLG7UEXAMPLE"
         },
         "requestParameters":{  
            "sourceIPAddress":"127.0.0.1"
         },
         "responseElements":{  
            "x-amz-request-id":"C3D13FE58DE4C810",
            "x-amz-id-2":"FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
         },
         "s3":{  
            "s3SchemaVersion":"1.0",
            "configurationId":"testConfigRule",
            "bucket":{  
               "name":"sourcebucket",
               "ownerIdentity":{  
                  "principalId":"A3NL1KOZZKExample"
               },
               "arn":"arn:aws:s3:::sourcebucket"
            },
            "object":{  
               "key":"HappyFace.jpg",
               "size":1024,
               "eTag":"d41d8cd98f00b204e9800998ecf8427e",
               "versionId":"096fKKXTRTtl3on89fVO.nfljtsv6qko"
            }
         }
      }
   ]
}
```

See this [AWS documentation](http://docs.aws.amazon.com/lambda/latest/dg/with-s3-example-upload-deployment-pkg.html) for more information on testing Lambda functions manually.

## Contributing
There is no style guide so please try to follow the existing coding style. Please supply unit tests for any or modified functionality. Any and all PRs will be warmly welcomed.

## Release History
### 1.1.0
Updated to work with node.js 4.3 update of Lambda

### 1.0.0
Initial Release
