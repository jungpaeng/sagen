import { StoreGetState, StoreSetState } from './index';

interface ReducerAction {
  type: string;
  [key: string]: any;
}

interface ReducerStore<T> {
  state: T;
  dispatch: DispatchType;
}


export type DispatchType = (action: ReducerAction) => void;
export type ReducerFunction<T> = (state: T, action: ReducerAction) => T;
export type ReducerReturnType<T> = (getState: StoreGetState<T>, setState: StoreSetState<T>) => ReducerStore<T>;

const redux = <T = any>(reducer: ReducerFunction<T>, defaultState: T): ReducerReturnType<T> => (
  getState,
  setState,
): ReducerStore<T> => {
  const dispatch = (action: ReducerAction) => {
    setState(state => {
      return reducer(state, action)
    });
  };

  setState(defaultState);
  return { state: getState(), dispatch };
};

export default redux;