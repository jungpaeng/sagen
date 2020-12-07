import { createPersistStore, createReduxPersistStore } from './lib';

describe('persist - common', () => {
  const DEFAULT_VALUE = 100;

  it('should return default value if get state', () => {
    const { persistStore } = createPersistStore(DEFAULT_VALUE);
    expect(persistStore.state).toBe(DEFAULT_VALUE);
  });

  it('should return changed value if run dispatch', () => {
    const {
      persistStore: { state, customSetState },
      getStore,
    } = createReduxPersistStore(DEFAULT_VALUE);

    expect(state).toBe(DEFAULT_VALUE);
    customSetState({ type: 'INCREMENT' });
    expect(getStore()).toBe(101);
  });

  it('should return changed value if run setState', () => {
    const {
      persistStore: { state, customSetState },
      getStore,
    } = createPersistStore(DEFAULT_VALUE);

    expect(state).toBe(DEFAULT_VALUE);
    customSetState(111 as any);
    expect(getStore()).toBe(111);
  });
});
