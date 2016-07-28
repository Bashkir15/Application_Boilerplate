import express from 'express';
import auth from '../helpers/auth';

var router = express.Router();
var users = require('../controllers/users.server.controller')();

router.post('/', users.create);
router.post('/authenticate', users.authenticate);
router.get('/recent', users.recent);
router.get('/forgot', users.forgot);
router.post('/forgot/:token', users.processReset);
router.get('/:username', auth.justGetUser, users.single);
router.post('/:username/follow', auth.ensureAuthorized, users.follow);
router.post('/:username/unfollow', auth.ensureAuthorized, users.unfollow);
router.get('/:username/profile', auth.justGetUser, users.profile);
router.delete('/:username/destroy', auth.ensureAuthorized, users.destroy);
router.get('/search/:keyword', auth.justGetUser, users.search);
module.exports = router;