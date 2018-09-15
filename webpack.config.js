const path = require('path');
const ShakePlugin = require('webpack-common-shake').Plugin;

module.exports = [{
  mode: 'production',
  entry: path.resolve(__dirname, 'lambda.js'),
  target: 'node',
  node: { fs: 'empty' },
  output: {
    path: __dirname,
    filename: 'redash-to-google-sheets.js',
  },
  plugins: [new ShakePlugin()],
}];
