import createStore from '../../src/store/createStore';
import redux from '../../src/middleware/redux';

const onChangeMiddleware = jest.fn(function () {});

describe('createStore', () => {
  const DEFAULT_VALUE = 100;

  it('should return object if run createStore', () => {
    expect(typeof createStore(DEFAULT_VALUE)).toBe('object');
  });

  it('should return default value if get state', () => {
    const { getState } = createStore(DEFAULT_VALUE);
    expect(getState()).toBe(DEFAULT_VALUE);
  });

  it('should return changed value if run setState', () => {
    const { getState, setState } = createStore(DEFAULT_VALUE);
    expect(getState()).toBe(DEFAULT_VALUE);

    setState(DEFAULT_VALUE + 1);
    expect(getState()).toBe(DEFAULT_VALUE + 1);
  });

  it('should get prev state if run setState', () => {
    const { getState, setState } = createStore(DEFAULT_VALUE);
    expect(getState()).toBe(DEFAULT_VALUE);

    setState((prevState) => prevState + 1);
    expect(getState()).toBe(DEFAULT_VALUE + 1);
  });

  it('should set onChange middleware state', () => {
    let setStateCount = 0;
    const { setState, onChange } = createStore(DEFAULT_VALUE);

    onChange(() => {
      setStateCount += 1;
    });
    setState((prevState) => prevState + 1);

    expect(setStateCount).toBe(1);
  });

  it('should remove onChange middleware', () => {
    const { setState, onChange } = createStore(DEFAULT_VALUE);

    const removeOnChange = onChange(onChangeMiddleware);
    setState((prevState) => prevState + 1);
    expect(onChangeMiddleware).toBeCalledTimes(1);

    removeOnChange();
    setState((prevState) => prevState + 1);
    expect(onChangeMiddleware).toBeCalledTimes(1);
  });

  it('should use createStore with state middleware', () => {
    const testReducer = (state: any, action: any) => {
      switch (action.type) {
        case 'INCREMENT':
          return state + 1;
      }
    };

    const { getState, customSetState } = createStore(
      redux(testReducer, DEFAULT_VALUE),
    );

    expect(getState()).toBe(DEFAULT_VALUE);
    customSetState!({ type: 'INCREMENT' });
    expect(getState()).toBe(DEFAULT_VALUE + 1);
  });
});
