import persist from '../../../src/middleware/persist';
import redux from '../../../src/middleware/redux';

const testReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
  }
};

export const createReduxPersistStore = (defaultValue: any) => {
  let store: any;
  const persistFunction = persist(
    { name: 'test-storage' },
    redux(testReducer, defaultValue),
  );
  const persistStore = persistFunction(
    (state) => {
      store = typeof state === 'function' ? (state as Function)(store) : state;
    },
    () => store,
  );

  return {
    persistStore,
    getStore: () => store,
  };
};

export const createPersistStore = (defaultValue: any) => {
  let store: any;
  const persistFunction = persist({ name: 'test-storage' }, defaultValue);
  const persistStore = persistFunction(
    (state) => {
      store = typeof state === 'function' ? (state as Function)(store) : state;
    },
    () => store,
  );

  return {
    persistStore,
    getStore: () => store,
  };
};
