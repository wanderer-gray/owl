const path = require('path');
const fastify = require('fastify');
const config = require('./config');

const app = fastify({
  logger: {
    level: 'trace',
  },
});

app.register(require('./sec'), config);

app.register(require('./api'), config);

app.register(require('fastify-static'), {
  root: path.join(__dirname, 'www'),
});

const init = async () => {
  try {
    await app.listen(config.app);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(app.printRoutes());
    }
  } catch (err) {
    app.log.fatal(err);
    process.exit(1);
  }
};

init();
