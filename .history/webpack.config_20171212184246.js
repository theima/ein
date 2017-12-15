var webpackRxjsExternals = require('webpack-rxjs-externals');

module.exports = {
  entry: './dist/src/index.js',
  output: {
    filename: 'dist/bundle/glo.umd.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: [
    webpackRxjsExternals()
  ],
  resolve: {
    extensions: ['.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  }
}
