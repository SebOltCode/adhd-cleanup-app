import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity()
export class TaskProgress {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Task, (task) => task.progress, { onDelete: "CASCADE" })
  task!: Task;

  @Column({ default: false })
  completed!: boolean;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ nullable: true })
  lastAttemptedAt?: Date;

  @Column({ type: "int", default: 0 })
  rewardCollected!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
