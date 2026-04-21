import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Room } from "./Room";
import { TaskProgress } from "./TaskProgress";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  displayName!: string;

  @Column({ default: 1 })
  level!: number;

  @Column({ default: 0 })
  experience!: number;

  @Column({ default: 0 })
  streak!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Room, (room) => room.user, { cascade: true })
  rooms!: Room[];

  @OneToMany(() => TaskProgress, (progress) => progress.user)
  progress!: TaskProgress[];
}
