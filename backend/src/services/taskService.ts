import { AppDataSource } from "../data-source";
import { Task } from "../models/Task";

export const getNextTaskForUser = async (userId: string) => {
  const taskRepository = AppDataSource.getRepository(Task);

  const task = await taskRepository
    .createQueryBuilder("task")
    .leftJoinAndSelect("task.group", "group")
    .leftJoinAndSelect("group.item", "item")
    .leftJoinAndSelect("item.room", "room")
    .leftJoinAndSelect("task.progress", "progress", "progress.userId = :userId", { userId })
    .leftJoin("room.user", "owner")
    .where("owner.id = :userId", { userId })
    .andWhere("COALESCE(progress.completed, false) = false")
    .orderBy("group.sequence", "ASC")
    .addOrderBy("task.sequence", "ASC")
    .getOne();

  return task ?? null;
};

export const countPendingTasksForUser = async (userId: string) => {
  const taskRepository = AppDataSource.getRepository(Task);

  const total = await taskRepository
    .createQueryBuilder("task")
    .leftJoin("task.group", "group")
    .leftJoin("group.item", "item")
    .leftJoin("item.room", "room")
    .leftJoin("room.user", "owner")
    .leftJoin("task.progress", "progress", "progress.userId = :userId", { userId })
    .where("owner.id = :userId", { userId })
    .andWhere("COALESCE(progress.completed, false) = false")
    .getCount();

  return total;
};
