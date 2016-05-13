
# koa-conditional-get [![Build Status](https://travis-ci.org/koajs/conditional-get.png)](https://travis-ci.org/koajs/conditional-get)

 Conditional GET support for koa.

## Installation

```js
$ npm install koa-conditional-get
```

## Example

```js
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
var koa = require('koa');
var app = koa();

// use it upstream from etag so
// that they are present

app.use(conditional());

// add etags

app.use(etag());

// respond

app.use(function *(next){
  yield next;

  this.body = {
    name: 'tobi',
    species: 'ferret',
    age: 2
  };
})

app.listen(3000);

console.log('listening on port 3000');
```

## License

  MIT