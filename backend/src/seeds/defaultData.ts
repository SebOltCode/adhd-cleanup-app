import { EntityManager } from "typeorm";
import { Item } from "../models/Item";
import { Room } from "../models/Room";
import { Task } from "../models/Task";
import { TaskGroup } from "../models/TaskGroup";
import { User } from "../models/User";

type TaskSeed = {
  description: string;
  expectedDurationMinutes: number;
  rewardPoints: number;
};

type TaskGroupSeed = {
  title: string;
  sequence: number;
  description?: string;
  tasks: TaskSeed[];
};

type ItemSeed = {
  name: string;
  icon?: string;
  frequencyDays: number;
  taskGroups: TaskGroupSeed[];
};

type RoomSeed = {
  name: string;
  emoji?: string;
  configuration?: {
    windows?: number;
    sinks?: number;
    devices?: number;
    notes?: string;
  };
  items: ItemSeed[];
};

export const DEFAULT_ROOM_PRESETS: RoomSeed[] = [
  {
    name: "Wohnzimmer",
    emoji: "🛋️",
    configuration: { windows: 2, devices: 3 },
    items: [
      {
        name: "Couchtisch",
        icon: "🪑",
        frequencyDays: 2,
        taskGroups: [
          {
            title: "Quick Reset",
            sequence: 1,
            description: "Schnelle Ordnung schaffen",
            tasks: [
              { description: "Alle losen Dinge in einen Korb legen", expectedDurationMinutes: 2, rewardPoints: 10 },
              { description: "Fläche mit Mikrofasertuch abwischen", expectedDurationMinutes: 3, rewardPoints: 12 },
              { description: "Lieblingsdeko wieder hinstellen", expectedDurationMinutes: 2, rewardPoints: 8 },
            ],
          },
        ],
      },
      {
        name: "Boden",
        icon: "🧹",
        frequencyDays: 3,
        taskGroups: [
          {
            title: "Reset",
            sequence: 1,
            tasks: [
              { description: "Sichtbaren Müll einsammeln", expectedDurationMinutes: 3, rewardPoints: 10 },
              { description: "Staubsaugen in Bahnen", expectedDurationMinutes: 5, rewardPoints: 15 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Küche",
    emoji: "🍽️",
    configuration: { sinks: 1, devices: 4 },
    items: [
      {
        name: "Arbeitsplatte",
        icon: "🧴",
        frequencyDays: 1,
        taskGroups: [
          {
            title: "Schnellputz",
            sequence: 1,
            tasks: [
              { description: "Alles zurück in Körbe stellen", expectedDurationMinutes: 2, rewardPoints: 8 },
              { description: "Arbeitsfläche mit Reiniger einsprühen", expectedDurationMinutes: 1, rewardPoints: 5 },
              { description: "Mit Zewa abwischen", expectedDurationMinutes: 2, rewardPoints: 9 },
            ],
          },
        ],
      },
      {
        name: "Spüle",
        icon: "🚰",
        frequencyDays: 2,
        taskGroups: [
          {
            title: "Spül-Reset",
            sequence: 1,
            tasks: [
              { description: "Schmutziges Geschirr einsammeln", expectedDurationMinutes: 3, rewardPoints: 10 },
              { description: "Geschirrspüler einräumen oder per Hand spülen", expectedDurationMinutes: 7, rewardPoints: 18 },
              { description: "Spülbecken trocknen", expectedDurationMinutes: 1, rewardPoints: 6 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Bad",
    emoji: "🛁",
    configuration: { sinks: 1, windows: 1 },
    items: [
      {
        name: "Waschbecken",
        icon: "🪥",
        frequencyDays: 2,
        taskGroups: [
          {
            title: "Glanzrunde",
            sequence: 1,
            tasks: [
              { description: "Kosmetik wegräumen", expectedDurationMinutes: 2, rewardPoints: 9 },
              { description: "Armaturen einseifen", expectedDurationMinutes: 2, rewardPoints: 9 },
              { description: "Mit klarem Wasser nachspülen", expectedDurationMinutes: 2, rewardPoints: 9 },
            ],
          },
        ],
      },
      {
        name: "Dusche",
        icon: "🚿",
        frequencyDays: 4,
        taskGroups: [
          {
            title: "Weekly Reset",
            sequence: 1,
            tasks: [
              { description: "Shampoo aus den Ecken spülen", expectedDurationMinutes: 3, rewardPoints: 12 },
              { description: "Duschwand mit Abzieher trocknen", expectedDurationMinutes: 3, rewardPoints: 12 },
            ],
          },
        ],
      },
    ],
  },
];

export const seedDefaultContentForUser = async (manager: EntityManager, user: User) => {
  for (const roomSeed of DEFAULT_ROOM_PRESETS) {
    const room = manager.create(Room, {
      name: roomSeed.name,
      emoji: roomSeed.emoji,
      configuration: roomSeed.configuration,
      user,
    });
    await manager.save(Room, room);

    for (const itemSeed of roomSeed.items) {
      const item = manager.create(Item, {
        name: itemSeed.name,
        icon: itemSeed.icon,
        frequencyDays: itemSeed.frequencyDays,
        room,
      });
      await manager.save(Item, item);

      for (const groupSeed of itemSeed.taskGroups) {
        const group = manager.create(TaskGroup, {
          title: groupSeed.title,
          sequence: groupSeed.sequence,
          description: groupSeed.description,
          item,
        });
        await manager.save(TaskGroup, group);

        let sequence = 1;
        for (const taskSeed of groupSeed.tasks) {
          const task = manager.create(Task, {
            description: taskSeed.description,
            expectedDurationMinutes: taskSeed.expectedDurationMinutes,
            rewardPoints: taskSeed.rewardPoints,
            sequence,
            group,
          });
          await manager.save(Task, task);
          sequence += 1;
        }
      }
    }
  }
};
