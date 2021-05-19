import { CreateStore } from 'sagen-core';
import React from 'react';

function defaultEqualityFn(prev: any, next: any) {
  return prev === next;
}

export type SagenState<Selected = never, State = any> = [Selected] extends [never]
  ? State
  : Selected;

export function useSagenState<Selected = never, State = any>(
  store: CreateStore<State>,
  selector?: (value: State) => Selected,
  equalityFn = defaultEqualityFn,
): SagenState<Selected, State> {
  const [, forceUpdate] = React.useReducer((curr: number) => curr + 1, 0) as [never, () => void];
  const selectedState = React.useCallback(
    (state: State) => (selector ? selector(state) : state) as SagenState<Selected, State>,
    [selector],
  );

  React.useLayoutEffect(() => {
    // change callback
    const stateChange = store.onSubscribe((newState: State, prevState: State) => {
      if (!equalityFn(selectedState(newState), selectedState(prevState))) {
        forceUpdate();
      }
    });

    return stateChange;
  }, [selectedState, equalityFn, store]);

  return selectedState(store.getState());
}
