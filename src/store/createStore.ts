import { isFunction } from '../lib';

export type SetValueFunction<T = any> = (currValue: T) => T;
export type NextState<T> = T | SetValueFunction<T>;

export type StoreGetState<T = any> = () => T;
export type StoreSetState<T = any> = (newValue: NextState<T>) => void;

export type ReducerAction = {
  type: string;
  [key: string]: any;
};

export type DispatchType = (action: ReducerAction) => void;

export interface CustomStore<State, SetState> {
  state: State;
  customSetState: SetState;
}

export type StateStore<State> = CustomStore<State, StoreSetState<State>>;
export type ReducerStore<State> = CustomStore<State, DispatchType>;

export type CommonStore<State> = StateStore<State> | ReducerStore<State>;

export type StoreReturnType<State, ReturnType = CustomStore<State, any>> = (
  setState: StoreSetState<State>,
  getState: StoreGetState<State>,
) => ReturnType;

export type ReducerReturnType<State> = StoreReturnType<State, ReducerStore<State>>;

export interface CreateStoreReturnValue<State> {
  getState: StoreGetState<State>;
  setState: StoreSetState<State>;
  customSetState?: (state: any) => void;
  onChange: (callback: (newState: State, prevState: State) => void) => () => void;
}

const createStore = <State = any>(
  createState: State | StoreReturnType<State, CommonStore<State>>,
): CreateStoreReturnValue<State> => {
  let state: State;
  const callbackList: Array<(newState: State, prevState: State) => void> = [];

  const getState = () => state;
  const setState = (nextState: State | SetValueFunction<State>) => {
    const prevState = state;
    state = isFunction(nextState) ? (nextState as Function)(state) : nextState;
    callbackList.forEach((callback) => callback(state, prevState));
  };

  // state changed callback
  const onChange = (callback: (nextState: any, prevState: any) => void) => {
    callbackList.push(callback);

    return () => {
      // remove added callback
      callbackList.splice(callbackList.indexOf(callback), 1);
    };
  };

  if (isFunction(createState)) {
    const { state: createdState, ...rest } = (createState as ReducerReturnType<State>)(
      setState,
      getState,
    );
    state = createdState;

    return { getState, setState, onChange, ...rest };
  } else {
    state = createState as State;
    return { getState, setState, onChange };
  }
};

export default createStore;
