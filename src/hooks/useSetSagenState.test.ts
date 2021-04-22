import { act, renderHook } from '@testing-library/react-hooks';
import { createStore, useGlobalStore, useSetSagenState } from '..';

describe('useSetStore', () => {
  it('should return changed value', () => {
    const store = createStore(0);
    const { result: globalStore } = renderHook(() => useGlobalStore(store));
    const { result: setStore } = renderHook(() => useSetSagenState(store));

    act(() => setStore.current(100));
    expect(globalStore.current[0]).toBe(100);
  });

  it('should get previous state value in setState', () => {
    const store = createStore(0);
    const { result: globalStore } = renderHook(() => useGlobalStore(store));
    const { result: setStore } = renderHook(() => useSetSagenState(store));

    act(() => setStore.current((curr) => curr + 100));
    expect(globalStore.current[0]).toBe(100);
  });
});
