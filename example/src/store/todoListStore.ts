import { createStore } from 'sagen';

export type TodoItem = {
  text: string;
  checked: boolean;
};

const todoListStore = createStore<TodoItem[]>([]);

export default todoListStore;
