var path = require('path');
const { ContextReplacementPlugin, ProvidePlugin, optimize } = require('webpack');
const { OccurrenceOrderPlugin, DedupePlugin, CommonsChunkPlugin } = optimize;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const LabComponentsTextExtractor = new ExtractTextPlugin({
	filename: 'main.css',
	allChunks: true,
	ignoreOrder: true
});

var config = {
	context: path.join(__dirname, ''),
	entry: {
		'bundle': './demo/app.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: "main.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [{ loader: 'absolut-loader' }],
				enforce: 'pre'
			},
			{
				test: /\.json$/,
				use: [{ loader: 'json-loader' }]
			},
			{
				test: /\.html$/,
				use: [
					{ loader: `ngtemplate-loader?relativeTo=${(path.resolve(__dirname, './'))}/` },
					{ loader: 'html-loader' }
				]
			},
			{
				test: /\.scss$/,
				use: LabComponentsTextExtractor.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
								minimize: true,
								sourceMap: true
							}
						},
						{
							loader: 'sass-loader'
						}
					]
				})
			},
			{
				test: /\.(png|svg|gif)$/,
				use: [{loader: 'url-loader'}]
			}
		]
	},
	resolve: {
		alias: {
			'angular-translate': 'angular-translate/dist/angular-translate.min.js',
			duScroll: 'angular-scroll/angular-scroll.min.js',
			// d3: 'd3/d3.min.js',
			jquery: 'jquery/dist/jquery.min.js',
			moment: 'moment/moment.js',
			underscore: 'underscore/underscore-min.js',
			uiRouter: 'angular-ui-router/release/angular-ui-router.min.js'
		}
	},
	plugins: [
		new ContextReplacementPlugin(/moment[\/\\]locale$/, /es/),
		new OccurrenceOrderPlugin(),
		new ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			_: "underscore"
		}),
		LabComponentsTextExtractor
	]
};

module.exports = config;
