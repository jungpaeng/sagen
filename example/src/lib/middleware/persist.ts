import {StoreSetState} from '../store';
import {ReducerReturnType, ReducerAction, ReducerStore} from '.';

type StateStorage = {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
}

interface PersistOptions<T> {
  name: string;
  storage?: StateStorage;
  serialize?: (state: T) => string | Promise<string>;
  deserialize?: (state: string) => T | Promise<T>;
}

const tempStorage = {
  getItem: () => null,
  setItem: () => {},
}

const persist = <T = any>(options: PersistOptions<T>, createState: T | ReducerReturnType<T>): ReducerReturnType<T> => (
  getState,
  setState,
): ReducerStore<T> =>  {
  const {
    name,
    storage = typeof localStorage !== 'undefined' ? localStorage : tempStorage,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const setStorage = async () => storage.setItem(name, await serialize(getState()));

  (async () => {
    try {
      const storedState = await storage.getItem(name);
      if (storedState) setState(await deserialize(storedState));
    } catch (e) {
      console.error(new Error(`Unable to get to stored in "${name}"`))
    }
  })();

  if (typeof createState === "function") {
    const {state, customSetState: dispatch} = (createState as ReducerReturnType<T>)(getState, setState);
    const customSetState = (action: ReducerAction) => {
      dispatch(action);
      setStorage();
    };

    return { state, customSetState };
  } else {
    const customSetState = (nextState: StoreSetState<T>) => {
      // @ts-ignore
      setState(nextState);
      setStorage();
    };

    // @ts-ignore
    return { state: createState, customSetState };
  }
};

export default persist;