'use strict';

const { Router } = require('epxress');
const auth = require('./controller');
const router = Router();

router.get('/forget', auth.forget);
router.post('/token', auth.token);

module.exports = router;
