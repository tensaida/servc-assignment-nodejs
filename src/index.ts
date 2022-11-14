import "reflect-metadata"
import Koa from 'koa';
import router from './routes';
import bodyParser from 'koa-bodyparser';
import db from "./database/data-source";

const app = new Koa();

const PORT = 3000;

const main = async () => {
  await db.initialize();
  console.log(`db - online`);

  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  });

  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });

  app.use(bodyParser());
  app.use(router.routes());

  app.listen(PORT);
  console.log(`app - online, port ${PORT}`);
};

main().then(() => console.log('all systems nominal')).catch(console.error)