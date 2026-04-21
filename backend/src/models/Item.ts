import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";
import { TaskGroup } from "./TaskGroup";

@Entity()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ type: "int", default: 7 })
  frequencyDays!: number;

  @Column("simple-json", { nullable: true })
  metadata?: Record<string, unknown>;

  @ManyToOne(() => Room, (room) => room.items, { onDelete: "CASCADE" })
  room!: Room;

  @OneToMany(() => TaskGroup, (group) => group.item, { cascade: true })
  taskGroups!: TaskGroup[];
}
