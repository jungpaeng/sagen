export interface ReducerAction {
  type: string;
  [key: string]: any;
}

export type DispatchType = (action: ReducerAction) => void;
export type ReducerFunction<T> = (state: T, action: ReducerAction) => T;
