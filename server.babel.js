import mongoose from 'mongoose';
import http from 'http';

/**
 *
 	Import Models Here
 *
 */

import Users from './server/models/users';

var configFile = require('./server/config/' + (process.env.NODE_ENV || 'development'));

global.config = configFile;

var db = mongoose.connect(global.config.db, () => {
	console.log('The application has connected to the ' + global.config.db + ' database');
});

var app = require('./server/express')(db);
var server = http.createServer(app);

global.server = server;

global.server.listen(global.config.server.port, () => {
	console.log('The application has connected to ' + global.config.server.host + global.config.server.port + ' and the environment is currently set to ' + (process.env.NODE_ENV || 'development'));
});