// SPDX-License-Identifier: MIT
// Copyright (C) 2021 Tsukasa OI.

import {
    pow2I,
    floorLog2,
    floorLog2_PFinite
} from '../lib/index.js';


describe('Module (portion): floorlog2 (composite)', () =>
{
    describe('Function: floorLog2_PFinite + pow2I', () =>
    {
        describe('IEEE 754 binary tests', () =>
        {
            it('Roundtrip', () =>
            {
                for (let e = -1074; e <= 1023; e++)
                    expect(floorLog2_PFinite(pow2I(e))).toStrictEqual(e);
            });
        });
    });
    describe('Function: floorLog2 + pow2I', () =>
    {
        describe('IEEE 754 binary tests', () =>
        {
            it('Roundtrip', () =>
            {
                for (let e = -1074; e <= 1023; e++)
                    expect(floorLog2(pow2I(e))).toStrictEqual(e);
            });
        });
    });
});
