import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Room } from './Room';
import { TaskGroup } from './TaskGroup';

@Entity()
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Room, room => room.items, { onDelete: 'CASCADE' })
    room: Room;

    @OneToMany(() => TaskGroup, tg => tg.item)
    taskGroups: TaskGroup[];
}