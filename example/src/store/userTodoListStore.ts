import { UNSAFE_composeStore } from 'sagen';
import { User, userStore } from './userStore';
import { TodoItem, todoListStore } from './todoListStore';

export const userTodoListStore = UNSAFE_composeStore<{ user: User; todoList: TodoItem[] }>({
  user: userStore,
  todoList: todoListStore,
});
