import React from "react";
import {CreateStoreReturnValue} from "./createStore";

const useGlobalStore = <T = any>(store: CreateStoreReturnValue<T>): [
  ReturnType<CreateStoreReturnValue<T>["getValue"]>,
  CreateStoreReturnValue<T>["setValue"],
] => {
  const [value, setValue] = React.useState(store.getValue());

  React.useEffect(() => {
    // change callback
    const valueChange = store.onChange((newVal: T) => {
      setValue(newVal);
    });

    return valueChange;
  }, [store]);

  return [ value, store.setValue ];
};

export default useGlobalStore;