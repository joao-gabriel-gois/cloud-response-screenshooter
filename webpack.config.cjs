// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV == 'production';


const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.cjs'
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1, // disable creating additional chunks
      }),
    ],
    module: {
        rules: [
            {
              test: /\.(cjs|js|jsx)$/i,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
              }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    // resolve: {
    //   // modules: ['node_modules'],
    //   // extensions: ['.js', 'cjs'],
    //   fallback: {
    //     "crypto": require.resolve("crypto-browserify"), 
    //     "stream": require.resolve("stream-browserify"), 
    //     "assert": require.resolve("assert"), 
    //     "http": require.resolve("stream-http"), 
    //     "https": require.resolve("https-browserify"), 
    //     "os": require.resolve("os-browserify"), 
    //     "url": require.resolve("url")
    // },
    // },
    target: "node",

};

module.exports = () => {
    if (isProduction) {
      config.mode = 'production';
    } else {
      config.mode = 'development';
    }

    return config;
};
