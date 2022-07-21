const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: abs('dist'),
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  abs('src'),
                  abs('node_modules'),
                  abs('node_modules/bootstrap-sass/assets/stylesheets')
                ],
                precision: 8
                // sourceMap: true
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Working example of minimal MVC'
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

module.exports = config;

/**
 * abs
 */
function abs(pathstr) {
  return path.join(__dirname, pathstr);
}
