import { PersistOptions } from '../types/persist';
import { DispatchType, ReducerAction } from '../types/redux';
import {
  CommonStore,
  NextState,
  ReducerReturnType,
  StoreGetState,
  StoreSetState,
} from '../types/store';

const tempStorage = {
  getItem: () => null,
  setItem: () => {},
};

const persist = <T = any>(
  options: PersistOptions<T>,
  createState: T | ReducerReturnType<T>,
) => (
  setState: StoreSetState<T>,
  getState: StoreGetState<T>,
): CommonStore<T> => {
  const {
    name,
    storage = typeof localStorage !== 'undefined' ? localStorage : tempStorage,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const setStorage = async () =>
    storage.setItem(name, await serialize(getState()));

  (async () => {
    try {
      const storedState = await storage.getItem(name);
      if (storedState) setState(await deserialize(storedState));
    } catch (e) {
      console.error(new Error(`Unable to get to stored in "${name}"`));
    }
  })();

  if (typeof createState === 'function') {
    const {
      state,
      customSetState: dispatch,
    } = (createState as ReducerReturnType<T>)(setState, getState);
    const customSetState: DispatchType = (action: ReducerAction) => {
      dispatch(action);
      setStorage();
    };

    return { state, customSetState };
  } else {
    const customSetState: StoreSetState<T> = (nextState: NextState<T>) => {
      setState(nextState);
      setStorage();
    };

    return { state: createState, customSetState };
  }
};

export default persist;
