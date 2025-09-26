import { Store } from './simpleToolkit';
import { RootState } from './rootReducer';

export type AppDispatch = Store<RootState>['dispatch'];
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState,
) => ReturnType | Promise<ReturnType>;
