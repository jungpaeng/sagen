import { DispatchType } from './redux';

export type SetValueFunction<T = any> = (currValue: T) => T;
export type NextState<T> = T | SetValueFunction<T>;
export type StoreGetState<T = any> = () => T;
export type StoreSetState<T = any> = (newValue: NextState<T>) => void;

export interface CreateStoreReturnValue<T> {
  getState: StoreGetState<T>;
  setState: StoreSetState<T>;
  customSetState?: (state: any) => void;
  onChange: (callback: (newState: T, prevState: T) => void) => () => void;
}

export type EqualityFunction<T> = (prev: T, next: T) => boolean;

export interface StateStore<T> {
  state: T;
  customSetState: StoreSetState<T>;
}

export interface ReducerStore<T> {
  state: T;
  customSetState: DispatchType;
}
export type ReducerReturnType<T> = (
  setState: StoreSetState<T>,
  getState: StoreGetState<T>,
) => ReducerStore<T>;

export type CommonStore<T> = StateStore<T> | ReducerStore<T>;

export type MiddlewareReturnType<T> = (
  setState: StoreSetState<T>,
  getState: StoreGetState<T>,
) => CommonStore<T>;
