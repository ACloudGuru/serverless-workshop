'use strict';
/**
 * Module dependencies.
 */

 const debug = require('debug')('koa-rewrite');
 const toRegexp = require('path-to-regexp');

/**
 * Expose `expose`.
 */

module.exports = rewrite;

/**
 * Rwrite `src` to `dst`.
 *
 * @param {String|RegExp} src
 * @param {String} dst
 * @return {Function}
 * @api public
 */

function rewrite(src, dst) {
  const keys = [];
  const re = toRegexp(src, keys);
  const map = toMap(keys);

  debug('rewrite %s -> %s    %s', src, dst, re);

  return function(ctx, next) {
    const orig = ctx.url;
    const m = re.exec(orig);

    if (m) {
      ctx.url = dst.replace(/\$(\d+)|(?::(\w+))/g, (_, n, name) => {
        if (name) return m[map[name].index + 1];
        return m[n];
      });

      debug('rewrite %s -> %s', orig, ctx.url);

      return next().then(() => {
        ctx.url = orig;
      });
    }

    return next();
  }
}

/**
 * Turn params array into a map for quick lookup.
 *
 * @param {Array} params
 * @return {Object}
 * @api private
 */

function toMap(params) {
  const map = {};

  params.forEach((param, i) => {
    param.index = i;
    map[param.name] = param;
  });

  return map;
}
