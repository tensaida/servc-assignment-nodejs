import Book from '../entity/Book';
import db from './data-source';

const bookRepository = db.getRepository(Book);

export { bookRepository };