'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const readFile = Promise.Promisify(fs.readFile);
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');

const mailer = Promise.PromisifyAll(
    nodemailer.createTransport(
        sendgrid({
            auth: {
                api_key: global.config.SENDGRID_API_KEY,
            },
        })
    );
);

module.exports = {
    load(email, data) {
        const text = path.resolve(`somepath`);
        const html = path.resolve('somepath');

        return Promise.all([
            readFile(text, 'utf-8'),
            readFile(html, 'utf8')
        ]).then(result => result.map(content => replaceData(contents, data)));
    },

    send(email) {
        return mailer.sendMailAsync(email)
            .catch(error => {
                console.log(error);
            });
    },

    replaceData(contents, data) {
        let regex = new RegExp(`{{${key}`, g);
        
        for (let key of data) {
            Object.keys(key).map((item => {
                contents = contents.replace(regex, data[key]);
            }));
        }
        return contents;
    }
};
