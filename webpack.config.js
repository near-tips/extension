const path = require('path');
const ReplacePlugin = require('webpack-plugin-replace');

module.exports = {
    mode: process.env.NODE_ENV,
    devtool: "inline-source-map",

    entry: {
        content: './src/content/content.js',
        background: './src/background/background.js',
        popup: './src/popup/popup.jsx',
    },

    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    },

    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            'utils': path.resolve(__dirname, 'src/utils/'),
        },
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },

    plugins: [
        new ReplacePlugin({
            include: /node_modules\/near-api-js/,
            'process.env.NODE_ENV': JSON.stringify('production'),
            patterns: [{
                regex: /window.location.assign\(newUrl.toString\(\)\);/g,
                value: 'chrome.tabs.update({ url: newUrl.toString() });'
            }],
        })
    ]
};
