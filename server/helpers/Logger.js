const winston = require('winston');

const Logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true,
        }),
    ],
});

module.exports = Logger;
