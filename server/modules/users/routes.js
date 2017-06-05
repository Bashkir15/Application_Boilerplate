const express = require('express');
const users = require('./controller');
const router = express.Router();

router.post('/', users.create);
router.post('/exists', users.exists);


module.exports = router;
