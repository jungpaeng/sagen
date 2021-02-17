import { CommonStore, StoreGetState, StoreSetState } from '../store/createStore';
import createStateMiddleware, { CreateState } from './createStateMiddleware';

export interface StateStorage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
}

export interface PersistOptions<T> {
  name: string;
  storage?: StateStorage;
  serialize?: (state: T) => string | Promise<string>;
  deserialize?: (state: string) => T | Promise<T>;
}

const tempStorage = {
  getItem: () => null,
  setItem: () => {},
};

const persist = <State = any>(options: PersistOptions<State>, createState: CreateState<State>) => (
  setState: StoreSetState<State>,
  getState: StoreGetState<State>,
): CommonStore<State> => {
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
      console.error(new Error(`Unable to get to stored in "${name}"`));
    }
  })();

  const storageMiddleware = createStateMiddleware(setStorage);

  return storageMiddleware(createState, setState, getState);
};

export default persist;
