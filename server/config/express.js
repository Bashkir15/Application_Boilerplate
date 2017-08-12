const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const errors = require('../modules/errors/index');
const authenticate = require('../middleware/authenticate');
const ensureValidOrigin = require('../middleware/ensureValidOrigin');
const BadRequestError = errors.BadRequestError;

require('../init/errorHandling');
require('../init/token');
require('../init/auth');

module.exports = (config) => {
    const app = express();
    app.use(cors({
        origin: APP_ORIGINS,
        credentials: true,
    }));
    app.use(compression({
        level: 3,
        filter(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
    }));
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    if (SERVER_LATENCY) {
        let latency = require('express-simulate-latency')({
            min: SERVER_LATENCY_MIN,
            max: SERVER_LATENCY_MAX,
        });
        app.use(latency);
    }

    app.use(ensureValidOrigin);
    app.use(authenticate);
    app.use(passport.initialize());
    // Yucky, This will need to move to a n actual server js file that runs the docs and demos page.
    app.use(express.static(path.join(__dirname, '../../client/static')));
    app.use(express.static(path.join(__dirname, '../../react/build')));
    app.get('/', (req, res, next) => {
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });
    app.get('/react/*', (req, res, next) => {
        res.sendFile(path.join(__dirname, '../../react/index.html'));
    });
    errors.middleware().forEach(handler => app.use(handler));

    return app;
};
