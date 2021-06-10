const nodemailer = require('nodemailer');
const { system } = require('../enums');

// @todo Необходимо оптимизировать метод получения аккаунтов
// @todo Необходимо случайным образом выбирать аккаунт для отправки почты
module.exports = async ({ to, subject, text }, { log, knex, httpErrors }) => {
  const accounts = await knex('system')
    .where('key', system.MAIL_SYS_ACCOUNTS)
    .first('value');

  log.info(accounts);

  if (!accounts.length) {
    log.error('system accounts with mail were not found');

    throw httpErrors.serviceUnavailable();
  }

  const testEmailAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testEmailAccount.user,
      pass: testEmailAccount.pass,
    },
  });

  const result = await transporter.sendMail({
    from: '"Сова" <nodejs@example.com>',
    to: to || 'user@example.com',
    subject: subject || 'Message from Node js',
    text: text || 'This message was sent from Node js server.',
  });

  return nodemailer.getTestMessageUrl(result);
};
