const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    open: true,
    hot: true, // позволяет не перезагружать страницу, а сразу менять на лету
    writeToDisk: true,
  },
  plugins: [
    // eslint-disable-next-line max-len
    new webpack.HotModuleReplacementPlugin(), // позволяет не перезагружать страницу, а сразу менять на лету (здесь он подключается)
  ],
});
