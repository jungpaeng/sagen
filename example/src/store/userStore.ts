import { createStore, Middleware, composeMiddleware } from 'sagen';

export type User = {
  name: string;
  count: number;
};

const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.log('[user] 현재 상태', store.getState());
  console.log('[user] 액션', action);
  next(action);
  console.log('[user] 다음 상태', store.getState());
};

export const userStore = createStore<User>(
  { name: 'sagen example', count: 0 },
  composeMiddleware(loggerMiddleware),
);
