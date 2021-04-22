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

## ⚙ How to install
#### npm
```bash
$ npm install --save sagen
```
#### yarn
```bash
$ yarn add sagen
```

## 🏃 Getting started

sagen is a state management library that provides multiple stores without a provider.

### 1. Create a store

You can manage the state by creating a `store`. The store offers the following features:

- State change detection when used in React
- Optimized rendering by custom store state comparison operation
- Standardize store management with a pattern similar to reducer

#### 1-a. createStore

Non-function values can be stored in `store`.

params|isRequired|type|return
---|---|---|---
state|true|Non-function|Store
middleware|false|Middleware|

```typescript
import { createStore } from 'sagen';

const numberStore = createStore(0);
const multipleStore = createStore({ num: 0, str: '' });
```

### 2. state value management

The `state` value must be managed using the `useGlobalStore` Hook so that React can detect it.
The `useGlobalStore` Hook uses the same method as the `useState` Hook, but works synchronously.

`useGlobalStore` returns `[getter, setter]`, and each can be returned using the following Hooks.

- getter: useSagenState
- setter: useSetSagenState

#### 2-a. useSagenState

`useSagenState` Hook returns `getter` of `store`.

When the returned `getter` value changes, React detects it.

params|isRequired|type|return
---|---|---|---
store|true|Store|getter

#### 2-b. useSetSagenState

`useSetSagenState` Hook returns `setter` of `store`.

React can detect the change only by modifying the value using the returned `setter`.

params|isRequired|type|return
---|---|---|---
store|true|Store|setter

#### 2-c. useGlobalStore

The `useGlobalStore` Hook returns `getter` and `setter` of `store`.

params|isRequired|type|return
---|---|---|---
store|true|Store|[getter, setter]

```jsx
import React from 'react';
import { useGlobalStore } from 'sagen';

const numberStore = createStore(0);

const App = () => {
  const [num, setNum] = useGlobalStore(numberStore);

  return (
    <div>
      <p>current: {num}</p>
      <button onClick={() => setNum(100)}>
        Set 100
      </button>
      <button onClick={() => setNum(curr => curr + 1)}>
        Increment
      </button>
    </div>
  );
};
```

#### 2-d. state selector

When getting the state value, you can process the state value by passing the `selector` function.

Basically, the operator `===` compares the old value to the new value.

It is recommended to use only the values required for `state` as shown below.

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

#### 2-e. shallowEqual

For values that cannot be compared with `===`, such as objects or arrays, you can pass the `shallowEqual` function to compare the values.

In the case of objects or arrays, you must pass the `shallowEqual` value to optimize React rendering through value comparison.

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

### 3. Dispatch

You can manage it by adding a `action` to the `store` created with the `createStore` function.

#### 3-a. setAction

Before using `Dispatch`, you need to define `Action`.

params|isRequired|type|return
---|---|---|---
action|true|(getter) => Action|Array\<keyof Action\>

```typescript jsx
const store = createStore(0);
const storeAction = store.setAction((getter) => ({
  INCREMENT: () => getter() + 1,
  ADD: (num) => getter() + num,
}));
```

#### 3-a. createDispatch

The `dispatch` function passes the value created through `action` as an argument.

params|isRequired|type|return
---|---|---|---
store|true|Store|Dispatch

```typescript jsx
const store = createStore(0);
const storeDispatch = createDispatch(store);
const storeAction = store.setAction((getter) => ({
  INCREMENT: () => getter() + 1,
  ADD: (num) => getter() + num,
}));
```

```typescript jsx
storeDispatch(storeAction.INCREMENT)
storeDispatch(storeAction.ADD, 100)
```

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


### 4. middleware

**sagen is compatible with Redux middleware.**

#### 4-a. composeMiddleware

Here is a simple logger middleware.

You can combine multiple `middleware` using `composeMiddleware`, and pass it to the second argument of `createStore`.

```ts
import { createStore, composeMiddleware } from 'sagen';

const loggerMiddleware = store => next => action => {
  console.log('Current state', store.getState());
  console.log('Action', action);
  next(action);
  console.log('Next state', store.getState());
}

const store = createStore(0, composeMiddleware(loggerMiddleware));
const [state, setState] = useGlobalStore(store);

setState(1);
```

**console log**

```console
Current state, 0
Action, 1
Next state, 1
```

### 5. Subscribe to events

You can trigger an event when an update occurs.

This event cannot affect the state value.

#### 5-a. onSubscribe

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

## Using without React

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
