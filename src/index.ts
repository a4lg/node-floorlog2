// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Tsukasa OI <floss_js@irq.a4lg.com>.

/*
    1. Exact arithmetic of 2**n             (where n is an integer)
    2. Exact arithmetic of floor(log2(x))   (where n is a number)

    Precision of Math.pow and Math.log2 are implementation-defined.
    If we should handle IEEE754 binary64 number precisely,
    these functions should be used.
*/


/**
 * @internal
 * Indicates whether `ArrayBuffer` and `DataView` are supported.
 */
const isDataViewSupported: boolean = (
    typeof ArrayBuffer === 'function' &&
    typeof DataView === 'function' && 'setFloat64' in DataView.prototype
);


/**
 * @internal
 * "Power of two" table (but with offset)
 * @description
 *  This array corresponds to exponent range [-1074, 1023] but mapped to
 *  array index range [0, 1074+1023].
 */
const IEEE754_BINARY64_FINITE_POWER_OF_TWO: ReadonlyArray<number> = (function()
{
    const table: Array<number> = new Array<number>(2098);
    table[0] = Number.MIN_VALUE;
    for (let i = 1; i < 2098; ++i)
        table[i] = table[i - 1] * 2;
    return table;
})();


/**
 * Compute a power of two
 * @param x  A number representing an integer value
 *                    (may be out of range [-1074, 1023])
 * @returns  Exact value of `2**x` (may overflow or underflow).
 */
export function pow2I(x: number): number
{
    if (typeof x !== 'number' || x % 1 !== 0)
        throw new RangeError('The argument must be an integer.');
    if (x < -1074)
        return +0.0;
    if (x > 1023)
        return +Infinity;
    return IEEE754_BINARY64_FINITE_POWER_OF_TWO[(x + 1074) | 0];
}


/**
 * Compute IEEE 754 exponent (floored log2) of a positive finite number using portable method
 * @param x  A positive finite number (this property is assumed)
 * @returns  Exact value of `floor(log2(x))`
 * @description
 *  This function assumes that `x` is always a positive and finite number.
 */
export function floorLog2_PFinite_portable(x: number): number
{
    // assumption: x is a positive finite Number.
    let a = 0, b = 0, c = 2098;
    while (c - a >= 2)
    {
        b = (a + c) >> 1;
        if (x < IEEE754_BINARY64_FINITE_POWER_OF_TWO[b])
            c = b;
        else
            a = b;
    }
    return (a - 1074) | 0;
}


// istanbul ignore next
const _floorlog2_buffer: ArrayBuffer = isDataViewSupported ? new ArrayBuffer(8) : {} as unknown as ArrayBuffer;
// istanbul ignore next
const _floorlog2_view: DataView = isDataViewSupported ? new DataView(_floorlog2_buffer, 0) : {} as unknown as DataView;
/**
 * Compute IEEE 754 exponent (floored log2) of a positive finite number using ArrayBuffer and DataView
 * @param x  A positive finite number (this property is assumed)
 * @returns  Exact value of `floor(log2(x))`
 * @description
 *  This function assumes that `DataView` is supported and
 *  `x` is always a positive and finite number.
 */
export function floorLog2_PFinite_dataview(x: number): number
{
    // assumption: x is a positive finite Number.
    // assumption: DataView is supported.
    _floorlog2_view.setFloat64(0, x, true);
    const vh = _floorlog2_view.getInt32(4, true) >> 20;
    if (vh)
        return vh - 1023;
    /*
        Handle denormal numbers
        IEEE754_BINARY64_FINITE_POWER_OF_TWO[1126]: 2**52
        _floorlog2_view.getInt32(4, true) >> 20:    1 if x is 2**(-1074) [Number.MIN_VALUE]
          [-1075 can be calculated from this property]
    */
    _floorlog2_view.setFloat64(0, x * IEEE754_BINARY64_FINITE_POWER_OF_TWO[1126], true);
    return (_floorlog2_view.getInt32(4, true) >> 20) - 1075;
}


/**
 * Compute IEEE 754 exponent (floored log2) of a positive finite number
 * @param x  A positive finite number (this property is assumed)
 * @returns  Exact value of `floor(log2(x))`
 * @description
 *  This function assumes that `x` is always a positive and finite number.
 */
// istanbul ignore next
export const floorLog2_PFinite: (x: number) => number = isDataViewSupported ? floorLog2_PFinite_dataview : floorLog2_PFinite_portable;


/**
 * Compute IEEE 754 exponent (floored log2) of a number
 * @param x  A number
 * @returns
 * Exact value of `floor(log2(x))` except...
 *  - `x < 0`: NaN
 *  - `x == 0`: -Infinity
 *  - `x == +Infinity`: +Infinity
 */
export function floorLog2(x: number): number
{
    if (x < 0 || Number.isNaN(x))
        return NaN;
    if (x === 0)
        return -Infinity;
    if (x === Infinity)
        return +Infinity;
    return floorLog2_PFinite(x);
}
