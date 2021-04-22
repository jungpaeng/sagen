import { Middleware, composeMiddleware, createStore } from 'sagen';

export type TodoItem = {
  text: string;
  checked: boolean;
};

const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.log('[todoList] 현재 상태', store.getState());
  console.log('[todoList] 액션', action);
  next(action);
  console.log('[todoList] 다음 상태', store.getState());
};

export const todoListStore = createStore<TodoItem[]>([], composeMiddleware(loggerMiddleware));
