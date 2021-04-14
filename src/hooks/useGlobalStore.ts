import React from 'react';
import { CreateStore } from 'sagen-core';

function defaultEqualityFn(prev: any, next: any) {
  return prev === next;
}

export function useGlobalStore<State = any>(
  store: CreateStore<State>,
  selector?: (value: State) => any,
  equalityFn = defaultEqualityFn,
): [State, (state: any) => any] {
  const [, forceUpdate] = React.useReducer((curr: number) => curr + 1, 0) as [never, () => void];
  const selectedState = React.useCallback((state: State) => (selector ? selector(state) : state), [
    selector,
  ]);

  React.useLayoutEffect(() => {
    // change callback
    const stateChange = store.onSubscribe((newState: State, prevState: State) => {
      if (!equalityFn(selectedState(newState), selectedState(prevState))) {
        forceUpdate();
      }
    });

    return stateChange;
  }, [selectedState, equalityFn, store]);

  return [selectedState(store.getState()), store.setState];
}
