export type NextState<T> = T | SetValueFunction<T>;
export type StoreGetState<T = any> = () => T;
export type StoreSetState<T = any> = (newValue: NextState<T>) => void;

export interface ReducerAction {
  type: string;
  [key: string]: any;
}

export type DispatchType = (action: ReducerAction) => void;

export interface StateStore<T> {
  state: T;
  customSetState: StoreSetState<T>;
}

export interface ReducerStore<T> {
  state: T;
  customSetState: DispatchType;
}

export type SetValueFunction<T = any> = (currValue: T) => T;

export type ReducerReturnType<T> = (
  setState: StoreSetState<T>,
  getState: StoreGetState<T>,
) => ReducerStore<T>;

export type MiddlewareReturnType<T> = (
  setState: StoreSetState<T>,
  getState: StoreGetState<T>,
) => CommonStore<T>;

export interface CreateStoreReturnValue<T> {
  getState: StoreGetState<T>;
  setState: StoreSetState<T>;
  customSetState?: (state: any) => void;
  onChange: (callback: (newState: T, prevState: T) => void) => () => void;
}

export type CommonStore<T> = StateStore<T> | ReducerStore<T>;

const createStore = <T = any>(
  createState: T | MiddlewareReturnType<T>,
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
      const idx = callbackList.indexOf(callback);
      callbackList.splice(idx, 1);
    };
  };

  if (typeof createState === 'function') {
    const {
      state: createdState,
      ...rest
    } = (createState as ReducerReturnType<T>)(setState, getState);
    state = createdState;

    return { getState, setState, onChange, ...rest };
  } else {
    state = createState;
    return { getState, setState, onChange };
  }
};

export default createStore;
