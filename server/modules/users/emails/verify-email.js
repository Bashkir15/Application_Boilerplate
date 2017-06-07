'use strict';

const tokens = require('../../../helpers/Tokens');
const mailer = require('../../../helpers/Mailer');

function verifyEmailAddress(user) {
    let token = tokens.generate('verifyEmail', {
        id: user.id,
    });

    let data = {
        link: `/email/verify/${token}`,
        instructions: '',
        action: '',
    };

    return mailer.load('verify-email-address', data)
        .spread((text, html) => {
            to: user.email,
            from: 'asdfa',
            subject: '',
            text, html
        });
};
