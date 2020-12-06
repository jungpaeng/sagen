import path from 'path';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
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

function createCommonJSConfig(input, output) {
  return {
    input,
    output: [{ dir: output, format: 'cjs', exports: 'named', sourcemap: true }],
    preserveModules: true,
    external,
    plugins: [
      resolve({ extensions }),
      typescript(),
      babel(getBabelOptions({ ie: 11 })),
      sizeSnapshot(),
      uglify(),
    ],
  };
}

export default [createCommonJSConfig('src/index.ts', 'dist')];
