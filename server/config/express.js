const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const helmet = require('helmet');
const simpleLogger = require('morgan');
const APIError = require('../helpers/APIError');
import Logger from '../helpers/Logger';

module.exports = () => {
    const app = express();
    const env = process.env.NODE_ENV || 'development';

    if (env === 'development') {
        app.use(simpleLogger('dev'));
       /* expressWinston.requestWhitelist.push('body');
        expressWinston.responseWhitelist.push('body');
        app.use(expressWinston.logger({
            Logger,
            meta: true,
            msg: '{{HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
            colorStatus: true,
        })); */
    }

   /* if (env !== 'test') {
        app.use(expressWinston.errorLogger({
            Logger,
        }));
    } */


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(compress());
    app.use(methodOverride());
    app.use(helmet());
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
        next();
    });

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

    app.use((err, req, res) => {
        res.status(err.status).json({
            message: err.isPublic ? err.message : httpStatus[err.status],
            stack: env === 'development' ? err.stack : {},
        });
    });
};
