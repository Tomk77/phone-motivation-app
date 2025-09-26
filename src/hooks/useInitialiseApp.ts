import { useEffect } from 'react';
import { loadInitialData } from '../store/actions';
import { useAppDispatch } from './useAppDispatch';

export const useInitialiseApp = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadInitialData());
  }, [dispatch]);
};
