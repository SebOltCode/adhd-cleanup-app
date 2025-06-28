import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class TaskProgress {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Task, (task) => task.progress, { onDelete: "CASCADE" })
  task: Task;

  @Column("boolean", { default: false })
  completed: boolean;

  @Column("timestamp", { nullable: true })
  lastAttemptedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
