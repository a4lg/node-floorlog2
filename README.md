floorlog2: Exact arithmetic of binary logarithm with floor
===========================================================

When we handle exponent of a number (e.g. to extract IEEE 754 binary
exponent value of a number x), we should handle `floor(log2(x))` precisely.

This library defines `floorLog2` function which calculates exact value of
`floor(log2(x))` for number `x`.  Note that precision of `Math.pow` and
`Math.log2` as defined in ECMA-262 is implementation-defined and
`Math.floor` is not effective if a result of `Math.log2` is already
rounded up.

In fact, simple `so_called_floorlog2` function fails on many JavaScript
environments.  Try following example:

```js
function so_called_floorlog2(x)
{
    return Math.floor(Math.log2(x));
}

// 52 is expected but 53 is returned on many environments
console.log(so_called_floorlog2(2**53-1));
```

That's exactly why this library is here.

This library also defines `pow2I` which calculates exact value of
`2**x` for integer `x`.


How to use it? (CommonJS)
--------------------------

Simple!

```js
const floorlog2 = require('floorlog2');

let floorlog2_of_pi = floorlog2.floorLog2(Math.PI);
// floorlog2_of_pi === 1
// (because 2**1 < Math.PI < 2**2)

let pow2_of_16 = floorlog2.pow2I(16);  // argument must be an integer
// pow2_of_16 === 65536
```


How to use it? (ES Modules)
----------------------------

It's also simple!

```js
import { floorLog2, pow2I } from 'floorlog2';

let floorlog2_of_pi = floorLog2(Math.PI);
// floorlog2_of_pi === 1
// (because 2**1 < Math.PI < 2**2)

let pow2_of_16 = pow2I(16);  // argument must be an integer
// pow2_of_16 === 65536
```
