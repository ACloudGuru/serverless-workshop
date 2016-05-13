function makeKoaConnectHistoryApiFallbackAdapter (options) {
  const middleware = require('connect-history-api-fallback')(options)
  const noop = function () {}

  return function* koaConnectHistoryApiFallbackAdapter (next) {
    middleware(this, null, noop)
    yield next
  }
}

module.exports = makeKoaConnectHistoryApiFallbackAdapter
