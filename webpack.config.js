var webpackRxjsExternals = require('webpack-rxjs-externals');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle/ein.umd.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: '.[resource-path]'
  },
  devtool: 'source-map',
  externals: [webpackRxjsExternals()],
  resolve: {
    extensions: ['.ts', '.js']
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
