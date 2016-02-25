var webpack = require('webpack');

var production = "production" === process.env.NODE_ENV;

var entry = ['./src/index'];

if (!production) {
  entry = [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server'
  ].concat(entry);
}

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: {
    path: __dirname + '/static',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /(\.jsx|\.js)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass?sourceMap'
    }, {
      test: /\.png$/,
      loader: 'file'
    }]
  },
  devServer: {
    hot: true,
    stats: {
      color: true,
      chunks: false
    },
    historyApiFallback: true
  }
};
