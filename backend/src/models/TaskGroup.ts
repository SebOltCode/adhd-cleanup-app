import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./Item";
import { Task } from "./Task";

@Entity()
export class TaskGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "int", default: 1 })
  sequence!: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Item, (item) => item.taskGroups, { onDelete: "CASCADE" })
  item!: Item;

  @OneToMany(() => Task, (task) => task.group, { cascade: true })
  tasks!: Task[];
}
