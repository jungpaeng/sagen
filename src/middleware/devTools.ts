import { CommonStore, StoreGetState, StoreSetState } from '../store/createStore';
import createStateMiddleware, { CreateState } from './createStateMiddleware';

const devTools = <State = any>(createState: CreateState<State>, prefix?: string) => {
  let reduxDevTools: any;
  let isReduxDevTools: any;

  try {
    isReduxDevTools =
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ ||
      (window as any).top.__REDUX_DEVTOOLS_EXTENSION__;

    reduxDevTools = isReduxDevTools.connect({ name: prefix });
    reduxDevTools.prefix = prefix ? `${prefix} > ` : '';
    reduxDevTools.init();
  } catch {}

  return (setState: StoreSetState<State>, getState: StoreGetState<State>): CommonStore<State> => {
    const stateMiddleware = createStateMiddleware(createState, setState, getState);

    if (!isReduxDevTools) {
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        console.warn('Redux devtools is not installed/enabled');
      }

      return stateMiddleware();
    }

    return stateMiddleware(() => {
      reduxDevTools.send(prefix, getState());
    });
  };
};

export default devTools;
