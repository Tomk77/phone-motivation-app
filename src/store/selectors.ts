import { RootState } from './rootReducer';
import { calculateStreaks } from '../utils/date';

export const selectGoal = (state: RootState) => state.goal.goal;
export const selectSettings = (state: RootState) => state.settings.settings;
export const selectEntriesRecord = (state: RootState) => state.entries.entries;
export const selectStatus = (state: RootState) => state.status;

export const selectEntryByDate = (dateISO: string) => (state: RootState) =>
  state.entries.entries[dateISO];

export const selectCompletedDates = (state: RootState) =>
  Object.values(state.entries.entries)
    .filter((entry) => entry.completed)
    .map((entry) => entry.dateISO);

export const selectStreaks = (state: RootState) => {
  const completed = selectCompletedDates(state);
  return calculateStreaks(completed);
};
