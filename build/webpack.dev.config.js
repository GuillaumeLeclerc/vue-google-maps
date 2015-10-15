// This config file is for development setup using
// webpack-dev-server.

var vue = require('vue-loader')

module.exports = {
  entry: './src/main.js',
  output: {
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: vue.withLoaders({
          // apply babel transform to all javascript
          // inside *.vue files.
          js: 'babel?optional[]=runtime&loose=true'
        })
      }
    ]
  },
  devtool: '#source-map'
}
