import express from 'express';
import auth from '../helpers/auth';

var router = express.Router();
var users = require('../controllers/users.server.controller')();

router.post('/', users.create);
router.post('/authenticate', users.authenticate);
router.get('/:userId', auth.justGetUser, users.single);

module.exports = router;