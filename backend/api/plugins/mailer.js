const nodemailer = require('nodemailer');

module.exports = () => {
  let index = 0;
  let accounts = [];

  const updateAccounts = async ({ log, knex }) => {
    log.trace('updateAccounts');

    accounts = await knex('emailAccounts')
      .select('*');

    log.info(accounts);
  };

  return {
    updateAccounts,
    sendMail: async ({ to, subject, text }, { log, knex, httpErrors }) => {
      if (!accounts || !accounts.length) {
        await updateAccounts({ log, knex });
      }

      if (!accounts || !accounts.length) {
        throw httpErrors.serviceUnavailable();
      }

      index = (index + 1) % accounts.length;

      const {
        host,
        port,
        secure,
        user,
        pass,
      } = accounts[index];

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      });

      const result = await transporter.sendMail({
        from: `"Сова" <${user}>`,
        to,
        subject,
        text,
      });

      log.info(result);
    },
  };
};
