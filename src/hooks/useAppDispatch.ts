import { useContext } from 'react';
import { StoreDispatchContext } from '../store/StoreProvider';
import { AppDispatch } from '../store/types';

export const useAppDispatch = (): AppDispatch => {
  const dispatch = useContext(StoreDispatchContext);
  if (!dispatch) {
    throw new Error('useAppDispatch must be used within AppStoreProvider');
  }
  return dispatch;
};
