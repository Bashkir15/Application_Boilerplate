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
    SERVER_LATENCY: env.SERVER_LATENCY,
    SERVER_LATENCY_MIN: env.SERVER_LATENCY_MIN,
    SERVER_LATENCY_MAX: env.SERVER_LATENCY_MAX,
    MONGODB_URI: env.MONGODB_URI,
    REFRESH_TOKEN_COOKIE_MAX_AGE: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
    SECURE_STATUS_EXPIRATION: env.SECURE_STATUS_EXPIRATION,
    TOKEN_DEFAULT_AUDIENCE: env.TOKEN_DEFAULT_AUDIENCE,
    TOKEN_DEFAULT_ISSUER: env.TOKEN_DEFAULT_ISSUER,
    ACCESS_SECRET: env.ACCESS_SECRET,
    REFRESH_SECRET: env.REFRESH_SECRET,
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

