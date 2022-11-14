import Book from '../model/Book';
import Message from '../model/Message';
import db from './connection';

const bookRepository = db.getRepository(Book);
const messageRepository = db.getRepository(Message);

export { bookRepository, messageRepository };