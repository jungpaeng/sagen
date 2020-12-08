import { ReducerAction, ReducerFunction } from '../types/redux';
import { ReducerReturnType, ReducerStore } from '../types/store';

const redux = <T = any>(
  reducer: ReducerFunction<T>,
  defaultState: T,
): ReducerReturnType<T> => (setState, getState): ReducerStore<T> => {
  const customSetState = (action: ReducerAction) => {
    setState((state: T) => {
      return reducer(state, action);
    });
  };

  setState(defaultState);
  return { state: getState(), customSetState };
};

export default redux;
