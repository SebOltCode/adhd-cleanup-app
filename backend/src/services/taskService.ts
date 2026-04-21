import { AppDataSource } from "../data-source";
import { Task } from "../models/Task";
import { startOfDay } from "../utils/date";

type NextTaskOptions = {
  skipAttemptedToday?: boolean;
};

export const getNextTaskForUser = async (userId: string, options: NextTaskOptions = {}) => {
  const taskRepository = AppDataSource.getRepository(Task);
  const skipAttemptedToday = options.skipAttemptedToday ?? false;
  const todayStart = startOfDay(new Date());

  const query = taskRepository
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
    .addOrderBy("COALESCE(progress.lastAttemptedAt, :epochDate)", "ASC")
    .setParameter("epochDate", new Date(0));

  if (skipAttemptedToday) {
    query.andWhere("(progress.id IS NULL OR progress.lastAttemptedAt < :todayStart)", {
      todayStart,
    });
  }

  const task = await query.getOne();

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
