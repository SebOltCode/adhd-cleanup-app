import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TaskGroup } from "./TaskGroup";
import { TaskProgress } from "./TaskProgress";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  description!: string;

  @Column({ type: "int", default: 5 })
  expectedDurationMinutes!: number;

  @Column({ type: "int", default: 1 })
  sequence!: number;

  @Column({ type: "int", default: 10 })
  rewardPoints!: number;

  @ManyToOne(() => TaskGroup, (group) => group.tasks, { onDelete: "CASCADE" })
  group!: TaskGroup;

  @OneToMany(() => TaskProgress, (progress) => progress.task)
  progress!: TaskProgress[];
}
