var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  resolve: {
    root: [__dirname + '/src']
  },
  entry: './src/app.js',
  output: { path: __dirname + '/build', filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          loader: 'file-loader',
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin("style.css")
  ]
}