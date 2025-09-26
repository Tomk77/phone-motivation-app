export type Reducer<S, A> = (state: S | undefined, action: A) => S;

export interface Action<P = any> {
  type: string;
  payload?: P;
}

type CaseReducer<S, P = any> = (state: S, action: Action<P>) => S;

export interface SliceOptions<S, CR extends Record<string, CaseReducer<S, any>>> {
  name: string;
  initialState: S;
  reducers: CR;
}

export const createSlice = <S, CR extends Record<string, CaseReducer<S, any>>>(
  options: SliceOptions<S, CR>,
) => {
  const { name, initialState, reducers } = options;
  const actionCreators = {} as {
    [K in keyof CR]: (payload: Parameters<CR[K]>[1]['payload']) => Action;
  };

  const caseReducers = {} as Record<string, CaseReducer<S, any>>;

  Object.keys(reducers).forEach((key) => {
    const type = `${name}/${key}`;
    caseReducers[type] = reducers[key as keyof CR];
    actionCreators[key as keyof CR] = (payload: any) => ({
      type,
      payload,
    });
  });

  const reducer: Reducer<S, Action> = (state = initialState, action) => {
    const caseReducer = caseReducers[action.type];
    if (!caseReducer) {
      return state;
    }
    return caseReducer(state, action);
  };

  return {
    name,
    reducer,
    actions: actionCreators,
  };
};

export interface ConfigureStoreOptions<S> {
  reducer: Reducer<S, Action> | { [K in keyof S]: Reducer<S[K], Action> };
  preloadedState?: S;
}

export interface Store<S> {
  getState: () => S;
  dispatch: (action: any) => any;
  subscribe: (listener: () => void) => () => void;
}

const combineReducers = <S>(reducers: { [K in keyof S]: Reducer<S[K], Action> }): Reducer<S, Action> => {
  return (state: S | undefined, action: Action): S => {
    const nextState = {} as S;
    Object.keys(reducers).forEach((key) => {
      const reducer = reducers[key as keyof S];
      const previousStateForKey = state ? state[key as keyof S] : undefined;
      nextState[key as keyof S] = reducer(previousStateForKey, action);
    });
    return nextState;
  };
};

export const configureStore = <S>(options: ConfigureStoreOptions<S>): Store<S> => {
  const rootReducer: Reducer<S, Action> =
    typeof options.reducer === 'function'
      ? (options.reducer as Reducer<S, Action>)
      : combineReducers(options.reducer as any);

  let currentState: S =
    options.preloadedState ?? rootReducer(undefined, { type: '@@INIT' });
  const listeners: Array<() => void> = [];

  const getState = () => currentState;

  const dispatch = (action: any) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    currentState = rootReducer(currentState, action);
    listeners.forEach((listener) => listener());
    return action;
  };

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    };
  };

  return {
    getState,
    dispatch,
    subscribe,
  };
};
