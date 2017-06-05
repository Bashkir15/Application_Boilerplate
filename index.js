const mongoose = require('mongoose');
const http = require('http');
const promise = require('bluebird');
const dotenv = require('dotenv');
const expressConfig = require('./server/config/express')();

dotenv.load({
    path: '.env.example',
});

const { env } = process;
const appConfig = Object.assign({}, {
    SERVER_HOST: env.SERVER_HOST,
    SERVER_PORT: env.SERVER_PORT,
    MONGODB_URI: env.MONGODB_URI,
});

mongoose.Promise = promise;
mongoose.connect(appConfig.MONGODB_URI);
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${appConfig.MONGODB_URI}`);
});

/* if (appConfig.MONGOOSE_DEBUG) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
} */

const server = http.createServer(expressConfig);
server.listen(appConfig.SERVER_PORT, () => {
    console.log(`The application is running at: ${appConfig.SERVER_HOST}${appConfig.SERVER_PORT}`);
});


global.config = appConfig;
module.exports = server;
