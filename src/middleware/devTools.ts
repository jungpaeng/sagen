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

  const normalMiddleware = createStateMiddleware();

  return (setState: StoreSetState<State>, getState: StoreGetState<State>): CommonStore<State> => {
    if (!isReduxDevTools) {
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        console.warn('Redux devtools is not installed/enabled');
      }

      return normalMiddleware(createState, setState, getState);
    }

    const devToolsMiddleware = createStateMiddleware(() => {
      reduxDevTools.send(prefix, getState());
    });

    return devToolsMiddleware(createState, setState, getState);
  };
};

export default devTools;
