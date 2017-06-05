const passport = require('passport');

module.exports = app => {
    app.use(passport.initialize());
    require('./strategies/bearer');
    require('./strategies/local');
};
