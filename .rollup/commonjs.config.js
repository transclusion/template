import path from 'path'

import typescript from 'rollup-plugin-typescript2'

export default {
  input: path.resolve(__dirname, '../src/index.ts'),

  plugins: [typescript()],

  output: {
    file: path.resolve(__dirname, '../dist/template.commonjs.js'),
    format: 'cjs'
  }
}
