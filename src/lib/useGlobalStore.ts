import React from "react";
import {CreateStoreReturnValue} from "./createStore";

const useGlobalStore = (store: CreateStoreReturnValue<any>) => {
  const [value, setValue] = React.useState(store.getValue());

  React.useEffect(() => {
    // change callback
    const valueChange = store.onChange((newVal: any) => {
      setValue(newVal);
    });

    return valueChange;
  }, [store]);

  return [ value, store.setValue ];
};

export default useGlobalStore;