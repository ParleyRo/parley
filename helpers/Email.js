const nodemailer = require('nodemailer');
const config = require('../config'); // eslint-disable-line node/no-unpublished-require
const tracer = require('tracer').colorConsole({ level: config.app.logLevel })

class Email {
	// user object
	static async send(to, subject, messageText, messageHtml) { 
		try {
			// Create a config.email transporter object
			const transporter = nodemailer.createTransport({
					host: config.email.settings.host,
					port: config.email.settings.port,
					secure: config.email.settings.secure,
					auth: {
							user: config.email.settings.auth.user,
							pass: config.email.settings.auth.pass
					}
			});

			// Message object
			const message = {
					from: config.email.from,
					to: to,
					subject: subject,
					text: messageText,
					html: messageHtml
			};

			const emailResponse = await transporter.sendMail(message);
			return emailResponse;
		} catch (err) {
			tracer.error('Email -> send: %j', {
                to, subject, messageText, messageHtml,
                error: {
                    stack: err.stack,
                    message: err.message
                }
            })
			return false
		}
	}
}

module.exports = Email;
