'use strict';
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.join(__dirname, '../');
const publicDir = path.join(rootDir, 'server/src/public');

module.exports = {
    entry: "./src/app.js",
    output: {
        path: publicDir,
        filename: 'app.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|gif|svg|woff|woff2|eot|ttf)$/,
            use: {
                loader: 'url-loader',
                options: { limit: 10000 }
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: ['transform-runtime']
                }
            }
        }]
    },
    plugins: [
        new CleanWebpackPlugin(publicDir, { root: rootDir }),
        new CopyWebpackPlugin(['assets']),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            noUiSlider: 'nouislider',
            jcrop_api: 'jquery-jcrop'
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
};
