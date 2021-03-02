module.exports = {
    'root': true,
    'env': {
        'es2020': true,
        'node': true,
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'sourceType': 'module',
        'project': ['./tsconfig.eslint.json'],
    },
    'plugins': [
        '@typescript-eslint',
        'eslint-plugin-import',
    ],
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    'ignorePatterns': [
        '/coverage/',
        '/docs/',
        '/lib/**/*.js',
        '/lib/**/*.d.ts',
        '/lib.cjs/**/*.cjs',
        '/lib.cjs/**/*.d.ts',
    ],
    'rules': {
        'indent':            ['error', 4, { 'SwitchCase': 1 }],
        'eol-last':          ['error', 'always'],
        'semi':              ['error', 'always'],
        'no-extra-semi':      'error',
        'quotes':            ['error', 'single'],
        'eqeqeq':             'error',
        'default-case-last':  'error',
        'radix':              'error',
        'import/extensions': ['error', 'ignorePackages'],
    },
};
