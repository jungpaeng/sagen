import {
  DispatchType,
  NextState,
  ReducerAction,
  ReducerReturnType,
  StoreGetState,
  StoreSetState,
} from '../store/createStore';

const createStateMiddleware = <State = any>(callback?: () => void) => (
  createState: State | ReducerReturnType<State>,
  setState: StoreSetState<State>,
  getState: StoreGetState<State>,
) => {
  if (typeof createState === 'function') {
    const { state, customSetState: dispatch } = (createState as ReducerReturnType<State>)(
      setState,
      getState,
    );
    const customSetState: DispatchType = (action: ReducerAction) => {
      dispatch(action);
      callback?.();
    };

    return { state, customSetState };
  }

  const customSetState: StoreSetState<State> = (nextState: NextState<State>) => {
    setState(nextState);
    callback?.();
  };

  return { state: createState, customSetState };
};

export default createStateMiddleware;
