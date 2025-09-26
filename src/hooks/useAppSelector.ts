import { useContext } from 'react';
import { StoreStateContext } from '../store/StoreProvider';
import { RootState } from '../store/rootReducer';

export const useAppSelector = <T,>(selector: (state: RootState) => T): T => {
  const state = useContext(StoreStateContext);
  if (!state) {
    throw new Error('useAppSelector must be used within AppStoreProvider');
  }
  return selector(state);
};
