import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import ejs from 'ejs';
import compression from 'compression';
import path from 'path';

import indexRoutes from './routes/index.server.routes';

module.exports = function (db) {
	let app = express();

	app.set('views', path.join(__dirname, '../public'));
	app.set('view engine', 'ejs');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(morgan('dev'));
	app.use(compression());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static(path.join(__dirname, 'dist')));

	app.use('/', indexRoutes);

	return app;
};