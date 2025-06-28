import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Room } from "./Room";
import { TaskProgress } from "./TaskProgress";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 1 })
  level: number;

  @OneToMany(() => Room, (room) => room.user)
  rooms: Room[];

  @OneToMany(() => TaskProgress, (progress) => progress.user)
  progress: TaskProgress[];
}
