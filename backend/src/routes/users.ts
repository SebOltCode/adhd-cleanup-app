import { Router } from "express";
import { MoreThan } from "typeorm";
import { AppDataSource } from "../data-source";
import { authenticate, AuthenticatedRequest } from "../middleware/authMiddleware";
import { Room } from "../models/Room";
import { TaskProgress } from "../models/TaskProgress";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { startOfDay } from "../utils/date";
import { calculateStreak } from "../utils/stats";
import { countPendingTasksForUser } from "../services/taskService";

const router = Router();

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }
    const roomRepository = AppDataSource.getRepository(Room);
    const progressRepository = AppDataSource.getRepository(TaskProgress);
    const userRepository = AppDataSource.getRepository(User);

    const roomsCount = await roomRepository.count({ where: { user: { id: user.id } } });
    const pendingCount = await countPendingTasksForUser(user.id);
    const totalCompleted = await progressRepository.count({
      where: { user: { id: user.id }, completed: true },
    });

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    const startSevenDaysAgo = startOfDay(sevenDaysAgo);

    const recentCompletions = await progressRepository.find({
      where: {
        user: { id: user.id },
        completed: true,
        completedAt: MoreThan(startSevenDaysAgo),
      },
      order: { completedAt: "ASC" },
    });

    const weekOverview = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(startSevenDaysAgo.getTime() + index * 24 * 60 * 60 * 1000);
      const dayKey = startOfDay(day).getTime();
      const count = recentCompletions.filter((entry) =>
        entry.completedAt ? startOfDay(entry.completedAt).getTime() === dayKey : false,
      ).length;
      return {
        day,
        count,
      };
    });

    const completedThisWeek = weekOverview.reduce((sum, day) => sum + day.count, 0);

    const streakCompletions = await progressRepository.find({
      where: { user: { id: user.id }, completed: true },
      order: { completedAt: "DESC" },
      take: 60,
    });

    const computedStreak = calculateStreak(
      streakCompletions
        .filter((entry) => entry.completedAt)
        .map((entry) => entry.completedAt as Date),
    );

    if (user.streak !== computedStreak) {
      user.streak = computedStreak;
      await userRepository.save(user);
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        level: user.level,
        experience: user.experience,
        streak: computedStreak,
      },
      stats: {
        roomsCount,
        pendingCount,
        totalCompleted,
        completedThisWeek,
        weekOverview: weekOverview.map((entry) => ({
          day: entry.day.toISOString(),
          count: entry.count,
        })),
      },
    });
  }),
);

export default router;
