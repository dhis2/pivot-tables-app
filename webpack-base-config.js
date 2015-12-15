var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /d2-analysis/],
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-2'],
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=8192',
                    'img'
                ]
            },
        ],
    },
    plugins: [
        // Plugins to extend webpack functionality (https://webpack.github.io/docs/plugins.html)
        /* Example that provides `fetch` as a global variable
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
        */
        //new webpack.ProvidePlugin({
            //$: "jquery",
            //jQuery: "jquery",
            //"window.jQuery": "jquery"
        //}),
    ],
};
