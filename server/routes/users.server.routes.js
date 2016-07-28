import express from 'express';
import auth from '../helpers/auth';

var router = express.Router();
var users = require('../controllers/users.server.controller')();

router.post('/', users.create);
router.post('/authenticate', users.authenticate);
router.get('/forgot', users.forgot);
router.post('/forgot/:token', users.processReset);
router.get('/:name', auth.justGetUser, users.single);
router.post('/:name/follow', auth.ensureAuthorized, users.follow);
router.post('/:name/unfollow', auth.ensureAuthorized, users.unfollow);
router.get('/:name/profile', auth.justGetUser, users.profile);
router.get('/search/:keyword', auth.justGetUser, users.search);
module.exports = router;