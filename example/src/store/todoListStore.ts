import { Middleware, composeMiddleware, createStore } from 'sagen';

export type TodoItem = {
  text: string;
  checked: boolean;
};

const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.log('현재 상태', store.getState());
  console.log('액션', action);
  next(action);
  console.log('다음 상태', store.getState());
};

const todoListStore = createStore<TodoItem[]>([], composeMiddleware(loggerMiddleware));

export default todoListStore;
