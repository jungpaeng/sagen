import { CreateStore, SetValueFunction } from 'sagen-core';
import { SagenState, useSagenState } from './useSagenState';
import { useSetSagenState } from './useSetSagenState';

export function useGlobalStore<Selected = never, State = any>(
  store: CreateStore<State>,
  selector?: (value: State) => Selected,
  equalityFn?: (prev: State, next: State) => boolean,
): [SagenState<Selected, State>, (state: State | SetValueFunction<State>) => void] {
  const sagenState = useSagenState<Selected, State>(store, selector, equalityFn);
  const setSagenState = useSetSagenState<State>(store);

  return [sagenState, setSagenState];
}
