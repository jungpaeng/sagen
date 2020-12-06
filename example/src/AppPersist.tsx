import React from 'react';
import useGlobalStore from './lib/useGlobalStore';
import persist from './lib/middleware/persist';
import { createStore } from './lib/store';
import { redux } from './lib/middleware';

export function testReducer(state: { num: number; str: string }, action: any) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, num: state.num + 1 };
    case 'DECREMENT':
      return { ...state, num: state.num - 1 };
    default:
      return state;
  }
}
const globalStore = createStore(
  persist(
    {
      name: 'local-persist-test',
      storage: localStorage,
    },
    redux(testReducer, { num: 0, str: '' }),
  ),
);

const AppPersist = () => {
  const [object, dispatch] = useGlobalStore<{ num: number; str: string }>(
    globalStore,
  );

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
