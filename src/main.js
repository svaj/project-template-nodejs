import koa from 'koa';
import { Logger } from './lib/logger';

export const loggerInstance = Logger({
  level: 'debug',
});


export const main = (logger = loggerInstance) => {
  const app = new koa();
  // atttach logger
  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    logger.info({ method: ctx.method, url: ctx.url, responseTime: rt });
  });

  // response time - TODO: use hr.processTime
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });

  // response
  app.use(async ctx => {
    ctx.body = 'Hello World';
  });
  logger.info('App ready to listen');
  return app;
};

export default main;
