const path = require('path');
const ReplacePlugin = require('webpack-plugin-replace');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",

    entry: {
        content: './src/app/content.ts',
        background: './src/app/background.ts',
        popup: './src/ui/popup.tsx',
    },

    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
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
