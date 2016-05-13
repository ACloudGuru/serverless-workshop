var test = require('tape')
var byteSize = require('../')

test('metric', function (t) {
  t.equal(byteSize(1000), '1.0 kB')
  t.equal(byteSize(10000), '10.0 kB')
  t.equal(byteSize(34565346), '34.6 MB')
  t.equal(byteSize(56356534635465), '56.4 TB')
  t.equal(byteSize(42436356534635465), '42.4 PB')
  t.equal(byteSize(5342436356534635465), '5.3 EB')
  t.equal(byteSize(234235342436356534635465), '234.2 ZB')
  t.equal(byteSize(345234235342436356534635465), '345.2 YB')
  t.equal(byteSize(3234545234235342436356534635465), 3.2345452342353426e+30)
  t.end()
})

test('iec', function (t) {
  var options = { units: 'iec' }
  t.equal(byteSize(1000, options), '1000 B')
  t.equal(byteSize(10000, options), '9.8 KiB')
  t.equal(byteSize(34565346, options), '33.0 MiB')
  t.equal(byteSize(56356534635465, options), '51.3 TiB')
  t.equal(byteSize(42436356534635465, options), '37.7 PiB')
  t.equal(byteSize(5342436356534635465, options), '4.6 EiB')
  t.equal(byteSize(234235342436356534635465, options), '198.4 ZiB')
  t.equal(byteSize(345234235342436356534635465, options), '285.6 YiB')
  t.equal(byteSize(3234545234235342436356534635465, options), 3.2345452342353426e+30)
  t.equal(byteSize(9873234545234235342436356534635465, options), 9.873234545234235e+33)
  t.end()
})

test('precision', function (t) {
  t.equal(byteSize(10, { precision: 0 }), '10 B')
  t.equal(byteSize(15, { precision: 2 }), '15 B')
  t.equal(byteSize(1500, { precision: 0 }), '2 kB')
  t.equal(byteSize(1500, { precision: 2 }), '1.50 kB')
  t.equal(byteSize(1500000, { precision: 5 }), '1.50000 MB')
  t.end()
})
