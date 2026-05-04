const nodemailer = require('nodemailer');

const transport = (process.env.NODE_ENV !== 'production' || process.env.SKIP_EMAILS === 'true')
  ? nodemailer.createTransport({ streamTransport: true, newline: 'unix', buffer: true }) // logs email to console
  : nodemailer.createTransport({
      service: 'SendGrid',
      auth: { user: process.env.SG_USER, pass: process.env.SG_PASS }
    });

async function sendMail(opts) {
  if (process.env.SKIP_EMAILS === 'true') {
    console.log('Email skipped (SKIP_EMAILS=true):', opts);
    return;
  }
  return transport.sendMail(opts);
}

module.exports = { sendMail };