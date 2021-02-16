import { renderHook, act } from '@testing-library/react-hooks';
import { createStore, useGlobalStore } from '../../src/store';
import { redux } from '../../src/middleware';

const testReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
  }
};

const store = createStore(0);
const reduxStore = createStore(redux(testReducer, 0));
const objStore = createStore({ num: 0 });
const numberSelector = (state: any) => state.num;

describe('useGlobalStore', () => {
  it('should return default value', () => {
    const { result } = renderHook(() => useGlobalStore(store));

    expect(result.current[0]).toBe(0);
  });

  it('should return changed value', () => {
    const { result } = renderHook(() => useGlobalStore(store));

    act(() => result.current[1](100));
    expect(result.current[0]).toBe(100);
  });

  it('should get previous state value in setState', () => {
    const { result } = renderHook(() => useGlobalStore(store));

    act(() => result.current[1]((prev: number) => prev + 100));
    expect(result.current[0]).toBe(200);
  });

  it('should not change if set state pass prev state', () => {
    const { result } = renderHook(() => useGlobalStore(store));

    act(() => result.current[1]((prev: number) => prev));
    expect(result.current[0]).toBe(200);
  });

  it('should use redux middleware', () => {
    const { result } = renderHook(() => useGlobalStore(reduxStore));

    act(() => result.current[1]({ type: 'INCREMENT' }));
    expect(result.current[0]).toBe(1);
  });

  it('should pass selector function', () => {
    const { result } = renderHook(() => useGlobalStore(objStore, numberSelector));

    expect(result.current[0]).toBe(0);
    act(() => result.current[1]({ num: 100 }));
    expect(result.current[0]).toBe(100);
  });
});
