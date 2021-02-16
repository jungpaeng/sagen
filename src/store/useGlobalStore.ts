import React from 'react';
import { CreateStoreReturnValue } from './createStore';

export type EqualityFunction<State> = (prev: State, next: State) => boolean;

const defaultEqualityFn = (prev: any, next: any) => prev === next;

const useGlobalStore = <State = any>(
  store: CreateStoreReturnValue<State>,
  selector?: (value: State) => any,
  equalityFn: EqualityFunction<State> = defaultEqualityFn,
): [State, (state: any) => any] => {
  const [, forceUpdate] = React.useReducer((curr: number) => curr + 1, 0) as [never, () => void];
  const selectedState = React.useCallback((value: State) => (selector ? selector(value) : value), [
    selector,
  ]);

  const handleChangeState = React.useMemo(() => {
    return store.customSetState || store.setState;
  }, [store]);

  React.useLayoutEffect(() => {
    // change callback
    const stateChange = store.onChange((newState: State, prevState: State) => {
      if (!equalityFn(selectedState(newState), selectedState(prevState))) {
        forceUpdate();
      }
    });

    return stateChange;
  }, [selectedState, equalityFn, store]);

  return [selectedState(store.getState()), handleChangeState];
};

export default useGlobalStore;
