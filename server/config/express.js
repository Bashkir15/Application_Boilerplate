const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const httpStatus = require('http-status');
// const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const helmet = require('helmet');
const simpleLogger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const APIError = require('../helpers/APIError');
const userRoutes = require('../modules/users/routes');
const authRoutes = require('../modules/auth/routes');
const auth = require('../modules/auth/auth');
const tokens = require('../helpers/Tokens');

module.exports = () => {
    const app = express();
    const env = process.env.NODE_ENV || 'development';

    if (env === 'development') {
        app.use(simpleLogger('dev'));
    }

    tokens.setDefaults({
        issuer: 'localhost:8000',
        audience: 'localhost:8000',
    });
    tokens.register({
        access: {
            secret: 'test',
            expiration: 3600,
        },

        refresh: {
            secret: 'test',
            expiration: 30 * 24 * 3600,
        },
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(compress());
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(helmet());
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
        next();
    });

    auth(app);

    app.use((err, req, res, next) => {
        if (err instanceof expressValidation.ValidationError) {
            const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
            const error = new APIError(unifiedErrorMessage, err.status, true);
            return next(error);
        } else if (!(err instanceof APIError)) {
            const apiError = new APIError(err.message, err.status, err.isPublic);
            return next(apiError);
        }

        return next(err);
    });

   /* app.use((err, req, res) => {
        res.status(err.status).json({
            message: err.isPublic ? err.message : httpStatus[err.status],
            stack: env === 'development' ? err.stack : {},
        });
    }); */
    app.use(express.static(path.join(__dirname, '../../client/static')));
    app.get('/', (req, res, next) => {
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });
    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);

    return app;
};
