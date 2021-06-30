const path = require('path');
const fastify = require('fastify');
const config = require('./config');

const app = fastify({
  logger: {
    level: 'trace',
  },
});

app.register(require('fastify-rate-limit'), config.sec.rate);

app.register(require('./api'), config);

app.register(require('fastify-static'), {
  root: path.join(__dirname, 'www'),
});

app.setNotFoundHandler((_, reply) => reply.sendFile('index.html'));

const init = async () => {
  try {
    await app.listen(config.app);
  } catch (err) {
    app.log.fatal(err);
    process.exit(1);
  }
};

init();
