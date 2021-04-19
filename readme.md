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

sagen is a state management library that provides multiple stores without a provider.

#### create store

You can create a store to manage state.

```typescript
import { createStore } from 'sagen';

const globalStore = createStore({ num: 0, str: '' });
```

#### management state

If you use the `useGlobalStore` hook, you can return the `state` value and the `setState` function.

It is used in the same way as `setState` and works synchronously.

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

#### middleware for sagen

**sagen is compatible with Redux's middleware.**

The following is a simple redux logger middleware.

```ts
import { createStore, composeMiddleware } from 'sagen';

const loggerMiddleware = store => next => action => {
  console.log('current state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}

const store = createStore(0, composeMiddleware(loggerMiddleware));
const [state, setState] = useGlobalStore(store);

setState(1);
```

**console log**

```console
current state,  0
action, 1
next state,  1
```

#### Subscribe event at store update

When an update occurs, an event can be executed, and the next value is not affected.

```ts
import { createStore } from 'sagen';

const store = createStore(0);

// Returns a function that unsubscribes from event.
const removeEvent = store.onSubscribe((newState, prevState) => {
  console.log(`prev: ${prevState}, new: ${newState}`);
});

const [state, setState] = useGlobalStore(store);
setState(1);
// [console.log] prev: 0, new: 1

removeEvent();
setState(0);
// [console.log] Empty
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

#### action, dispatch

You can add `action` to `store` created with `createStore` function.

```typescript jsx
const store = createStore(0);
const storeDispatch = createDispatch(store);
const storeAction = store.setAction((getter) => ({
  INCREMENT: () => getter() + 1,
  ADD: (num) => getter() + num,
}));

const App = () => {
  const [state, setState] = useGlobalStore(store);

  return (
    <div className="App">
      <p>number state: {state}</p>
      <button onClick={() => storeDispatch(storeAction.INCREMENT)}>
        ClickMe
      </button>
      <button onClick={() => storeDispatch(storeAction.ADD, 100)}>
        ClickMe
      </button>
    </div>
  );
};
```

After adding `action` to `store` as above, you can use it through `dispatch`.

This makes writing `customSetState` easier.

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

`sagen` can be used without React.

Try the [sagen-core](https://www.npmjs.com/package/sagen-core) library.

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
