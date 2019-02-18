const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const plugins = [new HtmlWebpackPlugin({
    template: 'client/index.html',
    filename: 'index.html',
    inject: 'body'
})];

module.exports = {
    entry: './client/index.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'app.bundle.js'
    },
    devServer: {
      proxy: {
        '/socket.io': {
          target: 'http://localhost:8080',
          ws: true
        }
      }
    }
};