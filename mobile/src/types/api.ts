export type TaskGroupDto = {
  id: string;
  title: string;
  description?: string | null;
  sequence: number;
};

export type TaskDto = {
  id: string;
  description: string;
  expectedDurationMinutes: number;
  sequence: number;
  rewardPoints: number;
  group: {
    id: string;
    title: string;
    sequence: number;
    item: {
      id: string;
      name: string;
      icon?: string | null;
      room: {
        id: string;
        name: string;
        emoji?: string | null;
      };
    };
  };
};

export type NextTaskResponse = {
  task: TaskDto | null;
  pendingCount: number;
};

export type CompleteTaskResponse = {
  message: string;
  reward: number;
  user: {
    id: string;
    level: number;
    experience: number;
    streak: number;
  };
  nextTask: TaskDto | null;
  pendingCount: number;
};

export type WeekOverviewEntry = {
  day: string;
  count: number;
};

export type UserStatsResponse = {
  user: {
    id: string;
    email: string;
    displayName: string;
    level: number;
    experience: number;
    streak: number;
  };
  stats: {
    roomsCount: number;
    pendingCount: number;
    totalCompleted: number;
    completedThisWeek: number;
    weekOverview: WeekOverviewEntry[];
  };
};
