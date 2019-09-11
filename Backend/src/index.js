'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const koaBody = require('koa-body');

const apis = require('./api/api');
const staticCache = require('koa-static-cache');
const path = require('path');

const PORT = 1234;
const app = new Koa();
const router = new Router();

app.use(logger());

app.use(
  koaBody({
    multipart: true,
    formLimit: '500mb',
    jsonLimit: '500mb',
    formidable: {
      maxFileSize: 500 * 1024 * 1024,
    },
  })
);

app.use(
  staticCache(path.join('./', 'src'), {
    maxAge: 365 * 24 * 60 * 60, //Add these files to caches for a year
  })
);

apis.api(router);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e);
    ctx.stalus = 500;
  }
});

app.use(router.routes());

app.listen(PORT, () => console.log('running on port ' + PORT));

const server = __TEST__
  ? http.createServer(app.callback())
  : app.listen(port).on('error', err => {
      conf.log.error(err);
    });
if (!__TEST__) {
  conf.log.verbose('users api server listening', { port });
  initializeProducer();
}

export default server;