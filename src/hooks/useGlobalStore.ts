import React from 'react';
import { CreateStore, SetValueFunction } from 'sagen-core';
import { useSagenState } from './useSagenState';
import { useSetSagenState } from './useSetSagenState';

export function useGlobalStore<State = any>(
  store: CreateStore<State>,
  selector?: (value: State) => any,
  equalityFn?: (prev: State, next: State) => boolean,
): [State, (state: State | SetValueFunction<State>) => void] {
  const sagenState = useSagenState(store, selector, equalityFn);
  const setSagenState = useSetSagenState(store);

  return [sagenState, setSagenState];
}
