import createStore, {CreateStoreReturnValue} from './createStore';

interface ReducerAction {
  type: string;
  [key: string]: any;
}

interface ReducerReturnType<T> {
  store: CreateStoreReturnValue<T>;
  dispatch: (action: ReducerAction) => void;
}

type ReducerFunction<T> = (state: T, action: ReducerAction) => T;

const createReduceStore = <T = any>(reducer: ReducerFunction<T>, defaultState: T): ReducerReturnType<T> => {
  const store = createStore(defaultState);
  const dispatch = (action: ReducerAction) => {
    store.setState(reducer(store.getState(), action));
  };

  return { store, dispatch };
};

export default createReduceStore;