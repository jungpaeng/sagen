import { createStore, CreateStore } from 'sagen-core';

// [test function] compose store
// return new store from store object
export function UNSAFE_composeStore<ComposedStore extends Record<string, any>>(
  storeMap: Record<string, CreateStore>,
): CreateStore<ComposedStore> {
  const storeMapKeys: string[] = [];
  const storeState: ComposedStore = {} as ComposedStore;

  for (const key in storeMap) {
    if (storeMap.hasOwnProperty(key)) {
      // initial setting
      storeMapKeys.push(key);
      storeState[key as keyof ComposedStore] = storeMap[key].getState();

      // sync subscribe
      storeMap[key].onSubscribe((next) => {
        const composedState = composedStore.getState();

        if (composedState[key] !== next)
          composedStore.setState((curr) => ({ ...curr, [key]: next }));
      });
    }
  }

  const composedStore = createStore(storeState);
  composedStore.onSubscribe((next, prev) => {
    storeMapKeys.forEach((key) => {
      if (next[key] !== prev[key] && storeMap[key].getState() !== next[key])
        storeMap[key].setState(next[key]);
    });
  });

  return composedStore;
}
