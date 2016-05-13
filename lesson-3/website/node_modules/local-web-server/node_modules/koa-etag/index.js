
/**
 * Module dependencies.
 */

var calculate = require('etag');
var Stream = require('stream');
var fs = require('mz/fs');

/**
 * Expose `etag`.
 */

module.exports = etag;

/**
 * Add ETag header field.
 * @param {object} [options] see https://github.com/jshttp/etag#options
 * @param {boolean} [options.weak]
 * @return {Function}
 * @api public
 */

function etag(options) {
  return function *etag(next){
    yield* next;

    // no body
    var body = this.body;
    if (!body || this.response.get('ETag')) return;

    // type
    var status = this.status / 100 | 0;

    // 2xx
    if (2 != status) return;

    // hash
    var etag;
    if (body instanceof Stream) {
      if (!body.path) return;
      var s = yield fs.stat(body.path).catch(noop);
      if (!s) return;
      etag = calculate(s, options);
    } else if (('string' == typeof body) || Buffer.isBuffer(body)) {
      etag = calculate(body, options);
    } else {
      etag = calculate(JSON.stringify(body), options);
    }

    // add etag
    if (etag) this.response.etag = etag;
  }
}

function noop() {}
