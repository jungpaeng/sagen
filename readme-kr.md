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

sagen은 Provider 없이 multiple store를 제공하는 상태 관리 라이브러리입니다.

### 1. store 만들기

`store`를 생성해 state를 관리할 수 있습니다. store는 다음 기능을 제공합니다.

- React에서 사용시 state 변화 감지
- store state 비교 연산 커스텀으로 렌더링 최적화
- reducer와 유사한 패턴으로 store 관리 정형화

#### 1-a. createStore

함수가 아닌 값을 `store`에 저장할 수 있습니다.

params|isRequired|type|return
---|---|---|---
state|true|함수가 아닌 값|Store
middleware|false|Middleware|

```typescript
import { createStore } from 'sagen';

const numberStore = createStore(0);
const multipleStore = createStore({ num: 0, str: '' });
```

### 2. state 값 관리

`state` 값은 `useGlobalStore` Hook을 사용해 관리해야 React에서 감지할 수 있습니다.
`useGlobalStore` Hook은 `useState` Hook과 사용 방법이 동일하지만, 동기로 동작합니다.

`useGlobalStore`은 `[getter, setter]`를 반환하며, 각각 다음 Hook을 사용해서 반환받을 수 있습니다.

- getter: useSagenState
- setter: useSetSagenState

#### 2-a. useSagenState

`useSagenState` Hook은 `store`의 `getter`를 반환합니다.

반환받은 `getter`는 값이 변하면 React에서 이를 감지합니다.

params|isRequired|type|return
---|---|---|---
store|true|Store|getter

#### 2-b. useSetSagenState

`useSetSagenState` Hook은 `store`의 `setter`를 반환합니다.

반환받은 `setter`를 사용해 값을 수정해야만 React에서 변화를 감지할 수 있습니다.

params|isRequired|type|return
---|---|---|---
store|true|Store|setter

#### 2-c. useGlobalStore

`useGlobalStore` Hook은 `store`의 `getter`와 `setter`를 반환합니다.

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

#### 2-e. shallowEqual

객체 또는 배열 등 `===`로 비교힐 수 없는 값의 경우, `shallowEqual` 함수를 넘겨서 값을 비교할 수 있습니다.

객체 또는 배열의 경우 `shallowEqual` 값을 넘겨야 값 비교를 통한 리액트 렌더링 최적화를 할 수 있습니다.

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

`createStore` 함수로 생성한 `store`에 `action`을 추가해 관리할 수 있습니다.

#### 3-a. setAction

`Dispatch`를 이용하기 전, `Action`을 정의해야 합니다.

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

`dispatch` 함수는 인자로 `action`을 통해 만든 값을 전달합니다.

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

**sagen은 Redux의 미들웨어를 호환합니다.**

#### 4-a. composeMiddleware

다음은 간단한 logger middleware 입니다.

`composeMiddleware`를 사용해 여러 `middleware`를 조합할 수 있으며, `createStore`의 두 번째 인자에 넘깁니다.

```ts
import { createStore, composeMiddleware } from 'sagen';

const loggerMiddleware = store => next => action => {
  console.log('현재 상태', store.getState());
  console.log('액션', action);
  next(action);
  console.log('다음 상태', store.getState());
}

const store = createStore(0, composeMiddleware(loggerMiddleware));
const [state, setState] = useGlobalStore(store);

setState(1);
```

**console log**

```console
현재 상태,  0
액션, 1
다음 상태,  1
```

### 5. 이벤트 구독

업데이트가 발생할 때 event를 실행시킬 수 있습니다.

이 event는 state 값에 영향을 줄 수 없습니다.

#### 5-a. onSubscribe

```ts
import { createStore } from 'sagen';

const store = createStore(0);

// event 구독을 취소하는 함수를 반환합니다.
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

## React 없이 사용하기

`sagen`은 React 없이 사용할 수 있습니다.

[sagen-core](https://www.npmjs.com/package/sagen-core) 라이브러리를 사용해보세요.

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
