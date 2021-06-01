const path = require('path');
const fastify = require('fastify');
const config = require('./config');

const app = fastify({
  logger: {
    level: 'debug',
  },
});

app.register(require('./sec'), config);

app.register(require('./api'), config);

app.register(require('fastify-static'), {
  root: path.join(__dirname, 'www'),
});

app.listen(config.app, (err) => {
  if (err) {
    app.log.fatal(err);
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(app.printRoutes());
  }
});
