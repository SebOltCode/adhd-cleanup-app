import { Router } from "express";
import { z } from "zod";
import { AppDataSource } from "../data-source";
import { authenticate, AuthenticatedRequest } from "../middleware/authMiddleware";
import { Task } from "../models/Task";
import { TaskProgress } from "../models/TaskProgress";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { differenceInCalendarDays } from "../utils/date";
import { calculateStreak } from "../utils/stats";
import { countPendingTasksForUser, getNextTaskForUser } from "../services/taskService";

const router = Router();
const completeTaskSchema = z.object({
  taskId: z.string().uuid(),
});

router.get(
  "/next",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }
    const [nextTask, pendingCount] = await Promise.all([
      getNextTaskForUser(user.id, { skipAttemptedToday: true }),
      countPendingTasksForUser(user.id),
    ]);

    if (!nextTask) {
      return res.json({ task: null, pendingCount: 0 });
    }

    return res.json({ task: nextTask, pendingCount });
  }),
);

router.post(
  "/:taskId/defer",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const paramsParsed = completeTaskSchema.safeParse(req.params);

    if (!paramsParsed.success) {
      return res.status(400).json({ message: "Ungültige Task-ID", issues: paramsParsed.error.issues });
    }

    const { taskId } = paramsParsed.data;
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const taskRepository = AppDataSource.getRepository(Task);
    const progressRepository = AppDataSource.getRepository(TaskProgress);

    const task = await taskRepository.findOne({
      where: { id: taskId },
      relations: {
        group: { item: { room: { user: true } } },
      },
    });

    if (!task || task.group.item.room.user.id !== user.id) {
      return res.status(404).json({ message: "Aufgabe nicht gefunden" });
    }

    const now = new Date();
    let progress = await progressRepository.findOne({
      where: { user: { id: user.id }, task: { id: task.id } },
    });

    if (!progress) {
      progress = progressRepository.create({
        user,
        task,
        completed: false,
        lastAttemptedAt: now,
      });
    } else {
      progress.completed = false;
      progress.lastAttemptedAt = now;
    }

    await progressRepository.save(progress);

    const [nextTask, pendingCount] = await Promise.all([
      getNextTaskForUser(user.id, { skipAttemptedToday: true }),
      countPendingTasksForUser(user.id),
    ]);

    return res.json({
      message: "Aufgabe für heute zurückgestellt",
      deferredTaskId: task.id,
      nextTask,
      pendingCount,
    });
  }),
);

router.post(
  "/:taskId/complete",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const paramsParsed = completeTaskSchema.safeParse(req.params);

    if (!paramsParsed.success) {
      return res.status(400).json({ message: "Ungültige Task-ID", issues: paramsParsed.error.issues });
    }

    const { taskId } = paramsParsed.data;
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }
    const taskRepository = AppDataSource.getRepository(Task);

    const task = await taskRepository.findOne({
      where: { id: taskId },
      relations: {
        group: { item: { room: { user: true } } },
      },
    });

    if (!task || task.group.item.room.user.id !== user.id) {
      return res.status(404).json({ message: "Aufgabe nicht gefunden" });
    }

    const now = new Date();
    let updatedUser: User | null = null;

    await AppDataSource.transaction(async (manager) => {
      const progressRepository = manager.getRepository(TaskProgress);
      const userRepository = manager.getRepository(User);

      const latestProgressBefore = await progressRepository.findOne({
        where: { user: { id: user.id }, completed: true },
        order: { completedAt: "DESC" },
      });

      let progress = await progressRepository.findOne({
        where: { user: { id: user.id }, task: { id: task.id } },
      });

      if (!progress) {
        progress = progressRepository.create({
          user,
          task,
          completed: true,
          completedAt: now,
          lastAttemptedAt: now,
          rewardCollected: task.rewardPoints,
        });
      } else {
        progress.completed = true;
        progress.completedAt = now;
        progress.lastAttemptedAt = now;
        progress.rewardCollected = task.rewardPoints;
      }

      await progressRepository.save(progress);

      const userToUpdate = await userRepository.findOne({ where: { id: user.id } });
      if (!userToUpdate) {
        return;
      }

      userToUpdate.experience += task.rewardPoints;
      userToUpdate.level = Math.max(1, Math.floor(userToUpdate.experience / 100) + 1);

      if (!latestProgressBefore) {
        userToUpdate.streak = 1;
      } else {
        const diff = differenceInCalendarDays(now, latestProgressBefore.completedAt ?? now);
        if (diff === 0) {
          // bereits etwas heute erledigt -> streak bleibt gleich
          userToUpdate.streak = Math.max(userToUpdate.streak, 1);
        } else if (diff === 1) {
          userToUpdate.streak += 1;
        } else {
          userToUpdate.streak = 1;
        }
      }

      const allRecentCompletions = await progressRepository.find({
        where: { user: { id: user.id }, completed: true },
        order: { completedAt: "DESC" },
        take: 30,
      });

      userToUpdate.streak = calculateStreak(
        allRecentCompletions
          .filter((entry) => entry.completedAt)
          .map((entry) => entry.completedAt as Date),
      );

      updatedUser = await userRepository.save(userToUpdate);
    });

    const [nextTask, pendingCount] = await Promise.all([
      getNextTaskForUser(user.id, { skipAttemptedToday: true }),
      countPendingTasksForUser(user.id),
    ]);

    return res.json({
      message: "Aufgabe abgeschlossen",
      reward: task.rewardPoints,
      user: {
        id: updatedUser?.id ?? user.id,
        level: updatedUser?.level ?? user.level,
        experience: updatedUser?.experience ?? user.experience,
        streak: updatedUser?.streak ?? user.streak,
      },
      nextTask,
      pendingCount,
    });
  }),
);

export default router;
