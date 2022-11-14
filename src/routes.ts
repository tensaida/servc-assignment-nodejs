import Router from '@koa/router';
// import multer from '@koa/multer';
import BookController from './controller/BookController';

const router = new Router();

// const upload = multer();
router.post("/books", BookController.create);
router.get("/books", BookController.getAll);
router.get("/books/:id", BookController.getOne)

export default router;