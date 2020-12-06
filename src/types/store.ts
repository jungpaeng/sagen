export type SetValueFunction<T = any> = (currValue: T) => T;

export type StoreGetState<T = any> = () => T;
export type StoreSetState<T = any> = (
  newValue: T | SetValueFunction<T>,
) => void;

export interface CreateStoreReturnValue<T> {
  getState: StoreGetState<T>;
  setState: StoreSetState<T>;
  customSetState?: (state: any) => void;
  onChange: (callback: (newState: T, prevState: T) => void) => void;
}

export type EqualityFunction<T> = (prev: T, next: T) => boolean;
