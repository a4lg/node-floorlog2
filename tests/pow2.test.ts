// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Tsukasa OI.

import {
    pow2I
} from '../lib/index.js';


describe('Module (portion): floorlog2 (pow2)', () =>
{
    describe('Function: pow2I', () =>
    {
        it('Examples', () =>
        {
            expect(pow2I(-2)).toStrictEqual(0.25);
            expect(pow2I(-1)).toStrictEqual(0.50);
            expect(pow2I(-0)).toStrictEqual(1.00);
            expect(pow2I(+0)).toStrictEqual(1.00);
            expect(pow2I(+1)).toStrictEqual(2.00);
            expect(pow2I(+2)).toStrictEqual(4.00);
            expect(pow2I(+16)).toStrictEqual(65536);
            expect(pow2I(+32)).toStrictEqual(4294967296);
            expect(pow2I(-16)).toStrictEqual(1/65536);
            expect(pow2I(-32)).toStrictEqual(1/4294967296);
        });
        it('Invalid Examples (non-number)', () =>
        {
            expect(() => { pow2I(undefined as unknown as number); }).toThrow();
            expect(() => { pow2I(null as unknown as number); }).toThrow();
            expect(() => { pow2I('str' as unknown as number); }).toThrow();
            expect(() => { pow2I({} as unknown as number); }).toThrow();
            expect(() => { pow2I([] as unknown as number); }).toThrow();
            expect(() => { pow2I(pow2I as unknown as number); }).toThrow();
        });
        it('Invalid Example (not an integer)', () =>
        {
            expect(() => { pow2I(1.1); }).toThrow();
        });
        describe('IEEE 754 binary tests', () =>
        {
            it('Named values', () =>
            {
                expect(pow2I(-1074)).toStrictEqual(Number.MIN_VALUE);
                expect(pow2I(-52)).toStrictEqual(Number.EPSILON);
            });
            it('Invalid Example (non-integer and out of 32-bit integer range)', () =>
            {
                expect(() => { pow2I(pow2I(33) + 0.5); }).toThrow();
            });
            it('Example (integer but out of 32-bit integer range)', () =>
            {
                expect(pow2I(pow2I(33))).toStrictEqual(+Infinity);
                expect(pow2I(Number.MAX_VALUE)).toStrictEqual(+Infinity);
            });
            it('Ranges', () =>
            {
                for (let e = -2048; e <= 2048; e++)
                {
                    if (e < -1074)      // Less than minimum exponent: zero
                        expect(pow2I(e)).toStrictEqual(+0);
                    else if (e > 1023)  // Greater than maximum exponent: Infinity
                        expect(pow2I(e)).toStrictEqual(Infinity);
                    else
                    {
                        // Valid range: positive and finite
                        const value = pow2I(e);
                        expect(value).toBeGreaterThan(0);
                        expect(Number.isFinite(value)).toBe(true);
                    }
                }
            });
        });
    });
});
