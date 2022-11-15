import "reflect-metadata"
import { DataSource, Db } from "typeorm"
import path from 'path'
import Book from "../entity/Book"

const root = path.resolve(__dirname, "../../")
const db = new DataSource({
    type: 'sqlite',
    database: `${root}/db.sqlite`,
    entities: [Book],
    // Automigrate tables from entities.
    synchronize: true,
    // logging: true
});

export default db;