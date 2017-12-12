import path from 'path'

import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify'

export default {
  input: path.resolve(__dirname, '../src/index.ts'),

  plugins: [typescript(), uglify()],

  output: {
    file: path.resolve(__dirname, '../dist/template.min.js'),
    format: 'umd',
    name: 'template'
  }
}
