import React from 'react';
import useGlobalStore from "./lib/useGlobalStore";
import globalStore from './store/globalStore';
import {createStore} from './lib/store';
import {redux} from './lib/middleware'

export function testReducer(state: number, action: any) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const reduxStore = createStore(redux(testReducer, 0));

const numberSelector = (state: { num: number }) => state.num;
const stringSelector = (state: { str: string }) => state.str;

const NumberChild = () => {
  const [num, setValue] = useGlobalStore(globalStore, numberSelector);

  const handleClickBtn = React.useCallback(() => {
    setValue((curr: any) => ({
      ...curr,
      num: curr.num + 1
    }));
  }, [setValue]);

  return (
    <div className="App">
      <p>number: {num}</p>
      <button onClick={handleClickBtn}>
        Click
      </button>
    </div>
  )
}

const StringChild = () => {
  const [str] = useGlobalStore(globalStore, stringSelector);

  return (
    <div className="App">
      <p>string: {str}</p>
    </div>
  )
}

function App() {
  const [state, dispatch] = useGlobalStore(reduxStore);
  console.log(state);

  return (
    <div className="App">
      <p>state: {state}</p>
      <button onClick={() => {
        // @ts-ignore
        dispatch({type: 'INCREMENT'});
      }}>
        ClickMe
      </button>
      <NumberChild />
      <StringChild />
    </div>
  );
}

export default App;
