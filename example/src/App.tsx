import React from 'react';
import AppPersist from './AppPersist';
import { createStore, redux, useGlobalStore, devTools } from 'sagen';
import globalStore from './store/globalStore';

export function testReducer(state: any, action: any) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const reduxStore = createStore(devTools(redux(testReducer, 0), 'changed testReducer'));

const numberSelector = (state: { num: number }) => state.num;
const stringSelector = (state: { str: string }) => state.str;

const NumberChild = () => {
  const [num, setValue] = useGlobalStore(globalStore, numberSelector);

  const handleClickBtn = React.useCallback(() => {
    setValue((curr: any) => ({
      ...curr,
      num: curr.num + 1,
    }));
  }, [setValue]);

  return (
    <div className="App">
      <p>number: {num}</p>
      <button onClick={handleClickBtn}>Click</button>
    </div>
  );
};

const StringChild = () => {
  const [str] = useGlobalStore(globalStore, stringSelector);

  return (
    <div className="App">
      <p>string: {str}</p>
    </div>
  );
};

function App() {
  const [state, dispatch] = useGlobalStore(reduxStore);

  return (
    <div className="App">
      <p>state: {state}</p>
      <button
        onClick={() => {
          dispatch({ type: 'INCREMENT' });
        }}>
        ClickMe
      </button>
      <NumberChild />
      <StringChild />
      <AppPersist />
    </div>
  );
}

export default App;
