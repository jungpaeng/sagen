import React from "react";
import {CreateStoreReturnValue} from "./createStore";

type EqualityFunction<T> = (prev: T, next: T) => boolean;

const useGlobalStore = <T = any>(
  store: CreateStoreReturnValue<T>,
  selector?: (value: T) => any,
  equalityFn: EqualityFunction<T> = (prev, next) => prev === next,
): [
  T,
  CreateStoreReturnValue<T>["setValue"],
  T,
] => {
  const prevValue = React.useRef(store.getValue());
  const [value, setValue] = React.useState(store.getValue());

  const selectedValue = React.useCallback((value: T) => (
    selector ? selector(value) : value
  ), [selector]);

  React.useEffect(() => {
    // change callback
    const valueChange = store.onChange((newVal: T) => {
      if (!equalityFn(selectedValue(newVal), selectedValue(prevValue.current))) {
        setValue(newVal);
      }
    });

    return valueChange;
  }, [store]);

  React.useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return [ selectedValue(value), store.setValue, prevValue.current ];
};

export default useGlobalStore;