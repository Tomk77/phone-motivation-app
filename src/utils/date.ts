import { LATE_MARK_WINDOW_HOURS } from './constants';

export const toISODate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const todayISO = (): string => toISODate(new Date());

export const yesterdayISO = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISODate(d);
};

export const parseISODate = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateGB = (iso: string): string => {
  const date = parseISODate(iso);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatMonthTitle = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
};

export const getMonthGrid = (reference: Date): { dateISO: string; isCurrentMonth: boolean }[] => {
  const firstDay = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const startOffset = firstDay.getDay(); // Sunday = 0
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startOffset);

  const cells: { dateISO: string; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    cells.push({
      dateISO: toISODate(date),
      isCurrentMonth: date.getMonth() === reference.getMonth(),
    });
  }

  return cells;
};

export const withinLateMarkWindow = (now: Date): boolean => {
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - midnight.getTime();
  const hours = diffMs / (1000 * 60 * 60);
  return hours <= LATE_MARK_WINDOW_HOURS;
};

export const combineDateTimeToNext = (time24: string): Date => {
  const [hour, minute] = time24.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target;
};

export const getReminderHourMinute = (time24: string): { hour: number; minute: number } => {
  const [hour, minute] = time24.split(':').map(Number);
  return { hour, minute };
};

export const sortEntriesDescending = <T extends { dateISO: string }>(entries: T[]): T[] => {
  return [...entries].sort((a, b) => (a.dateISO < b.dateISO ? 1 : a.dateISO > b.dateISO ? -1 : 0));
};

export const calculateStreaks = (completedDates: string[]): {
  current: number;
  best: number;
  isBroken: boolean;
} => {
  const dates = completedDates.map(parseISODate).sort((a, b) => b.getTime() - a.getTime());
  if (!dates.length) {
    return { current: 0, best: 0, isBroken: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let current = 0;
  let best = 0;
  let chain = 0;
  let previousDate: Date | null = null;
  let isBroken = false;

  for (const date of dates.sort((a, b) => a.getTime() - b.getTime())) {
    if (!previousDate) {
      chain = 1;
    } else {
      const diffDays = Math.round((date.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        chain += 1;
      } else {
        chain = 1;
      }
    }
    best = Math.max(best, chain);
    previousDate = date;
  }

  const latestDate = dates[dates.length - 1];
  const diffFromTodayDays = Math.round((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffFromTodayDays === 0) {
    current = chain;
  } else if (diffFromTodayDays === 1) {
    current = withinLateMarkWindow(new Date()) ? chain : 0;
    isBroken = current === 0;
  } else {
    current = 0;
    isBroken = true;
  }

  return { current, best, isBroken };
};
