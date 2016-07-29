import express from 'express';
import auth from '../helpers/auth';

var router = express.Router();
var settings = require('../controllers/settings.server.controller')();

router.post('/', auth.ensureAuthorized, settings.create);
router.get('/', auth.justGetUser, settings.get);

module.exports = router;