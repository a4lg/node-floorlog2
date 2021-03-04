// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Tsukasa OI.

import {
    floorLog2,
    floorLog2_PFinite,
    floorLog2_PFinite_portable,
    floorLog2_PFinite_dataview,
    pow2I
} from '../src/index';

// Note: this test assumes that `DataView` is supported (Node 0.10.0 or later)
const FUNCTIONS: Array<(x: number) => number> = [
    floorLog2_PFinite_portable,
    floorLog2_PFinite_dataview,
    floorLog2_PFinite,
];


describe('Module (portion): floorlog2 (log2)', () =>
{
    describe('Functions: floorLog2 family', () =>
    {
        it('Exact examples', () =>
        {
            for (const f of FUNCTIONS)
            {
                expect(f(0.25)).toStrictEqual(-2);
                expect(f(0.50)).toStrictEqual(-1);
                expect(f(1.00)).toStrictEqual(+0);
                expect(f(2.00)).toStrictEqual(+1);
                expect(f(4.00)).toStrictEqual(+2);
            }
        });
        it('Loose borders', () =>
        {
            for (const f of FUNCTIONS)
            {
                // Around 0.50
                expect(f(0.49)).toStrictEqual(-2);
                expect(f(0.50)).toStrictEqual(-1);
                expect(f(0.51)).toStrictEqual(-1);
                // Around 1.00
                expect(f(0.99)).toStrictEqual(-1);
                expect(f(1.00)).toStrictEqual(+0);
                expect(f(1.01)).toStrictEqual(+0);
                // Around 0.50
                expect(f(1.99)).toStrictEqual(+0);
                expect(f(2.00)).toStrictEqual(+1);
                expect(f(2.01)).toStrictEqual(+1);
            }
        });
        it('Named values', () =>
        {
            for (const f of FUNCTIONS)
            {
                expect(f(Math.E)).toStrictEqual(+1); // 2 < 2.718 < 4
                expect(f(Math.LN2)).toStrictEqual(-1); // 0.5 < 0.693 < 1
                expect(f(Math.LN10)).toStrictEqual(+1); // 2 < 2.303 < 4
                expect(f(Math.LOG2E)).toStrictEqual(0); // 1 < 1.443 < 2
                expect(f(Math.LOG10E)).toStrictEqual(-2); // 0.25 < 0.434 < 0.5
                expect(f(Math.PI)).toStrictEqual(+1); // 2 < 3.142 < 4
                expect(f(Math.SQRT1_2)).toStrictEqual(-1); // 0.5 < 0.707 < 1
                expect(f(Math.SQRT2)).toStrictEqual(0); // 1 < 1.414 < 2
            }
        });
        describe('IEEE 754 binary tests', () =>
        {
            it('Named values', () =>
            {
                for (const f of FUNCTIONS)
                {
                    expect(f(Number.MIN_VALUE)).toStrictEqual(-1074);
                    expect(f(Number.MAX_VALUE)).toStrictEqual(+1023);
                    expect(f(Number.EPSILON)).toStrictEqual(-52);
                    expect(f(Number.MAX_SAFE_INTEGER)).toStrictEqual(+52);
                }
            });
            it('Strict borders (normal)', () =>
            {
                for (const f of FUNCTIONS)
                {
                    // Range: finite and normal binary64 exponent
                    for (let e = -1022; e <= 1023; e++)
                    {
                        // Just below border (unless it is minimum possible normal exponent)
                        if (e !== -1022)
                        {
                            expect((1 - Number.EPSILON / 2) * pow2I(e)).toBeLessThan(pow2I(e));
                            expect(f((1 - Number.EPSILON / 2) * pow2I(e))).toStrictEqual(e - 1);
                        }
                        // On the border (by rounding)
                        expect((1 - Number.EPSILON / 4) * pow2I(e)).toStrictEqual(pow2I(e));
                        expect(f((1 - Number.EPSILON / 4) * pow2I(e))).toStrictEqual(e);
                        // On the border (exact)
                        expect(f(pow2I(e))).toStrictEqual(e);
                        // Just above the border
                        expect((1 + Number.EPSILON) * pow2I(e)).toBeGreaterThan(pow2I(e));
                        expect(f((1 + Number.EPSILON) * pow2I(e))).toStrictEqual(e);
                    }
                }
            });
            it('Strict borders (denormal)', () =>
            {
                for (const f of FUNCTIONS)
                {
                    // Range: finite and subnormal binary64 exponent
                    let v = Number.MIN_VALUE;
                    for (let e = -1074; e < -1022; e++)
                    {
                        v *= 2;
                        // Just below the border
                        expect(f(v - Number.MIN_VALUE)).toStrictEqual(e);
                        // On the border
                        expect(f(v)).toStrictEqual(e + 1);
                        // Just above the border (e !== -1023)
                        // or two steps above the border (e === -1023)
                        expect(f(v + Number.MIN_VALUE)).toStrictEqual(e + 1);
                    }
                }
            });
        });
    });
    describe('Function: floorLog2', () =>
    {
        it('Examples', () =>
        {
            expect(floorLog2(NaN)).toBeNaN();
            expect(floorLog2(-Infinity)).toBeNaN();
            expect(floorLog2(-1)).toBeNaN();
            expect(floorLog2(-0)).toStrictEqual(-Infinity); // negative zero is not strictly negative
            expect(floorLog2(+0)).toStrictEqual(-Infinity);
            expect(floorLog2(+1)).toStrictEqual(0);
            expect(floorLog2(+Infinity)).toStrictEqual(+Infinity);
        });
    });
});
