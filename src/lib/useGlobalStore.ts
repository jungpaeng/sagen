import React from "react";
import {CreateStoreReturnValue} from "./createStore";

type EqualityFunction<T> = (prev: T, next: T) => boolean;
const defaultEqualityFn = (prev: any, next: any) => prev === next;

const useGlobalStore = <T = any>(
  store: CreateStoreReturnValue<T>,
  selector?: (value: T) => any,
  equalityFn: EqualityFunction<T> = defaultEqualityFn,
): [
  T,
  CreateStoreReturnValue<T>["setState"],
  T,
] => {
  const [, forceUpdate] = React.useReducer((curr: number) => curr + 1, 0) as [never, () => void]

  const selectedState = React.useCallback((value: T) => (
    selector ? selector(value) : value
  ), [selector]);

  React.useEffect(() => {
    // change callback
    const stateChange = store.onChange((newVal: T) => {
      if ( !equalityFn( selectedState(newVal), selectedState(store.getPrevState()) ) ) {
        forceUpdate();
      }
    });

    return stateChange;
  }, [selectedState, equalityFn, store]);

  return [ selectedState(store.getState()), store.setState, store.getPrevState() ];
};

export default useGlobalStore;