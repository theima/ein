var webpackRxjsExternals = require('webpack-rxjs-externals');

module.exports = {
  entry: "./dist/src/index.js",
  output: {
    filename: "bundle/ein.umd.js",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: [
    webpackRxjsExternals()
  ],
  resolve: {
    extensions: [".js"]
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
  },
};
