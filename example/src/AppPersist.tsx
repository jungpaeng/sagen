import React from 'react';
import { createStore, devTools, persist, redux, useGlobalStore } from 'sagen';

interface TestReducer {
  num: number;
  str: string;
}

export function testReducer(state: TestReducer, action: any) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, num: state.num + 1 };
    case 'DECREMENT':
      return { ...state, num: state.num - 1 };
    default:
      return state;
  }
}
const globalStore = createStore<TestReducer>(
  devTools(
    persist(
      {
        name: 'local-persist-test',
        storage: localStorage,
      },
      redux(testReducer, { num: 0, str: '' }),
    ),
  ),
);

const AppPersist = () => {
  const [object, dispatch] = useGlobalStore<{ num: number; str: string }>(globalStore);

  return (
    <div>
      <p>num: {object.num}</p>
      <button
        onClick={() => {
          dispatch({ type: 'INCREMENT' });
        }}>
        Click Me
      </button>
    </div>
  );
};

export default AppPersist;
