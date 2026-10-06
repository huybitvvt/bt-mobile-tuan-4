const path = require('node:path');
const { transformFileSync } = require('@babel/core');

module.exports = function loadSource(relativePath, stubs = {}) {
  const filename = path.join(__dirname, '..', relativePath);
  const { code } = transformFileSync(filename, {
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  });
  const sourceModule = { exports: {} };
  const sourceRequire = (name) => Object.hasOwn(stubs, name) ? stubs[name] : require(name);
  new Function('require', 'module', 'exports', code)(sourceRequire, sourceModule, sourceModule.exports);
  return sourceModule.exports;
};
