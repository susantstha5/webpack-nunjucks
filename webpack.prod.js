const path = require('path');
const webpack=require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const buildPath = path.resolve(__dirname, 'dist');

const VENDORLIBS=['jquery','bootstrap','popper.js','./src/assets/css/vendor.scss'];



module.exports = {

  // devtool: 'source-map',
  devServer:{
    hot:true
  },
  entry:{
    app:'./src/assets/js/main.js',
    vendor: VENDORLIBS,
  },

  output: {
    filename: 'assets/js/[name].[hash:7].bundle.js',
    chunkFilename:'assets/js/[name].[hash:7].bundle.js',
    path: buildPath,
    publicPath:'/'
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      source: path.resolve(__dirname, '../src'), // Relative path of src
      images: path.resolve(__dirname, '../src/assets/images'), // Relative path of images
      // fonts: path.resolve(__dirname, '../src/assets/fonts'), // Relative path of fonts
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        // HTML LOADER
        // Super important: We need to test for the html
        // as well as the nunjucks files
        test: /\.html$|njk|nunjucks/,
        use: ['html-loader', {
          loader: 'nunjucks-html-loader',
          options: {
            // Other super important. This will be the base
            // directory in which webpack is going to find
            // the layout and any other file index.njk is calling.
            searchPaths: ['./src/views/partials']
          }
        }]
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)?(\?v=[0–9]\.[0–9]\.[0–9])?$/, 
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[hash:7].[ext]',
              // outputPath:'images/',
              // publicPath:'images/',
              limit: 3000
            }
          }
        ]
      }
    ]
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(), // cleans output.path by default
    new webpack.ProvidePlugin({
      jQuery:'jquery',
      $:'jquery',
      jquery:'jquery'
    }),
    new HtmlWebpackPlugin({
      template: './src/views/pages/index.njk',
      inject: true,
      // chunks:[],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/views/pages/about.njk',
      inject: true,
      filename: 'about.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/views/pages/contact.njk',
      inject: true,

      filename: 'contact.html'
    }),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].[hash:7].bundle.css",
      chunkFilename: "[id].[hash:7].css" //important part
    }),
  ],

  // https://webpack.js.org/configuration/optimization/
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({})
    ],
    // splitChunks: {
    //   cacheGroups: {
    //     default: false,
    //     vendors: false,
    //     // vendor chunk
    //     vendor: {
    //       // filename: 'assets/js/vendor.[hash:7].bundle.js',
    //       // sync + async chunks
    //       // chunks: 'all',
    //       chunks: 'all',
    //       name: 'vendor',
    //       test: 'vendor',
    //       enforce: true
    //     }
    //   }
    // }

  },
};
