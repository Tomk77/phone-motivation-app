import React, { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { configureStore, Store } from './simpleToolkit';
import { rootReducer, RootState } from './rootReducer';
import { AppDispatch } from './types';

interface StoreContextValue {
  store: Store<RootState>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => configureStore<RootState>({ reducer: rootReducer }));
  const value = useMemo(() => ({ store }), [store]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context.store;
};

export const StoreStateContext = createContext<RootState | undefined>(undefined);
export const StoreDispatchContext = createContext<AppDispatch | undefined>(undefined);

export const StoreBridge: React.FC<PropsWithChildren> = ({ children }) => {
  const store = useStore();
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, [store]);

  const dispatch = store.dispatch;

  return (
    <StoreStateContext.Provider value={state}>
      <StoreDispatchContext.Provider value={dispatch}>{children}</StoreDispatchContext.Provider>
    </StoreStateContext.Provider>
  );
};

export const AppStoreProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <StoreProvider>
    <StoreBridge>{children}</StoreBridge>
  </StoreProvider>
);
