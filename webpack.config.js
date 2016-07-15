var path = require('path'),
	webpack = require("webpack"),
	ExtractTextPlugin = require("extract-text-webpack-plugin");


var config = {
	context: __dirname,
	entry: {
		'bundle': './demo/app.js'
	},
	output: {
		path: "dist",
		filename: "main.js"
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
				loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './src/')) + '/!html'
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					'style', // backup loader when not building .css file
					'css!sass' // loaders to preprocess CSS
				)
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
			underscore: 'underscore/underscore-min.js',
			uiRouter: 'angular-ui-router/release/angular-ui-router.min.js'
		}
	},
	plugins: [
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es/),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			_: "underscore"
		}),
		new ExtractTextPlugin('main.css')
	]
};

module.exports = config;
