import redux from '../../src/middleware/redux';
import { ReducerReturnType, DispatchType } from '../../src';

const testReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

describe('redux', () => {
  let reduxFunction: ReducerReturnType<any>;

  beforeAll(() => {
    reduxFunction = redux(testReducer, 10);
  });

  it('should return function', () => {
    expect(typeof reduxFunction).toBe('function');
  });

  describe('run reduxFunction', () => {
    let store: any;
    let state: any;
    let customSetState: DispatchType;

    beforeAll(() => {
      const reduxValue = reduxFunction(
        (state) => {
          store =
            typeof state === 'function' ? (state as Function)(store) : state;
        },
        () => store,
      );

      state = reduxValue.state;
      customSetState = reduxValue.customSetState;
    });

    it('should return state if run reduxFunction', () => {
      expect(store).toBe(10);
    });

    it('should return changed state if run customSetState', () => {
      customSetState({ type: 'INCREMENT' });
      expect(store).toBe(11);
    });
  });
});
