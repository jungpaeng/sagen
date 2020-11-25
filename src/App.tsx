import React from 'react';
import useGlobalStore from "./lib/useGlobalStore";
import globalStore from './store/globalStore';

const numberSelector = (state: { num: number }) => state.num;
const stringSelector = (state: { str: string }) => state.str;

const NumberChild = () => {
  const [num, setValue, prevValue] = useGlobalStore(globalStore, numberSelector);

  const handleClickBtn = React.useCallback(() => {
    setValue((curr) => ({
      ...curr,
      num: curr.num + 1
    }));
  }, [setValue]);

  return (
    <div className="App">
      <p>number: {num}</p>
      <p>temp number: {prevValue.num}</p>
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
  return (
    <div className="App">
      <NumberChild />
      <StringChild />
    </div>
  );
}

export default App;
