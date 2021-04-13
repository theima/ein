/*eslint-disable*/
var prod = require('./webpack.config.js');
var dev = Object.assign({}, prod);
dev.mode = 'development';
dev.output.devtoolModuleFilenameTemplate = '../.[resource-path]';
module.exports = dev;
