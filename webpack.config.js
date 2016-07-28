var webpack = require('webpack');
var path = require('path');
var ENV = process.env.npm_lifecycle_event;

module.exports = (function makeWebpackConfig() {
	var config = {};

	config.entry = {
		app: './public/angular/app.js'
	};

	config.output = {
		path: path.resolve(__dirname, './dist/angular'),
		filename: '[name].bundle.js'
	};

	config.module = {
		preLoaders: [],
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}]
	};

	return config;
}());