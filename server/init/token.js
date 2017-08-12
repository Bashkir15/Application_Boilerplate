'use strict';

const Token = require('../services/Token');
const { SECRET } = process.env;

Token.setDefaults({
	secret: SECRET,
});
