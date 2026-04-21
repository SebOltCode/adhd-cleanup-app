export const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const differenceInCalendarDays = (a: Date, b: Date) => {
  const startA = startOfDay(a).getTime();
  const startB = startOfDay(b).getTime();
  const diff = Math.round((startA - startB) / (1000 * 60 * 60 * 24));
  return diff;
};
