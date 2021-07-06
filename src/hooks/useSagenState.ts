import React from 'react';
import { CreateStore } from 'sagen-core';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

function defaultEqualityFn(prev: any, next: any) {
  return prev === next;
}

export type SagenState<Selected = never, State = any> = [Selected] extends [never]
  ? State
  : Selected;

export function useSagenState<Selected = never, State = any>(
  store: CreateStore<State>,
  selector?: (value: State) => Selected,
  equalityFn = defaultEqualityFn,
): SagenState<Selected, State> {
  const [, forceUpdate] = React.useReducer((curr: number) => curr + 1, 0) as [never, () => void];
  const selectedState = React.useCallback(
    (state: State) => (selector ? selector(state) : state) as SagenState<Selected, State>,
    [selector],
  );

  const storeState = store.getState();

  const storeStateRef = React.useRef(storeState);
  const selectorRef = React.useRef(selector);
  const equalityFnRef = React.useRef(equalityFn);
  const erroredRef = React.useRef(false);

  const currentSliceRef = React.useRef<SagenState<Selected, State>>();
  if (currentSliceRef.current === undefined) {
    currentSliceRef.current = selectedState(storeState);
  }

  let newStateSlice: SagenState<Selected, State> | undefined;
  let hasNewStateSlice = false;

  if (
    storeStateRef.current !== storeState ||
    selectorRef.current !== selector ||
    equalityFnRef.current !== equalityFn ||
    erroredRef.current
  ) {
    // Using local variables to avoid mutations in the render phase.
    newStateSlice = selectedState(storeState);
    hasNewStateSlice = !equalityFn(
      currentSliceRef.current as SagenState<Selected, State>,
      newStateSlice,
    );
  }

  // Syncing changes in useEffect.
  useIsomorphicLayoutEffect(() => {
    if (hasNewStateSlice) {
      currentSliceRef.current = newStateSlice as SagenState<Selected, State>;
    }

    storeStateRef.current = storeState;
    selectorRef.current = selector;
    equalityFnRef.current = equalityFn;
    erroredRef.current = false;
  });

  const stateBeforeSubscriptionRef = React.useRef(storeState);
  useIsomorphicLayoutEffect(() => {
    const listener = () => {
      try {
        const nextState = store.getState();
        const nextStateSlice = selectorRef.current?.(nextState);

        if (
          !equalityFnRef.current(
            currentSliceRef.current as SagenState<Selected, State>,
            nextStateSlice,
          )
        ) {
          storeStateRef.current = nextState;
          currentSliceRef.current = nextStateSlice as SagenState<Selected, State>;
          forceUpdate();
        }
      } catch (error) {
        erroredRef.current = true;
        forceUpdate();
      }
    };

    const unSubscribe = store.onSubscribe(listener);

    if (store.getState() !== stateBeforeSubscriptionRef.current) {
      listener(); // state has changed before subscription
    }

    return unSubscribe;
  }, [selectedState, equalityFn, store]);

  return hasNewStateSlice
    ? (newStateSlice as SagenState<Selected, State>)
    : currentSliceRef.current!;
}
