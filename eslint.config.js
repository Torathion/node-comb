import shiny from 'eslint-config-shiny'

export default await shiny({ configs: ['node', 'format', 'vitest'], indent: true })
