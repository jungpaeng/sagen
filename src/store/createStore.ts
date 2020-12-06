import { ReducerReturnType } from '../types/redux';
import { CreateStoreReturnValue, SetValueFunction } from '../types/store';

const createStore = <T = any>(
  createState: T | ReducerReturnType<T>,
): CreateStoreReturnValue<T> => {
  let state: T;
  const callbackList: Array<(newState: T, prevState: T) => void> = [];

  const getState = () => state;
  const setState = (nextState: T | SetValueFunction<T>) => {
    const prevState = state;
    state =
      typeof nextState === 'function'
        ? (nextState as Function)(state)
        : nextState;
    callbackList.forEach((callback) => callback(state, prevState));
  };

  // state changed callback
  const onChange = (callback: (nextState: any, prevState: any) => void) => {
    callbackList.push(callback);

    return () => {
      const idx = callbackList.findIndex(callback);
      callbackList.splice(idx, 1);
    };
  };

  if (typeof createState === 'function') {
    const {
      state: createdState,
      ...rest
    } = (createState as ReducerReturnType<T>)(getState, setState);
    state = createdState;

    return { getState, setState, onChange, ...rest };
  } else {
    state = createState;
    return { getState, setState, onChange };
  }
};

export default createStore;
