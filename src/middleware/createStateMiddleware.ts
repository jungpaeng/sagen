import {
  CommonStore,
  DispatchType,
  NextState,
  ReducerAction,
  ReducerReturnType,
  StoreGetState,
  StoreSetState,
} from '../store/createStore';

type CreateStateFunction<State = any> = (
  setState: StoreSetState<State>,
  getState: StoreGetState<State>,
) => CommonStore<State>;

export type CreateState<State = any> =
  | State
  | ReducerReturnType<State>
  | CreateStateFunction<State>;

const createStateMiddleware = <State = any>(
  createState: CreateState<State>,
  setState: StoreSetState<State>,
  getState: StoreGetState<State>,
) => (callback?: () => void) => {
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
