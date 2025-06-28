import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TaskGroup } from "./TaskGroup";
import { TaskProgress } from "./TaskProgress";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column("int")
  expectedDurationMinutes: number;

  @Column("int")
  sequence: number;

  @ManyToOne(() => TaskGroup, (group) => group.tasks, { onDelete: "CASCADE" })
  group: TaskGroup;

  @OneToMany(() => TaskProgress, (progress) => progress.task)
  progress: TaskProgress[];
}
