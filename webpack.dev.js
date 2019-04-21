const webpack=require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const VENDORLIBS=['jquery','bootstrap','popper.js','./src/assets/css/vendor.scss'];
module.exports = {

  devServer: {
    hot:true,
    port: 8080,
    writeToDisk: false
  },

  entry:{
    vendor: VENDORLIBS,
    app:'./src/assets/js/main.js',
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
        test: /\.html$|njk|nunjucks/,
        use: ['html-loader', {
          loader: 'nunjucks-html-loader',
          options: {
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
    
    ],
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    // new webpack.ProvidePlugin({
    //   jQuery:'jquery',
    //   $:'jquery',
    //   jquery:'jquery'
    // }),
    new HtmlWebpackPlugin({
      template: './src/views/pages/index.njk',
      inject: true,
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
      filename: "assets/css/[name].css",
      chunkFilename: "[id].css" //important part
    }),
  ]
};