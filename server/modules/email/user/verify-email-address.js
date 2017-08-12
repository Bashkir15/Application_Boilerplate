'use strict';

const Token = require('../../../services/Token');
const { TOKEN_EXP_VERIFY_EMAIL } = process.env;

module.exports = (req, user) => {
	const payload = {
		id: user._id.toString(),
	};
	const token = Token.generate(payload, TOKEN_EXP_VERIFY_EMAIL);
	const route = `/email/verify/${token}`;
	const to = user.email;
	const subject = 'Verify Your Email';
	const data = { user, role };

	return { to, subject, data};
};
