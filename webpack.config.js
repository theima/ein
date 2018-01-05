module.exports = {
  entry: "./dist/src/index.js",
  output: {
    filename: "dist/bundle/ein.umd.js",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".js"]
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      }
    ]
  }
};
