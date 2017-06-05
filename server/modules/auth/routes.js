const express = require('express');
const auth = require('./controller');
const router = express.Router();

router.post('/token', auth.token);

module.exports = router;