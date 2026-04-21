import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./Item";
import { User } from "./User";

export type RoomConfiguration = {
  windows?: number;
  sinks?: number;
  devices?: number;
  notes?: string;
};

@Entity()
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  emoji?: string;

  @Column("simple-json", { nullable: true })
  configuration?: RoomConfiguration;

  @ManyToOne(() => User, (user) => user.rooms, { onDelete: "CASCADE" })
  user!: User;

  @OneToMany(() => Item, (item) => item.room, { cascade: true })
  items!: Item[];
}
