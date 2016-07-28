import nodemailer from 'nodemailer';

module.exports = {
	transport: nodemailer.createTransport('SMTP', {
		service: global.config.mailer.service,
		auth: {
			user: global.config.mailer.auth.user,
			pass: global.config.mailer.auth.pass
		}
	})
}