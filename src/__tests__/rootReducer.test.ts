import { goalActions, entriesActions, settingsActions, statusActions, rootReducer, rootInitialState } from '../store/rootReducer';
import { generateId } from '../utils/id';

describe('rootReducer slices', () => {
  it('sets goal data', () => {
    const goal = { id: '1', name: 'Read daily', createdAt: new Date().toISOString() };
    const state = rootReducer(rootInitialState, goalActions.setGoal(goal));
    expect(state.goal.goal).toEqual(goal);
  });

  it('upserts entries', () => {
    const entry = {
      id: generateId(),
      goalId: '1',
      dateISO: '2025-01-01',
      completed: true,
      note: 'Great day',
      updatedAt: new Date().toISOString(),
    };
    const state = rootReducer(rootInitialState, entriesActions.upsertEntry(entry));
    expect(state.entries.entries['2025-01-01']).toEqual(entry);
  });

  it('updates settings', () => {
    const state = rootReducer(rootInitialState, settingsActions.setSettings({ theme: 'dark' }));
    expect(state.settings.settings.theme).toBe('dark');
  });

  it('updates status flags', () => {
    const state = rootReducer(rootInitialState, statusActions.setInitialised(true));
    expect(state.status.isInitialised).toBe(true);
  });
});
