var webpack      = require('webpack');
var autoprefixer = require('autoprefixer');
var precss       = require('precss');

var production = "production" === process.env.NODE_ENV;

var entry = ['./src/index'];

if (!production) {
  entry = [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/dev-server'
  ].concat(entry);
}

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: {
    path: __dirname + '/static',
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
       __DEV__: !production,
       'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"'
    }),
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
      test: /\.css$/,
      loader: 'style!css!postcss'
    }, {
      test: /\.png$/,
      loader: 'file'
    }]
  },
  postcss: function() { return [autoprefixer, precss] },
  devServer: {
    stats: {
      color: true,
      chunks: false
    },
    historyApiFallback: true
  }
};
