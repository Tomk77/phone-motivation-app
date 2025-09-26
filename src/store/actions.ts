import { goalActions, entriesActions, settingsActions, statusActions } from './rootReducer';
import { AppThunk } from './types';
import { fetchGoal, upsertGoal, deleteGoal } from '../repositories/goalRepository';
import {
  listEntriesForGoal,
  upsertEntry as persistEntry,
  getEntryByDate,
} from '../repositories/entryRepository';
import { fetchSettings, saveSettings, clearSettings } from '../repositories/settingsRepository';
import { clearDatabase } from '../repositories/database';
import { Settings } from '../types/models';
import { generateId } from '../utils/id';
import { logger } from '../utils/logger';

export const loadInitialData = (): AppThunk => async (dispatch) => {
  dispatch(statusActions.setLoading(true));
  try {
    const settings = await fetchSettings();
    dispatch(settingsActions.setSettings(settings));

    const goal = await fetchGoal();
    if (goal) {
      dispatch(goalActions.setGoal(goal));
      const entries = await listEntriesForGoal(goal.id);
      const record = Object.fromEntries(entries.map((entry) => [entry.dateISO, entry]));
      dispatch(entriesActions.setEntries(record));
    }
    dispatch(statusActions.setInitialised(true));
    dispatch(statusActions.setError(null));
  } catch (error) {
    logger.error('Failed to load initial data', error);
    dispatch(statusActions.setError('We could not load your data. Please try again.'));
  } finally {
    dispatch(statusActions.setLoading(false));
  }
};

interface CreateGoalPayload {
  name: string;
}

export const createGoal = ({ name }: CreateGoalPayload): AppThunk => async (dispatch) => {
  const goal = {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
  };
  await upsertGoal(goal);
  dispatch(goalActions.setGoal(goal));
};

interface ToggleCompletionPayload {
  dateISO: string;
  note?: string | null;
  completed: boolean;
}

export const toggleEntry = ({ dateISO, note, completed }: ToggleCompletionPayload): AppThunk =>
  async (dispatch, getState) => {
    const goal = getState().goal.goal;
    if (!goal) {
      return;
    }
    const existing = await getEntryByDate(goal.id, dateISO);
    const entry = {
      id: existing?.id ?? generateId(),
      goalId: goal.id,
      dateISO,
      completed,
      note: note ?? existing?.note ?? null,
      updatedAt: new Date().toISOString(),
    };
    await persistEntry(entry);
    dispatch(entriesActions.upsertEntry(entry));
  };

export const updateNote = (dateISO: string, note: string | null): AppThunk =>
  async (dispatch, getState) => {
    const goal = getState().goal.goal;
    if (!goal) {
      return;
    }
    const existing = await getEntryByDate(goal.id, dateISO);
    if (!existing) {
      const entry = {
        id: generateId(),
        goalId: goal.id,
        dateISO,
        completed: false,
        note,
        updatedAt: new Date().toISOString(),
      };
      await persistEntry(entry);
      dispatch(entriesActions.upsertEntry(entry));
      return;
    }
    const updated = { ...existing, note, updatedAt: new Date().toISOString() };
    await persistEntry(updated);
    dispatch(entriesActions.upsertEntry(updated));
  };

export const persistSettings = (settings: Partial<Settings>): AppThunk => async (dispatch, getState) => {
  const merged = { ...getState().settings.settings, ...settings };
  await saveSettings(merged);
  dispatch(settingsActions.setSettings(merged));
};

export const completeOnboarding = (settings: Settings & { goalName: string }): AppThunk =>
  async (dispatch) => {
    await dispatch(createGoal({ name: settings.goalName }));
    await dispatch(
      persistSettings({
        reminderTimeLocal: settings.reminderTimeLocal,
        allowLateMark: settings.allowLateMark,
        theme: settings.theme,
        firstRunComplete: true,
      }),
    );
  };

export const renameGoal = (name: string): AppThunk => async (dispatch, getState) => {
  const goal = getState().goal.goal;
  if (!goal) {
    return;
  }
  const updated = { ...goal, name };
  await upsertGoal(updated);
  dispatch(goalActions.updateGoalName(name));
};

export const deleteAllData = (): AppThunk => async (dispatch) => {
  await clearDatabase();
  await deleteGoal();
  await clearSettings();
  dispatch(goalActions.clearGoal());
  dispatch(entriesActions.setEntries({}));
  dispatch(
    settingsActions.setSettings({
      reminderTimeLocal: '21:00',
      theme: 'system',
      allowLateMark: false,
      firstRunComplete: false,
    }),
  );
  dispatch(statusActions.setInitialised(false));
};
