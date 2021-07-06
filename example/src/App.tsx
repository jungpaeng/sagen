import React from 'react';
import { createStore, useGlobalStore } from 'sagen';

const store = createStore({ ptr: 1 });

async function delay() {}

function App() {
  const [ptr, setPtr] = useGlobalStore(
    store,
    (state) => state.ptr,
    (prev, next) => {
      console.log('[APP]', prev, next);
      return prev === next;
    },
  );

  const onClick = async () => {
    setPtr((curr) => ({ ptr: curr.ptr + 1 }));
    await delay();
    setPtr((curr) => ({ ptr: curr.ptr + 1 }));
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <div>ptr: {ptr}</div>
      <Child />
      <button onClick={onClick}>+</button>
    </div>
  );
}

const Child = () => {
  const [ptr] = useGlobalStore(
    store,
    (state) => state.ptr,
    (prev, next) => {
      console.log('[Child]', prev, next);
      return prev === next;
    },
  );

  return <div>ptr: {ptr}</div>;
};
export default App;
