import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('book')
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