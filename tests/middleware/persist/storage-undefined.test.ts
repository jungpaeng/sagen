import persist from '../../../src/middleware/persist';
import { createPersistStore } from './lib';

describe('persist', () => {
  const DEFAULT_VALUE = 100;
  Object.defineProperty(window, 'localStorage', {
    value: undefined,
  });

  it('should return changed value if run setState function', () => {
    const {
      getStore,
      persistStore: { state, customSetState },
    } = createPersistStore(DEFAULT_VALUE);
    expect(state).toBe(DEFAULT_VALUE);
    customSetState((() => DEFAULT_VALUE + 1) as any);
    expect(getStore()).toBe(DEFAULT_VALUE + 1);
  });
});
