import path from 'path';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const createBabelConfig = require('./babel.config');

const { root } = path.parse(process.cwd());
const extensions = ['.js', '.ts', '.tsx'];

function external(id) {
  return !id.startsWith('.') && !id.startsWith(root);
}

function getBabelOptions(targets) {
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
}

function createPluginConfig(targets) {
  return [
    resolve({ extensions }),
    typescript({ useTsconfigDeclarationDir: true }),
    babel(getBabelOptions(targets)),
    sizeSnapshot(),
    terser(),
  ];
}

function createESMConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'esm' },
    plugins: createPluginConfig({ node: 8 }),
    external,
  };
}

function createCommonJSConfig(input, output) {
  return {
    input,
    preserveModules: true,
    output: { dir: output, format: 'cjs', exports: 'named' },
    plugins: createPluginConfig({ ie: 11 }),
    external,
  };
}

export default [
  createESMConfig('src/index.ts', 'dist/index.esm.js'),
  createCommonJSConfig('src/index.ts', 'dist'),
];
