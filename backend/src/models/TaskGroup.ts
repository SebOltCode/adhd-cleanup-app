import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Item } from "./Item";
import { Task } from "./Task";

@Entity()
export class TaskGroup {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("int")
  sequence: number;

  @ManyToOne(() => Item, (item) => item.taskGroups, { onDelete: "CASCADE" })
  item: Item;

  @OneToMany(() => Task, (task) => task.group)
  tasks: Task[];
}
