export interface CreateStoreReturnValue<T> {
  getValue: () => T;
  setValue: (newValue: T) => void;
  onChange: (callback: (newValue: T) => void) => void;
}

const createStore = <T = any>(defaultValue: T): CreateStoreReturnValue<T> => {
  const callbackList: Array<(newValue: T) => void> = [];
  let value = defaultValue;

  const getValue = () => {
    return value;
  };

  const setValue = (newValue: T) => {
    value = newValue;
    callbackList.forEach((callback) => callback(newValue));
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