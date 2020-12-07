import path from 'path';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const createBabelConfig = require('./babel.config');

const { root } = path.parse(process.cwd());
const external = (id) => !id.startsWith('.') && !id.startsWith(root);
const extensions = ['.js', '.ts', '.tsx'];
const getBabelOptions = (targets) => {
  const config = createBabelConfig({ env: (env) => env === 'build' }, targets);
  if (targets.ie) {
    config.plugins = [
      ...config.plugins,
      '@babel/plugin-transform-regenerator',
      ['@babel/plugin-transform-runtime', { helpers: true, regenerator: true }],
    ];
    config.babelHelpers = 'runtime';
  }
  return {
    ...config,
    extensions,
  };
};

function createESMConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'esm' },
    external,
    plugins: [
      resolve({ extensions }),
      typescript(),
      babel(getBabelOptions({ node: 8 })),
      sizeSnapshot(),
      terser(),
    ],
  };
}

function createCommonJSConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'cjs', exports: 'named' },
    external,
    plugins: [
      resolve({ extensions }),
      typescript(),
      babel(getBabelOptions({ ie: 11 })),
      sizeSnapshot(),
      terser(),
    ],
  };
}

function createIIFEConfig(input, output, globalName) {
  return {
    input,
    output: {
      file: output,
      format: 'iife',
      exports: 'named',
      name: globalName,
      globals: {
        react: 'React',
        '@babel/runtime/regenerator': 'regeneratorRuntime',
      },
    },
    external,
    plugins: [
      resolve({ extensions }),
      typescript(),
      babel(getBabelOptions({ ie: 11 })),
      sizeSnapshot(),
      terser(),
    ],
  };
}

export default [
  createESMConfig('src/index.ts', 'dist/index.js'),
  createCommonJSConfig('src/index.ts', 'dist/index.cjs.js'),
  createIIFEConfig('src/index.ts', 'dist/index.iife.js', 'sagen'),
];
