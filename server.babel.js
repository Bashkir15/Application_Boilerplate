import mongoose from 'mongoose';
import http from 'http';
import expressConfig from './server/express'

/**
 *
 	Import Models Here
 *
 */

import Users from './server/models/users';
import Settings from './server/models/settings';
import Posts from './server/models/posts';
import Comments from './server/models/comments';

const environment = (process.env.NODE_ENV || 'develoment');
const appConfig = require(`./server/config/${environment}`);
const db = mongoose.connect(appConfig.db, () => {
	console.log('The application has connected to the ' + global.config.db + ' database');
});
const app = expressConfig(db);
const server = http.createServer(app);

server.listen(appConfig.port, () => {
	console.log(`The application is running at ${appConfig.server.host}${appConfig.server.port}, and the environment is currently ${environment}`);
});

global.config = appConfig;
