[![view on npm](http://img.shields.io/npm/v/common-log-format.svg)](https://www.npmjs.org/package/common-log-format)
[![npm module downloads per month](http://img.shields.io/npm/dm/common-log-format.svg)](https://www.npmjs.org/package/common-log-format)
[![Build Status](https://travis-ci.org/75lb/common-log-format.svg?branch=master)](https://travis-ci.org/75lb/common-log-format)
[![Dependency Status](https://david-dm.org/75lb/common-log-format.svg)](https://david-dm.org/75lb/common-log-format)

#common-log-format
Pipe in [common log format](http://en.wikipedia.org/wiki/Common_Log_Format), get JSON out. Useful for converting web logs into a format more readily consumed by Javascript.

Standard log input such as:

```
127.0.0.1 - - [Wed, 11 Jun 2014 16:24:02 GMT] "GET / HTTP/1.1" 200 10305 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4"
127.0.0.1 - - [Wed, 11 Jun 2014 16:24:08 GMT] "GET /package.json HTTP/1.1" 304 - "http://localhost:8000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4"
```

would be converted to
```json
{"remoteHost":"127.0.0.1","remoteLogName":"-","authUser":"-","date":"2014-06-11T16:24:02.000Z","request":"GET / HTTP/1.1","status":200,"bytes":10305}{"remoteHost":"127.0.0.1","remoteLogName":"-","authUser":"-","date":"2014-06-11T16:24:08.000Z","request":"GET /package.json HTTP/1.1","status":304,"bytes":null}
```

##Usage
###As a library
```sh
$ npm install common-log-format
```

```js
var clf = require("common-log-format");
process.stdin.pipe(clf()).pipe(process.stdout);
```

###Command line
This will install the `clf` command line tool:
```sh
$ npm install -g common-log-format
```

```sh
$ cat my-web-log.txt | clf
{"remoteHost":"127.0.0.1","remoteLogName":"-","authUser":"-","date":"2014-06-11T16:05:26.000Z","request":"GET /package.json HTTP/1.1","status":200,"bytes":733}
```
