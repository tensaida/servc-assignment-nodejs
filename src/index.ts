import "reflect-metadata"
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { Entity, PrimaryGeneratedColumn, Column, DataSourceOptions, DataSource } from 'typeorm';
import path from 'path';

const app = new Koa();
const router = new Router();

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  text!: string
}

@Entity() 
export default class Book {
  @PrimaryGeneratedColumn()
  uuid!: string;
  @Column()
  name!: string;
  @Column()
  isbn!: string;
  @Column()
  author!: string;
  @Column()
  releaseDate!: Date;
}

const PORT = 3000;
const root = path.resolve(__dirname, "..")
const dbOptions: DataSourceOptions = {
  type: 'sqlite',
  database: `${root}/db.sqlite`,
  entities: [Message, Book],
  // Automigrate tables from entities.
  synchronize: true,
  // logging: true
}
const db = new DataSource(dbOptions);

const main = async () => {
  await db.initialize();
  console.log(`db - online`);

  const message = new Message();
  message.text = 'sub bitches';
  await db.manager.save(message);
  console.log(`seeds - online`);

  // sample books
  const book1 = new Book();
  book1.name = "God of Small Things";
  book1.isbn = "123456789";
  book1.author = "Arundhati Roy";
  book1.releaseDate = new Date(2022, 11, 14);
  await db.manager.save(book1);
  console.log(`seeds - online`);

  router.get('/', async (ctx) => {
    const repository = db.getRepository(Message)
    const messages = await repository.find()
    ctx.body = messages;
  });

  router.get('/books', async (ctx) => {
    const repository = db.getRepository(Book)
    const books = await repository.find()
    ctx.body = books;
  });

  router.get('/books/:id', async (ctx) => {
    const repository = db.getRepository(Book)
    const book = await repository.findOne(
        { where:
            { uuid: ctx.params.id }
        }
    )
    ctx.body = book;
  });

  router.post('/books', async (ctx) => {
    
    const {
        uuid,
        name,
        isbn,
        author,
        releaseDate
    } = JSON.parse(JSON.stringify(ctx.request.body));
    
    const repository = db.getRepository(Book);

    const book = repository.create({
        uuid: uuid,
        name: name,
        isbn: isbn,
        author: author,
        releaseDate: releaseDate
    });

    const newBook = await db.manager.save(book);
    ctx.body = newBook;
  });

  router.put('/books/:id', async (ctx) => {

    const repository = db.getRepository(Book)
    const book = await repository.findOne(
        { where:
            { uuid: ctx.params.id }
        }
    )
    
    const {
        name,
        isbn,
        author,
        releaseDate
    } = JSON.parse(JSON.stringify(ctx.request.body));
     
    await repository.save({
        uuid: book?.uuid,
        name,
        isbn,
        author,
        releaseDate
    });
  });

  router.delete('/books/:id', async (ctx) => {
    const repository = db.getRepository(Book);
    await repository.delete({uuid: ctx.params.id});    
  });

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
