import {
  ReducerAction,
  ReducerFunction,
  ReducerReturnType,
  ReducerStore,
} from '../types/redux';

const redux = <T = any>(
  reducer: ReducerFunction<T>,
  defaultState: T,
): ReducerReturnType<T> => (getState, setState): ReducerStore<T> => {
  const customSetState = (action: ReducerAction) => {
    setState((state: T) => {
      return reducer(state, action);
    });
  };

  setState(defaultState);
  return { state: getState(), customSetState };
};

export default redux;
