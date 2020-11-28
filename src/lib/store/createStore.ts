type SetValueFunction<T = any> = (currValue: T) => T;
export type StoreGetState<T = any> = () => T;
export type StoreSetState<T = any> = (newValue: T | SetValueFunction<T>) => void;

export interface CreateStoreReturnValue<T> {
  getPrevState: () => T;
  getState: StoreGetState<T>;
  setState: StoreSetState<T>;
  onChange: (callback: (newValue: T) => void) => void;
}

const createStore = <T = any>(createState: T): CreateStoreReturnValue<T> => {
  const callbackList: Array<(newValue: T) => void> = [];
  let state = createState;
  let prevState = createState;

  const getPrevState = () => prevState;
  const getState = () => state;

  const setState = (nextState: T | SetValueFunction<T>) => {
    prevState = state;
    state = typeof nextState === "function" ? (nextState as Function)(state) : nextState;
    callbackList.forEach((callback) => callback(state));
  };

  // state changed callback
  const onChange = (callback: (nextState: any) => void) => {
    callbackList.push(callback);

    return () => {
      const idx = callbackList.findIndex(callback);
      callbackList.splice(idx, 1);
    };
  };

  return { getPrevState, getState, setState, onChange };
};

export default createStore;