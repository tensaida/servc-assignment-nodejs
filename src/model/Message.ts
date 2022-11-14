import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('message')
export default class Message {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  text!: string
}