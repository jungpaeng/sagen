import { CreateStore, SetValueFunction } from 'sagen-core';

export function useSetSagenState<State = any>(
  store: CreateStore<State>,
): (state: State | SetValueFunction<State>) => void {
  return store.setState;
}
