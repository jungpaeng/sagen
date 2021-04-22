import { createStore } from 'sagen-core';
import { UNSAFE_composeStore } from './composeStore';

describe('composeStore', () => {
  it('ignore prototype property', () => {
    // @ts-ignore
    Object.prototype.boo = 0;

    const numStoreA = createStore(0);
    const numStoreB = createStore(0);

    const composeStore = { a: numStoreA, b: numStoreB };
    console.log('composeStore', composeStore);

    const numStoreAB = UNSAFE_composeStore<{ a: number; b: number }>(composeStore);

    expect(numStoreAB.getState()).toStrictEqual({ a: 0, b: 0 });
  });

  it("return object have to store's default value", () => {
    const numStoreA = createStore(0);
    const numStoreB = createStore(0);

    const numStoreAB = UNSAFE_composeStore<{ a: number; b: number }>({
      a: numStoreA,
      b: numStoreB,
    });

    expect(numStoreA.getState()).toBe(0);
    expect(numStoreB.getState()).toBe(0);
    expect(numStoreAB.getState()).toStrictEqual({ a: 0, b: 0 });
  });

  describe('change original store when change compose store', () => {
    it('number', () => {
      const numStoreA = createStore(0);
      const numStoreB = createStore(0);

      const numStoreAB = UNSAFE_composeStore<{ a: number; b: number }>({
        a: numStoreA,
        b: numStoreB,
      });

      numStoreAB.setState({ a: 1, b: 0 });

      expect(numStoreA.getState()).toBe(1);
      expect(numStoreB.getState()).toBe(0);
      expect(numStoreAB.getState()).toStrictEqual({ a: 1, b: 0 });
    });

    it('object', () => {
      const objStoreA = createStore({ num: 0 });
      const objStoreB = createStore({ num: 0 });

      const objStoreAB = UNSAFE_composeStore<{ a: { num: number }; b: { num: number } }>({
        a: objStoreA,
        b: objStoreB,
      });

      objStoreAB.setState((curr) => ({ ...curr, a: { num: 1 } }));

      expect(objStoreA.getState()).toStrictEqual({ num: 1 });
      expect(objStoreB.getState()).toStrictEqual({ num: 0 });
      expect(objStoreAB.getState()).toStrictEqual({ a: { num: 1 }, b: { num: 0 } });
    });

    it('deep object', () => {
      const objStoreA = createStore({ obj: { num: 0 }, arr: [] });
      const objStoreB = createStore({ obj: { num: 0 }, arr: [] });

      const objStoreAB = UNSAFE_composeStore<{
        a: { obj: { num: number }; arr: number[] };
        b: { obj: { num: number }; arr: number[] };
      }>({
        a: objStoreA,
        b: objStoreB,
      });

      objStoreAB.setState((curr) => ({ ...curr, a: { ...curr.a, obj: { num: 1 } } }));

      expect(objStoreA.getState()).toStrictEqual({ obj: { num: 1 }, arr: [] });
      expect(objStoreB.getState()).toStrictEqual({ obj: { num: 0 }, arr: [] });
      expect(objStoreAB.getState()).toStrictEqual({
        a: { obj: { num: 1 }, arr: [] },
        b: { obj: { num: 0 }, arr: [] },
      });
    });
  });

  describe('change compose store when change original store', () => {
    it('number', () => {
      const numStoreA = createStore(0);
      const numStoreB = createStore(0);

      const numStoreAB = UNSAFE_composeStore<{ a: number; b: number }>({
        a: numStoreA,
        b: numStoreB,
      });

      numStoreA.setState(1);

      expect(numStoreA.getState()).toBe(1);
      expect(numStoreB.getState()).toBe(0);
      expect(numStoreAB.getState()).toStrictEqual({ a: 1, b: 0 });
    });

    it('object', () => {
      const objStoreA = createStore({ num: 0 });
      const objStoreB = createStore({ num: 0 });

      const objStoreAB = UNSAFE_composeStore<{ a: { num: number }; b: { num: number } }>({
        a: objStoreA,
        b: objStoreB,
      });

      objStoreA.setState({ num: 1 });

      expect(objStoreA.getState()).toStrictEqual({ num: 1 });
      expect(objStoreB.getState()).toStrictEqual({ num: 0 });
      expect(objStoreAB.getState()).toStrictEqual({ a: { num: 1 }, b: { num: 0 } });
    });

    it('deep object', () => {
      const objStoreA = createStore({ obj: { num: 0 }, arr: [] });
      const objStoreB = createStore({ obj: { num: 0 }, arr: [] });

      const objStoreAB = UNSAFE_composeStore<{
        a: { obj: { num: number }; arr: number[] };
        b: { obj: { num: number }; arr: number[] };
      }>({
        a: objStoreA,
        b: objStoreB,
      });

      objStoreA.setState((curr) => ({ ...curr, obj: { num: 1 } }));

      expect(objStoreA.getState()).toStrictEqual({ obj: { num: 1 }, arr: [] });
      expect(objStoreB.getState()).toStrictEqual({ obj: { num: 0 }, arr: [] });
      expect(objStoreAB.getState()).toStrictEqual({
        a: { obj: { num: 1 }, arr: [] },
        b: { obj: { num: 0 }, arr: [] },
      });
    });
  });
});
