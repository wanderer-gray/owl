const nodemailer = require('nodemailer');

let index = 0;
let accounts = [];

const refreshAccounts = async ({ log, knex }) => {
  log.trace('refreshAccounts');

  accounts = await knex('emailAccounts')
    .select('*');

  log.info(accounts);
};

module.exports = {
  refreshAccounts,
  sendMail: ({ to, subject, text }, { log, httpErrors }) => {
    if (!accounts || !accounts.length) {
      log.error('accounts not found');

      throw httpErrors.serviceUnavailable();
    }

    index = (index + 1) % accounts.length;
    const account = accounts[index];

    log.info(account);

    const {
      host,
      port,
      secure,
      user,
      pass,
    } = account;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    return transporter.sendMail({
      from: `"Сова" <${user}>`,
      to,
      subject,
      text,
    });
  },
};
