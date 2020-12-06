import { StoreGetState, StoreSetState } from './store';

export interface ReducerAction {
  type: string;
  [key: string]: any;
}

export interface ReducerStore<T> {
  state: T;
  customSetState: DispatchType;
}

export type DispatchType = (action: ReducerAction) => void;
export type ReducerFunction<T> = (state: T, action: ReducerAction) => T;
export type ReducerReturnType<T> = (
  getState: StoreGetState<T>,
  setState: StoreSetState<T>,
) => ReducerStore<T>;
