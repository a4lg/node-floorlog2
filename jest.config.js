// Because Jest doesn't support ES Moduler properly,
// we transpile library files along with tests.
export default
{
    'preset': 'ts-jest/presets/js-with-ts',
    'collectCoverage': true,
    'testMatch': [ '<rootDir>/tests/**/*.test.ts' ],
    'globals': {
        'ts-jest': {
            'tsconfig': './tsconfig.jest.json',
        },
    },
};
