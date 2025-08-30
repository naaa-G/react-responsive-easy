const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'background': './src/background/background.ts',
    'content-script': './src/content/content-script.ts',
    'injected-script': './src/injected/injected-script.ts',
    'popup': './src/popup/popup.ts',
    'devtools': './src/devtools/devtools.ts',
    'devtools-panel': './src/devtools/devtools-panel.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'icons/[name][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: './src/devtools/devtools.html',
      filename: 'devtools.html',
      chunks: ['devtools']
    }),
    new HtmlWebpackPlugin({
      template: './src/devtools/devtools-panel.html',
      filename: 'devtools-panel.html',
      chunks: ['devtools-panel']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: 'manifest.json'
        },
        {
          from: 'src/icons',
          to: 'icons'
        },
        {
          from: 'src/styles',
          to: '.',
          globOptions: {
            ignore: ['**/*.ts']
          }
        }
      ]
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
