import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Item } from "./Item";

@Entity()
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("jsonb", { nullable: true })
  configuration: { windows: number; sinks: number; devices: number };

  @ManyToOne(() => User, (user) => user.rooms, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => Item, (item) => item.room)
  items: Item[];
}
