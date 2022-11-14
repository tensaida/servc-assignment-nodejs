import { bookRepository as repository } from '../database/repositories';
import * as Yup from 'yup';
import Book from "../model/Book";

export default {

    async create(ctx: any) {

        const {
            uuid,
            name,
            isbn,
            author,
            releaseDate
        } = ctx.request.body;

        const data = {
            uuid,
            name,
            isbn,
            author,
            releaseDate
        }

        const schema = Yup.object().shape({
            uuid: Yup.string().required(),
            name: Yup.string().required(),
            isbn: Yup.string().required(),
            author: Yup.string().required(),
            releaseDate: Yup.date().required()
        });

        await schema.validate(data, {abortEarly: false});

        const book = repository.create(data);
        await repository.save(book);
        
        ctx.response = 201;
        ctx.body = book;
    },

    async getAll(ctx: any) {
        const books: Book[] = await repository.find();
        ctx.body = books;
    },

    async getOne(ctx: any) {
        const { uuid } = ctx.request.body;
        const book: Book = await repository.findOneOrFail(uuid);
        ctx.body = book;
    },
}