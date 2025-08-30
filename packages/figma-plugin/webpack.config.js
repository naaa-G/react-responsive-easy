const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
  mode: argv.mode || 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    code: './src/code.ts', // Main plugin code
    ui: './src/ui.ts'      // UI code
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
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui.html',
      filename: 'ui.html',
      chunks: ['ui'],
      inject: 'body'
    })
  ],

  // Figma plugins run in a sandboxed environment
  target: 'node',
  
  // Optimize for production
  optimization: {
    minimize: argv.mode === 'production'
  }
});
