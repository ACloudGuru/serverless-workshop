[![view on npm](http://img.shields.io/npm/v/byte-size.svg)](https://www.npmjs.org/package/byte-size)
[![npm module downloads per month](http://img.shields.io/npm/dm/byte-size.svg)](https://www.npmjs.org/package/byte-size)
[![Build Status](https://travis-ci.org/75lb/byte-size.svg?branch=master)](https://travis-ci.org/75lb/byte-size)
[![Dependency Status](https://david-dm.org/75lb/byte-size.svg)](https://david-dm.org/75lb/byte-size)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

<a name="module_byte-size"></a>
## byte-size
Convert a bytes value to a more human-readable format. Choose between [metric or IEC units](https://en.wikipedia.org/wiki/Gigabyte), summarised below.

Value | Metric
----- | -------------
1000  | kB  kilobyte
1000^2 | MB  megabyte
1000^3 | GB  gigabyte
1000^4 | TB  terabyte
1000^5 | PB  petabyte
1000^6 | EB  exabyte
1000^7 | ZB  zettabyte
1000^8 | YB  yottabyte

Value | IEC
----- | ------------
1024  | KiB kibibyte
1024^2 | MiB mebibyte
1024^3 | GiB gibibyte
1024^4 | TiB tebibyte
1024^5 | PiB pebibyte
1024^6 | EiB exbibyte
1024^7 | ZiB zebibyte
1024^8 | YiB yobibyte

<a name="exp_module_byte-size--byteSize"></a>
### byteSize(bytes, [options]) ⇒ <code>string</code> ⏏
**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bytes | <code>number</code> |  | the bytes value to convert |
| [options] | <code>object</code> |  | optional config |
| [options.precision] | <code>number</code> | <code>1</code> | number of decimal places |
| [options.units] | <code>string</code> | <code>&quot;metric&quot;</code> | select `"metric"` or `"iec"` units |

**Example**  
```js
> var byteSize = require("byte-size")

> byteSize(1580)
'1.6 kB'

> byteSize(1580, { units: 'iec' })
'1.5 KiB'

> byteSize(1580, { units: 'iec', precision: 3 })
'1.543 KiB'

> byteSize(1580, { units: 'iec', precision: 0 })
'2 KiB'
```

* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
