import { act, renderHook } from '@testing-library/react-hooks';
import { createStore, useGlobalStore, useSagenState } from '..';

describe('useSetStore', () => {
  it('should return changed value', () => {
    const store = createStore(0);
    const { result: globalStore } = renderHook(() => useGlobalStore(store));
    const { result: getStore } = renderHook(() => useSagenState(store));

    act(() => globalStore.current[1](100));
    expect(getStore.current).toBe(100);
  });

  it('should get previous state value in setState', () => {
    const store = createStore(0);
    const { result: globalStore } = renderHook(() => useGlobalStore(store));
    const { result: getStore } = renderHook(() => useSagenState(store));

    act(() => globalStore.current[1]((curr) => curr + 100));
    expect(getStore.current).toBe(100);
  });
});
