<h1 align=center style="max-width: 100%;">
  <img width="300" alt="sagen Logo" src="https://user-images.githubusercontent.com/26024412/101279836-780ddb80-3808-11eb-9ff5-69693c56373e.png" style="max-width: 100%;"><br/>
</h1>

[![Build Status](https://travis-ci.com/jungpaeng/sagen.svg?branch=main)](https://travis-ci.com/jungpaeng/sagen)
[![Maintainability](https://api.codeclimate.com/v1/badges/0c2a4ad6c9ad60f3b2cf/maintainability)](https://codeclimate.com/github/jungpaeng/sagen/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0c2a4ad6c9ad60f3b2cf/test_coverage)](https://codeclimate.com/github/jungpaeng/sagen/test_coverage)

![min](https://badgen.net/bundlephobia/min/sagen@latest)
![minzip](https://badgen.net/bundlephobia/minzip/sagen@latest)
![dependency-count](https://badgen.net/bundlephobia/dependency-count/sagen@latest)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/sagen@latest)

[Korean](https://github.com/jungpaeng/sagen/blob/main/readme-kr.md) | [English](https://github.com/jungpaeng/sagen/blob/main/readme.md)  

## ⚙ Installation
#### npm
```bash
$ npm install --save sagen
```
#### yarn
```bash
$ yarn add sagen
```

## 🏃 Quick Start

#### create store


You can create a store to manage the state!

The store can store any value, and if you use the `useGlobalStore` hook,
you can return the `state` value and the `setState` function.

```typescript
import { createStore } from 'sagen';

const globalStore = createStore({ num: 0, str: '' });
```

#### management state

You can manage values using the `useGlobalStore` hook!

You don't need to add `Provider` to manage state.

```jsx
import React from 'react';
import { useGlobalStore } from 'sagen';

const App = () => {
  const [state, setState] = useGlobalStore(globalStore);

  return (
    <div>
      <p>number: {state.num}</p>
      <p>string: {state.str}</p>
      <button
        onClick={() => setState(curr => ({ ...curr, num: curr.num + 1 }))}
      >
        click me
      </button>
    </div>
  );
};
```

## Recipes

#### state selector


When getting the state value, you can process the state value by passing the `selector` function.

Basically, since the `===` operator compares the old value and the new value,
it is recommended to use only the required value in `state` as shown below.

```jsx
import React from 'react';
import { createStore, useGlobalStore } from 'sagen';

const globalStore = createStore({ num: 0, str: '' });
const numberSelector = state => state.num;
const stringSelector = state => state.str;

const NumberChild = () => {
  const [num, setValue] = useGlobalStore(globalStore, numberSelector);
  const handleClickBtn = React.useCallback(() => {
    setValue((curr) => ({
      ...curr,
      num: curr.num + 1,
    }));
  }, []);

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

const App = () => {
  const [number, setState] = useGlobalStore(globalStore, numberSelector);

  return (
    <div>
      <NumberChild />
      <StringChild />
    </div>
  );
};
```

#### customSetState

When passing an argument to the `createStore` function, it can be passed in the form of a function.

Internally, the first argument is a `set` function and the second argument is a `get` function. You can use this to write a `customSetState` function.

```typescript jsx
const testStore = createStore((set) => {
  return {
    state: {
      num: 1,
      str: 'test',
    },
    customSetState: {
      setNum: (num: number) => set((prev: any) => ({ ...prev, num })),
    },
  };
});

const App = () => {
  const [state, setState] = useGlobalStore(testStore);
  const { num, str } = state;
  const { setNum } = setState;

  return (
    <div className="App">
      <p>number state: {num}</p>
      <button onClick={() => setNum(100)}>
        ClickMe
      </button>
    </div>
  );
};
```

If written as above, `customStore` is returned as the second parameter of `useGlobalStore`.

If you want to calculate using the prev value in the received `setNum`, it should be written as follows.

```typescript jsx
customSetState: {
  setNum: (numFunc) => {
    if (typeof numFunc === 'function') {
      return set((prev: any) => ({ ...prev, num: numFunc(prev.num) }));
    } else {
      return set((prev: any) => ({ ...prev, numFunc }));
    }
  }
}
```

#### shallowEqual

For values that cannot be compared with `===`, such as objects or arrays,
you can pass the `shallowEqual` function to compare the values.

```jsx
import React from 'react';
import { createStore, useGlobalStore, shallowEqual } from 'sagen';

const globalStore = createStore({ num: 0, str: '' });
const storeSelector = state => state;

const App = () => {
  const [state, setState] = useGlobalStore(globalStore, storeSelector, shallowEqual);

  return (
    <div>
      ...
    </div>
  );
};
```

#### Use sagen without React

The `createStore` of `sagen` is not dependent on React. Usage is also the same as in React.

## Middleware

`sagen` provides `middleware` to manage how to store data, etc.

When a function is received from `createStore`,
it is executed by passing `getState` and `setState` values as arguments, and middleware can be created using them.

#### redux middleware

To manage state in a similar way to `redux`, you can use `redux` middleware.

```jsx
export function testReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const reduxStore = createStore(redux(testReducer, 0));
```

Pass the `reducer` function as the first function of the `redux` function and the `defaultValue` as the second argument.

If this store is passed to `useGlobalStore`, it will return `[state, dispatch]`.
If you have used the `useReducer` hook, you will be able to apply it faster.

```jsx
const App = () => {
  const [state, dispatch] = useGlobalStore(reduxStore);

  return (
    <div className="App">
      <p>state: {state}</p>
      <button
        onClick={() => dispatch({ type: 'INCREMENT' })}
      >
        ClickMe
      </button>
    </div>
  );
}
```

#### persist middleware

You can store data in storage and load values.

```jsx
const globalStore = createStore(
  persist(
    {
      name: 'local-persist-test',
      storage: localStorage,
    },
    redux(testReducer, 0),
  ),
);
```

#### redux devtools

You can use the 'redux devtools' extension to see the value change.

```jsx
const globalStore = createStore(
  devtools(
    persist(
      {
        name: 'local-persist-test',
        storage: localStorage,
      },
      redux(testReducer, 0),
    ),
    'prefix',
  )
);
```

## 📜 License
sagen is released under the [MIT license](https://github.com/jungpaeng/react-manage-global-state/blob/main/LICENSE).

```
Copyright (c) 2020 jungpaeng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
