import { CreateStoreReturnValue, StoreGetState, StoreSetState } from './index';

export function testReducer(state: number, action: ReducerAction) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

interface ReducerAction {
  type: string;
  [key: string]: any;
}

interface ReducerReturnType<T> {
  store: CreateStoreReturnValue<T>;
  dispatch: (action: ReducerAction) => void;
}

type ReducerFunction<T> = (state: T, action: ReducerAction) => T;

const redux = <T = any>(reducer: ReducerFunction<T>, defaultState: T) => {
  return (getState: StoreGetState<T>, setState: StoreSetState<T>) => {
    const dispatch = (action: ReducerAction) => {
      setState(state => reducer(state, action));
    };

    setState(defaultState);
    return { dispatch };
  }
};

export default redux;