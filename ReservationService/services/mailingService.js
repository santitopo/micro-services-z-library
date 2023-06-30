const config = require('../config');
const { logError } = require('../utils');
const nodeMailer = require('nodemailer');
module.exports = class MailingService {
  constructor() {
    this.transporter = nodeMailer.createTransport({
      service: 'hotmail',
      auth: {
        user: config.mailUser,
        pass: config.mailPassword
      }
    });
  }
  sendMail(address, body, subject) {
    const options = {
      from: config.mailUser,
      to: address,
      subject,
      text: body
    };
    this.transporter.sendMail(options, (err, info) => {
      if (err) {
        logError(err);
        return;
      }
    });
  }

  // options is the SMTP transport options object used with Nodemailer
  async checkConnection() {
    return new Promise((resolve, reject) => {
      this.transporter.verify(function (error, success) {
        if (error) {
          resolve('Down');
        } else {
          resolve('Ok');
        }
      });
    });
  }
};
