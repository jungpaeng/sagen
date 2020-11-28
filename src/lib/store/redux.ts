import { StoreGetState, StoreSetState } from './index';

interface ReducerAction {
  type: string;
  [key: string]: any;
}

type ReducerFunction<T> = (state: T, action: ReducerAction) => T;

const redux = <T = any>(reducer: ReducerFunction<T>, defaultState: T) => (
  getState: StoreGetState<T>,
  setState: StoreSetState<T>,
) => {
  const dispatch = (action: ReducerAction) => {
    setState(state => {
      return reducer(state, action)
    });
  };

  setState(defaultState);
  return { state: getState(), dispatch };
};

export default redux;