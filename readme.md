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

sagen is a state management library that uses a combination of individual repositories without root repositories.

### 1. Create a repository

You can create a `store` to manage the state. The store offers the following features:

-Detect changes in status when used in React
-Combine multiple repositories to create one repository
-Store management standardized with reducer and pattern
-Store state comparison operation is managed to minimize the operation of unused state

#### 1-a. createStore

You can display values that are not functions in `store`.

```typescript
import { createStore } from 'sagen';

const numberStore = createStore(0);
const multipleStore = createStore({ num: 0, str: '' });
```

### 2. Status value management

The `createStore` function returns `getState`,`setState` functions.

In React, you can use `useGlobalStore`, `useSagenState`, and `useSetSagenState` to manage values.

#### 2-a. useGlobalStore

The `useGlobalStore` Hook returns `getter` and `setter` as an array.

The usage method is the same as the `React.useState` Hook.

Changes from other configurations can be received as `getter`.

```typescript jsx
import { createStore, useGlobalStore } from 'sagen';

const store = createStore(0);

function Test() {
  const [num, setNum] = useGlobalStore(store);
  
  const incrementNum = () => {
    setNum(curr => curr + 1);
  };
  
  return (
    <div>
      <p>num: {num}</p>
      <button onClick={incrementNum}>
        Increment
      </button>
    </div>
  );
}
```

#### 2-b. useSagenState

`useSagenState` Hook returns `getter` of `store`.

```typescript jsx
import { createStore, useSagenState } from 'sagen';

const store = createStore(0);

function Test() {
  const num = useSagenState(store);

  return (
    <p>num: {num}</p>
  );
}
```

#### 2-c. useSetSagenState

`useSetSagenState` Hook returns `setter` of `store`.

```typescript jsx
import { createStore, useSetSagenState } from 'sagen';

const store = createStore(0);

function Test() {
  const setNum = useSagenState(store);

  const incrementNum = () => {
    setNum(curr => curr + 1);
  };

  return (
    <button onClick={incrementNum}>
      Increment
    </button>
  );
}
```

#### 2-1. getter

You can add arguments to `useGlobalStore` and `useSagenState` that return `getter`.

This is used for performance optimization.

##### 2-1-a. selector

You can pass `selector` to `useGlobalStore` and `useSagenState`.

This is mainly used for object stores, and allows you to subscribe only to the desired value of the object values.

The subscribed value only affects `getter`, and `setter` has information about the original value.

Since sagen operates only on the values that the component subscribes to,

it is not recommended to subscribe to values that are not being used.

```typescript jsx
import { createStore, useGlobalStore } from 'sagen';

const infoStore = createStore({
  name: 'jungpaeng',
  age: 22,
});

const ageSelector = store => store.age;

function Test() {
  // Pass the ageSelector as the component uses only the age value.
  const [age, setInfo] = useGlobalStore(infoStore, ageSelector);

  const incrementAge = () => {
    setInfo(curr => ({ ...curr, age: curr.age + 1 }));
  };

  return (
    <div>
      <p>age: {age}</p>
      <button onClick={incrementAge}>
        Increment
      </button>
    </div>
  );
}
```

##### 2-1-b. equalityFn

You can pass `equalityFn` to `useGlobalStore` and `useSagenState`.

Used to detect if a component's subscribed value has changed.

Basically, `===` is used to compare, and `shallowEqual` is provided for comparing arrays, objects, etc.

```typescript jsx
import { createStore, useGlobalStore, shallowEqual } from 'sagen';

const infoStore = createStore({
  name: 'jungpaeng',
  use: 'typescript',
  age: 22,
});

const selector = store => ({ name: store.name, age: store.age });

function Test() {
  // Even if the unsubscribed use value changes, the component does not react.
  const [info, setInfo] = useGlobalStore(infoStore, selector, shallowEqual);

  const incrementAge = () => {
    setInfo(curr => ({ ...curr, age: curr.age + 1 }));
  };

  return (
    <div>
      <p>name: {info.name}</p>
      <p>age: {info.age}</p>
      <button onClick={incrementAge}>
        Increment
      </button>
    </div>
  );
}
```

### 3. Dispatch

You can manage it by adding a `action` to the `store` created with the `createStore` function.

#### 3-a. setAction

Before using `Dispatch`, you need to define `Action`.

```typescript jsx
const store = createStore(0);
const storeAction = store.setAction((getter) => ({
  INCREMENT: () => getter() + 1,
  ADD: (num) => getter() + num,
}));
```

#### 3-a. createDispatch

The `dispatch` function passes the value created through `action` as an argument.

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

### 4. middleware

**sagen is compatible with Redux middleware.**

#### 4-a. composeMiddleware

Here is a simple logger middleware.

You can combine multiple `middleware` using `composeMiddleware`,

and pass it to the second argument of `createStore`.

```ts
import { createStore, composeMiddleware } from 'sagen';

const loggerMiddleware = store => next => action => {
  console.log('Current state', store.getState());
  console.log('Action', action);
  next(action);
  console.log('Next state', store.getState());
}

const store = createStore(0, composeMiddleware(loggerMiddleware));

// In Component ...
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

// In Component ...
const [state, setState] = useGlobalStore(store);
setState(1);
// [console.log] prev: 0, new: 1

removeEvent();
setState(0);
// [console.log] Empty
```

### 6. Store merging

Multiple `stores' can be combined and managed as a single `store`.

If you wish, you can also create and manage a single Root Store.

#### 6-a. composeStore

With `composeStore`, you can group `store` into a single `store`.

The integrated store is in a state of subscribing to the original store.

Changing values in one store affects values in other stores.

```typescript jsx
import { createStore, composeStore, useGlobalStore } from 'sagen';

const numStoreA = createStore(0);
const numStoreB = createStore(0);

const { store: numStoreAB } = composeStore({
  a: numStoreA,
  b: numStoreB,
});

function Test() {
  const [store, setStore] = useGlobalStore(store);

  const incrementA = () => {
    setStore(curr => ({
      ...curr,
      a: curr.a + 1,
    }));
  };

  const incrementB = () => {
    setStore(curr => ({
      ...curr,
      b: curr.b + 1,
    }));
  };

  return (
    <div>
      <p>A num: {store.a}</p>
      <button onClick={incrementA}>
        A Increment
      </button>

      <p>B num: {store.b}</p>
      <button onClick={incrementB}>
        B Increment
      </button>
    </div>
  );
}
```

## Using without React

`sagen` can be used without React.

Try the [sagen-core](https://www.npmjs.com/package/sagen-core) library.

## 📜 License
sagen is released under the [MIT license](https://github.com/jungpaeng/sagen/blob/main/LICENSE).

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
