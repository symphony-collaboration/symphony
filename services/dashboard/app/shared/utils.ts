export const getCurrent24HrTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
};

export const pluralize = (count: number, noun: string, suffix = 's') => {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}
