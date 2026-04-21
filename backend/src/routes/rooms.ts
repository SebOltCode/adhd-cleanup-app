import { Router } from "express";
import { z } from "zod";
import { AppDataSource } from "../data-source";
import { authenticate, AuthenticatedRequest } from "../middleware/authMiddleware";
import { Room } from "../models/Room";
import { Item } from "../models/Item";
import { TaskGroup } from "../models/TaskGroup";
import { Task } from "../models/Task";
import { asyncHandler } from "../utils/asyncHandler";
import { DEFAULT_ROOM_PRESETS } from "../seeds/defaultData";

const router = Router();

router.get(
  "/templates",
  asyncHandler(async (_req, res) => {
    res.json({ templates: DEFAULT_ROOM_PRESETS });
  }),
);

router.get(
  "/",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }
    const roomRepository = AppDataSource.getRepository(Room);
    const rooms = await roomRepository.find({
      where: { user: { id: user.id } },
      relations: {
        items: { taskGroups: { tasks: true } },
      },
      order: {
        name: "ASC",
        items: {
          name: "ASC",
          taskGroups: {
            sequence: "ASC",
            tasks: { sequence: "ASC" },
          },
        },
      },
    });

    res.json({ rooms });
  }),
);

const createRoomSchema = z.object({
  name: z.string().min(2),
  emoji: z.string().min(1).max(4).optional(),
  configuration: z
    .object({
      windows: z.number().min(0).max(10).optional(),
      sinks: z.number().min(0).max(5).optional(),
      devices: z.number().min(0).max(10).optional(),
      notes: z.string().max(200).optional(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        icon: z.string().optional(),
        frequencyDays: z.number().min(1).max(30).default(7),
        taskGroups: z
          .array(
            z.object({
              title: z.string().min(1),
              description: z.string().optional(),
              sequence: z.number().min(1).optional(),
              tasks: z
                .array(
                  z.object({
                    description: z.string().min(1),
                    expectedDurationMinutes: z.number().min(1).max(120).default(5),
                    rewardPoints: z.number().min(1).max(100).default(10),
                    sequence: z.number().min(1).optional(),
                  }),
                )
                .nonempty(),
            }),
          )
          .default([]),
      }),
    )
    .default([]),
});

router.post(
  "/",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const parsed = createRoomSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Ungültige Daten", issues: parsed.error.issues });
    }

    const user = req.currentUser;
    if (!user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }
    const { name, emoji, configuration, items } = parsed.data;

    let createdRoom: Room | null = null;

    await AppDataSource.transaction(async (manager) => {
      const roomRepository = manager.getRepository(Room);
      const itemRepository = manager.getRepository(Item);
      const taskGroupRepository = manager.getRepository(TaskGroup);
      const taskRepository = manager.getRepository(Task);

      const room = roomRepository.create({ name, emoji, configuration, user });
      createdRoom = await roomRepository.save(room);
      const currentRoom = createdRoom;
      if (!currentRoom) {
        return;
      }

      for (const item of items) {
        const savedItem = await itemRepository.save(
          itemRepository.create({
            name: item.name,
            icon: item.icon,
            frequencyDays: item.frequencyDays,
            room: currentRoom,
          }),
        );

        let groupSequence = 1;
        for (const group of item.taskGroups) {
          const savedGroup = await taskGroupRepository.save(
            taskGroupRepository.create({
              title: group.title,
              description: group.description,
              sequence: group.sequence ?? groupSequence,
              item: savedItem,
            }),
          );
          groupSequence += 1;

          let taskSequence = 1;
          for (const task of group.tasks) {
            await taskRepository.save(
              taskRepository.create({
                description: task.description,
                expectedDurationMinutes: task.expectedDurationMinutes,
                rewardPoints: task.rewardPoints,
                sequence: task.sequence ?? taskSequence,
                group: savedGroup,
              }),
            );
            taskSequence += 1;
          }
        }
      }
    });

    const roomRepository = AppDataSource.getRepository(Room);
    const populatedRoom = await roomRepository.findOne({
      where: { id: createdRoom?.id },
      relations: {
        items: { taskGroups: { tasks: true } },
      },
    });

    return res.status(201).json({ room: populatedRoom });
  }),
);

export default router;
