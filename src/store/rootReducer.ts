import { Goal, Entry, Settings, AppStateStatus } from '../types/models';
import { DEFAULT_REMINDER_TIME } from '../utils/constants';
import { createSlice } from './simpleToolkit';

export interface GoalState {
  goal: Goal | null;
}

const goalInitialState: GoalState = {
  goal: null,
};

const goalSlice = createSlice({
  name: 'goal',
  initialState: goalInitialState,
  reducers: {
    setGoal(state, action) {
      return { ...state, goal: action.payload as Goal };
    },
    clearGoal() {
      return goalInitialState;
    },
    updateGoalName(state, action) {
      if (!state.goal) {
        return state;
      }
      return { ...state, goal: { ...state.goal, name: action.payload as string } };
    },
  },
});

export const goalActions = goalSlice.actions;

export interface EntriesState {
  entries: Record<string, Entry>;
}

const entriesInitialState: EntriesState = {
  entries: {},
};

const entriesSlice = createSlice({
  name: 'entries',
  initialState: entriesInitialState,
  reducers: {
    setEntries(state, action) {
      return { ...state, entries: action.payload as Record<string, Entry> };
    },
    upsertEntry(state, action) {
      const entry = action.payload as Entry;
      return { ...state, entries: { ...state.entries, [entry.dateISO]: entry } };
    },
    removeEntry(state, action) {
      const dateISO = action.payload as string;
      const next = { ...state.entries };
      delete next[dateISO];
      return { ...state, entries: next };
    },
  },
});

export const entriesActions = entriesSlice.actions;

export interface SettingsState {
  settings: Settings;
}

const settingsInitialState: SettingsState = {
  settings: {
    reminderTimeLocal: DEFAULT_REMINDER_TIME,
    theme: 'system',
    allowLateMark: false,
    firstRunComplete: false,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: settingsInitialState,
  reducers: {
    setSettings(state, action) {
      return { ...state, settings: { ...state.settings, ...(action.payload as Partial<Settings>) } };
    },
    setFirstRunComplete(state, action) {
      return { ...state, settings: { ...state.settings, firstRunComplete: action.payload as boolean } };
    },
  },
});

export const settingsActions = settingsSlice.actions;

export interface StatusState extends AppStateStatus {}

const statusInitialState: StatusState = {
  isInitialised: false,
  isLoading: false,
  error: null,
};

const statusSlice = createSlice({
  name: 'status',
  initialState: statusInitialState,
  reducers: {
    setLoading(state, action) {
      return { ...state, isLoading: action.payload as boolean };
    },
    setInitialised(state, action) {
      return { ...state, isInitialised: action.payload as boolean };
    },
    setError(state, action) {
      return { ...state, error: action.payload as string | null };
    },
  },
});

export const statusActions = statusSlice.actions;

export interface RootState {
  goal: GoalState;
  entries: EntriesState;
  settings: SettingsState;
  status: StatusState;
}

export const rootInitialState: RootState = {
  goal: goalInitialState,
  entries: entriesInitialState,
  settings: settingsInitialState,
  status: statusInitialState,
};

export const rootReducer = (state: RootState | undefined, action: any): RootState => {
  return {
    goal: goalSlice.reducer(state?.goal, action),
    entries: entriesSlice.reducer(state?.entries, action),
    settings: settingsSlice.reducer(state?.settings, action),
    status: statusSlice.reducer(state?.status, action),
  };
};
