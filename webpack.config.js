const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const plugins = [
  new HtmlWebpackPlugin({
    template: path.join(__dirname, './src/index.html'),
    path: path.join(__dirname, './dist'),
    filename: 'index.html',
    minify: {
      collapseWhitespace: false,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true,
    },
  }),
  new ExtractTextPlugin('css/styles.css')
];

if (process.env.NODE_ENV !== 'production') {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  entry: './src/app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      'last 3 version',
                      'ie >= 10',
                    ],
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              },
            }
          ]
        }),
      },
      {
        test: /\.(woff2|woff|ttf|eot|svg|otf)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: path.resolve(__dirname, 'src'),
        loader: ['url-loader?name=fonts/[name].[hash].[ext]']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: false,
              collapseWhitespace: false
            }
          }
        ]
      },
    ]
  },
  plugins,
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
