var path = require('path'),
    webpack = require("webpack");

var config = {
    context: __dirname,
    entry: {
        // 'bundle': './src/index.js',
        'bundle': './app.js'
    },
    output: {
        path: "dist",
        filename: "[name].js"
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'absolut'
            }
        ],
        loaders: [
            { test: /\.json$/, loader: "json-loader" },
            {
                test: /\.html$/,
                loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './')) + '/!html'
            }
        ]
    },
    resolve: {
        modulesDirectories: ['.', 'node_modules'],
        alias: {
            'angular-translate': 'angular-translate/dist/angular-translate.min.js',
            duScroll: 'angular-scroll/angular-scroll.min.js',
            d3: 'd3/d3.min.js',
            jquery: 'jquery/dist/jquery.min.js',
            moment: 'moment/moment.js',
            underscore: 'underscore/underscore-min.js'
        }
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            _: "underscore"
        })
    ]
};

module.exports = config;
