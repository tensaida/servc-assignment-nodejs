import { bookRepository as repository } from '../database/repositories';
import Book from '../entity/Book';

export default {

    async create(ctx: any) {

        const {
            uuid,
            name,
            isbn,
            author,
            releaseDate
        } = JSON.parse(JSON.stringify(ctx.request.body));
    
        const book = repository.create({
            uuid: uuid,
            name: name,
            isbn: isbn,
            author: author,
            releaseDate: releaseDate
        });
    
        ctx.body = await repository.save(book);
    },

    async getAll(ctx: any) {
        let books: Book[];
        
        if (ctx.request.url.includes('take') && ctx.request.url.includes('skip')) {
            const take = ctx.query['take'];
            const skip = ctx.query['skip'];
            books = await repository.find({
                take,
                skip
            });
        }
        else if (ctx.request.url.includes('sort')) {
            const [field, orderBy] = ctx.query['sort'].split(':');
            books = await repository
                    .createQueryBuilder()
                    .orderBy(field, orderBy.toUpperCase())
                    .getMany();
        }
        else {
            books = await repository.find();
        }
        ctx.body = books;
    },

    async getOne(ctx: any) {
        const book = await repository.findOne(
            { where:
                { uuid: ctx.params.id }
            }
        );
        if (book == null) {
            ctx.body = {message: "No books matching that ID!"};
            return;    
        }
        ctx.body = book;
    },

    async update(ctx: any) {
        const book = await repository.findOne(
            { where:
                { uuid: ctx.params.id }
            }
        )
        
        if (book == null) {
            ctx.body = {message: "No books matching that ID!"};
            return;    
        }

        const {
            name,
            isbn,
            author,
            releaseDate
        } = JSON.parse(JSON.stringify(ctx.request.body));
        
        await repository.save({
            uuid: book.uuid,
            name,
            isbn,
            author,
            releaseDate
        });

        ctx.body = await repository.findOne(
            { where:
                { uuid: ctx.params.id }
            }
        )
    },

    async delete(ctx: any) {
        const book = await repository.findOne(
            { where:
                { uuid: ctx.params.id }
            }
        )

        if (book == null) {
            ctx.body = {message: "No books matching that ID!"};
            return;    
        }

        await repository.delete({uuid: book.uuid});

        ctx.body = book;
    }
}