type SetValueFunction<T = any> = (currValue: T) => T;

export interface CreateStoreReturnValue<T> {
  getValue: () => T;
  setValue: (newValue: T | SetValueFunction<T>) => void;
  onChange: (callback: (newValue: T) => void) => void;
}

const createStore = <T = any>(defaultValue: T): CreateStoreReturnValue<T> => {
  const callbackList: Array<(newValue: T) => void> = [];
  let value = defaultValue;

  const getValue = () => {
    return value;
  };

  const setValue = (newValue: T | SetValueFunction<T>) => {
    value = typeof newValue === "function" ? (newValue as Function)(value) : newValue;
    callbackList.forEach((callback) => callback(value));
  };

  // value changed callback
  const onChange = (callback: (newValue: any) => void) => {
    callbackList.push(callback);

    return () => {
      const idx = callbackList.findIndex(callback);
      callbackList.splice(idx, 1);
    };
  };

  return { getValue, setValue, onChange };
};

export default createStore;