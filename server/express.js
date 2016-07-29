import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import ejs from 'ejs';
import compression from 'compression';
import path from 'path';

import indexRoutes from './routes/index.server.routes';
import userRoutes from './routes/users.server.routes';
import settingRoutes from './routes/settings.server.routes';

module.exports = function (db) {
	var app = express();

	app.set('views', path.join(__dirname, '../public'));
	app.set('view engine', 'ejs');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(morgan('dev'));
	app.use(compression());
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(express.static(path.join(__dirname, '../node_modules')))
	app.use(express.static(path.join(__dirname, '../dist')));
	app.use(function (req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
		next();
	});

	app.use('/', indexRoutes);
	app.use('/users', userRoutes);
	app.use('/settings', settingRoutes);

	return app;
};