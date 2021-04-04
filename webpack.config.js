var webpackRxjsExternals = require('webpack-rxjs-externals');

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle/ein.umd.js",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: [
    webpackRxjsExternals()
  ],
  resolve: {
    extensions: [".ts",".js"]
  },
  mode: 'none',
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
