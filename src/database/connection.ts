import path from 'path';
import Message from '../model/Message';
import { DataSource, DataSourceOptions } from 'typeorm';

const root = path.resolve(__dirname, "..");

const dbOptions: DataSourceOptions = {
    type: 'sqlite',
    database: `${root}/db.sqlite`,
    entities: [Message],
    // Automigrate tables from entities.
    synchronize: true,
    // logging: true
}

const db = new DataSource(dbOptions);
export default db;