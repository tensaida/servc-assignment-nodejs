import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('book')
export default class Book {
    @Column()
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