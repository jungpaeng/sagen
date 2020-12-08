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

[Korean](./readme-kr.md) | [English](./readme.md)

## ⚙ 설치 방법
#### npm
```bash
$ npm install --save sagen
```
#### yarn
```bash
$ yarn add sagen
```

## 🏃 시작하기

#### store 만들기

store를 생성해 state를 관리할 수 있습니다!

store는 어떠한 값이든 저장할 수 있으며, `useGlobalStore` hook을 사용하면 `state` 값과 `setState` 함수를 반환받을 수 있습니다.

```typescript
import { createStore } from 'sagen';

const globalStore = createStore({ num: 0, str: '' });
```

#### state 값 관리

`useGlobalStore` hook을 사용해 값을 관리할 수 있습니다!

상태를 관리하기 위해 `Provider`를 추가하지 않아도 됩니다.

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

state 값을 가져올 때 `selector` 함수를 넘겨줘서 state 값을 가공할 수 있습니다.

기본적으로, `===` 연산자로 기존 값과 새로운 값을 비교하기 때문에 아래와 같이 `state`에서 필요한 값만을 사용하는 것이 좋습니다.

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

#### shallowEqual

객체 또는 배열 등 `===`로 비교힐 수 없는 값의 경우, `shallowEqual` 함수를 넘겨서 값을 비교할 수 있습니다.

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

#### React 없이 사용하기

`sagen`의 `createStore`는 React에 종속되어 있지 않습니다. 사용법 역시 React에서 사용하는 것과 동일합니다.

## Middleware

`sagen`은 데이터를 저장하는 방법 등에 대해 관리할 수 있는 `middleware`를 제공합니다.

`createStore`에서 함수를 받게 될 경우, `getState` 값과 `setState` 값을 인자로 넘겨 실행시키며, 이를 이용해 middleware를 작성할 수 있습니다.

#### redux middleware

`redux`와 비슷한 방법으로 state를 관리하려면 `redux` middleware를 사용하면 됩니다.

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

`redux` 함수의 첫 번째 함수로 `reducer` 함수, 두 번째 인자로 `defaultValue`를 넘겨주면 됩니다.

이 store를 `useGlobalStore`로 넘기게 된다면 `[state, dispatch]`를 반환합니다.
`useReducer` hook을 사용해본 경험이 있다면 더 빠르게 적용해볼 수 있을 것입니다.

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

storage에 데이터를 저장해 값을 불러올 수 있습니다.

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
