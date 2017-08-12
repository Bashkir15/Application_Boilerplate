'use strict';

const { Router } = require('express');
const user = require('./controller');
const { ensureAuthenticated, ensureScope } = require('../auth/controller');
const router = Router();

router.get('/',
	ensureAuthenticated(),
	ensureScope('user:read'),
	user.findByQuery,
	user.list,
);
router.post('/', 
	user.ensureUsernameNotInUse(),
	user.collectData,
	user.create,
	user.get
);

module.exports = router;
