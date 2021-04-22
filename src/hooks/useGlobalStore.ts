import { CreateStore } from 'sagen-core';
import { useSagenState } from './useSagenState';
import { useSetSagenState } from './useSetSagenState';

export function useGlobalStore<Selected = never, State = any>(
  store: CreateStore<State>,
  selector?: (value: State) => any,
  equalityFn?: (prev: State, next: State) => boolean,
) {
  const sagenState = useSagenState<Selected, State>(store, selector, equalityFn);
  const setSagenState = useSetSagenState<State>(store);

  return [sagenState, setSagenState];
}
