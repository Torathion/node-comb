import shiny from 'eslint-config-shiny'

export default [
    ...await shiny({ configs: ['node', 'format', 'vitest'], indent: true }),
    {
        rules: {
            'unicorn/prefer-at': 0,
            'unicorn/no-nested-ternary': 0
        }
    }
]
