import { renderHook, act } from '@testing-library/react-hooks';
import { createDispatch, createStore, useGlobalStore } from '..';

describe('useGlobalStore', () => {
  it('should return default value', () => {
    const store = createStore(0);
    const { result } = renderHook(() => useGlobalStore(store));

    expect(result.current[0]).toBe(0);
  });

  it('should return changed value', () => {
    const store = createStore(0);
    const { result } = renderHook(() => useGlobalStore(store));

    act(() => result.current[1](100));
    expect(result.current[0]).toBe(100);
  });

  it('should get previous state value in setState', () => {
    const store = createStore(0);
    const { result } = renderHook(() => useGlobalStore(store));

    act(() => result.current[1]((prev: number) => prev));
    expect(result.current[0]).toBe(0);

    act(() => result.current[1]((prev: number) => prev + 100));
    expect(result.current[0]).toBe(100);
  });

  it('should not change if set state pass prev state', () => {
    const store = createStore(0);
    const storeDispatch = createDispatch(store);
    const storeAction = store.setAction((getter) => ({
      INCREMENT: () => getter() + 1,
    }));

    const { result } = renderHook(() => useGlobalStore(store));

    act(() => storeDispatch(storeAction.INCREMENT));
    expect(result.current[0]).toBe(1);
  });

  it('should pass selector function', () => {
    const objStore = createStore({ num: 0 });
    const storeDispatch = createDispatch(objStore);
    const storeAction = objStore.setAction((getter) => ({
      INCREMENT: () => ({
        ...getter(),
        num: getter().num + 1,
      }),
      ADD: (num: number) => ({
        ...getter(),
        num: getter().num + num,
      }),
    }));

    const numberSelector = (state: any) => state.num;
    const { result } = renderHook(() => useGlobalStore(objStore, numberSelector));
    expect(result.current[0]).toBe(0);

    act(() => result.current[1]({ num: 100 }));
    expect(result.current[0]).toBe(100);

    act(() => storeDispatch(storeAction.INCREMENT));
    expect(result.current[0]).toBe(101);

    act(() => storeDispatch(storeAction.ADD, 99));
    expect(result.current[0]).toBe(200);
  });
});
