'use strict';

const { resolve } = require('path');
const getRoot = require('app-root-dir').get;
const ROOT = getRoot();
const { NODE_ENV } = process.env;

module.exports = {
	entry: {
		app: resolve(ROOT, 'react/index.jsx'),
		vendor: ['react', 'react-dom', 'redux', 'react-redux'],
	},
	output: {
		filename: NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].js',
		path: resolve(ROOT, 'react/build'),
		publicPath: '/',
	},
	module: {
		rules: [{
			test: /\.js[x]?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					babelrc: false,
					compact: true,
					presets: [
						['env', {
							useBuiltIns: true,
							modules: false,
						}],
						'react',
						'babili'
					],
					plugins: [
						['transform-object-rest-spread', {
							useBuiltIns: true,
						}],
						'transform-class-properties',
					],
				},
			},
		}, {
			test: /\.sass$/,
			use: ['style-loader', 'css-loader', 'sass-loader'],
			exclude: /node_modules/
		}]
	},
	resolve: {
		extensions: ['js', '.jsx'],
	},
};
