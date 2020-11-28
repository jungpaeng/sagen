import {DispatchType, ReducerReturnType } from ".";

type SetValueFunction<T = any> = (currValue: T) => T;
export type StoreGetState<T = any> = () => T;
export type StoreSetState<T = any> = (newValue: T | SetValueFunction<T>) => void;

interface CreateStoreStateReturnValue<T> {
  getState: StoreGetState<T>;
  setState: StoreSetState<T>;
  onChange: (callback: (newState: T, prevState: T) => void) => void;
}

export  interface CreateStoreReducerReturnValue<T> extends CreateStoreStateReturnValue<T> {
  dispatch: DispatchType;
}

export type CreateStoreReturnValue<T> = CreateStoreStateReturnValue<T> | CreateStoreReducerReturnValue<T>;

const createStore = <T = any>(createState: T | ReducerReturnType<T>): CreateStoreReturnValue<T> => {
  let state: T;
  const callbackList: Array<(newState: T, prevState: T) => void> = [];

  const getState = () => state;
  const setState = (nextState: T | SetValueFunction<T>) => {
    const prevState = state;
    state = typeof nextState === "function" ? (nextState as Function)(state) : nextState;
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

  if (typeof createState === "function") {
    const {dispatch, state: reduceState} = (createState as ReducerReturnType<T>)(getState, setState);
    state = reduceState;

    return {getState, setState, onChange, dispatch};
  } else {
    state = createState;
    return { getState, setState, onChange };
  }
};

export default createStore;