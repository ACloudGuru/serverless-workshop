[![view on npm](http://img.shields.io/npm/v/stream-log-stats.svg)](https://www.npmjs.org/package/stream-log-stats)
[![npm module downloads](http://img.shields.io/npm/dt/stream-log-stats.svg)](https://www.npmjs.org/package/stream-log-stats)
[![Dependency Status](https://david-dm.org/75lb/stream-log-stats.svg)](https://david-dm.org/75lb/stream-log-stats)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# stream-log-stats
Presents a dynamic view of the incoming [common log format](http://en.wikipedia.org/wiki/Common_Log_Format) data to the console. The view is refreshed as new data streams in.

## Installation
Mac / Linux users may need to run the install commands with `sudo`.

### As a library
Move into your project directory then run:
```sh
$ npm install stream-log-stats --save
```

#### Example
```js
var connect = require('connect')
var morgan = require('morgan') // logging middleware
var http = require('http')
var logStats = require('stream-log-stats')

var app = connect()
app.use(morgan({ stream: logStats() }))

var server = http.createServer(app).listen(8000)
```

### As a command-line app
From any directory run the following:
```sh
$ npm install -g stream-log-stats
```

Now the `log-stats` utility is installed. Pipe in a common-log-format log to view the statistics.

#### Example
This example pipes the output from [local-web-server](https://www.npmjs.org/package/local-web-server) into `log-stats`.
```
$ ws -f common | log-stats
serving at http://localhost:8000
Clients  Requests  Transferred
1        48        2.79 MB

Extension          Requests  Transferred
.jpg               16        690.24 KB
.woff              7         1.39 MB
.css               6         128.84 KB
.js                4         311.44 KB
.png               3         16.93 KB
.3                 3         130.17 KB
.ttf               3         63.71 KB
.map               3         35.81 KB
.html              2         29.59 KB
<none>             1         19.96 KB

Resource                                                   Requests  Transferred
/_gh-pages/assets/images/75lb.png                          3         16.93 KB
...t-awesome-4.0.3/fonts/fontawesome-webfont.woff?v=4.0.3  3         130.17 KB
/_gh-pages/assets/fonts//Lombardic.ttf                     3         63.71 KB
/_gh-pages/assets/fonts/PTSansWeb/PTS76F_W.woff            3         535.03 KB
...s/assets/fonts/font-awesome-4.0.3/css/font-awesome.css  3         63.45 KB
/_gh-pages/assets/styles/screen.css                        3         65.39 KB
/_gh-pages/assets/styles/screen.css.map                    3         35.81 KB
/_gh-pages/assets/images/thumb/present-continuous.jpg      2         49.53 KB
/_gh-pages/assets/images/thumb/past-simple.jpg             2         82.27 KB
/_gh-pages/assets/fonts/PTSansWeb/PTS75F_W.woff            2         465.52 KB
```

* * *

&copy; 2015-16 Lloyd Brookes \<75pound@gmail.com\>.
