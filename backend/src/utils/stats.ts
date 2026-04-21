import { startOfDay } from "./date";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const calculateStreak = (completionDates: Date[]) => {
  if (completionDates.length === 0) {
    return 0;
  }

  const uniqueDays = Array.from(
    new Set(completionDates.map((date) => startOfDay(date).getTime())),
  ).sort((a, b) => b - a);

  let streak = 0;
  let expectedDay = startOfDay(new Date()).getTime();

  for (const day of uniqueDays) {
    if (day === expectedDay) {
      streak += 1;
      expectedDay -= ONE_DAY_MS;
    } else if (streak === 0 && day === expectedDay - ONE_DAY_MS) {
      streak = 1;
      expectedDay = day - ONE_DAY_MS;
    } else if (day < expectedDay - ONE_DAY_MS) {
      break;
    }
  }

  return streak;
};
