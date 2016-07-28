import express from 'express';

var router = express.Router();
var users = require('../controllers/users.server.controller')();

router.post('/', users.create);

module.exports = router;