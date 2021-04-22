import React from 'react';
import { useSagenState, shallowEqual } from 'sagen';
import { List, Paper } from '@material-ui/core';
import TodoListItem from './TodoListItem';
import { userTodoListStore } from '../store/userTodoListStore';
import { TodoItem } from '../store/todoListStore';
import { User } from '../store/userStore';

type TodoListWithName = {
  name: string;
  todoList: TodoItem[];
};

function TodoList() {
  const { name, todoList } = useSagenState<{ user: User; todoList: TodoItem[] }, TodoListWithName>(
    userTodoListStore,
    (store) => ({
      name: store.user.name,
      todoList: store.todoList,
    }),
    shallowEqual,
  );

  return (
    <Paper style={{ margin: 16 }}>
      {!!todoList.length && (
        <List style={{ overflow: 'scroll' }}>
          {todoList.map((todo, idx) => (
            <TodoListItem
              {...todo}
              idx={idx}
              key={`TodoItem.${idx}`}
              text={`[${name}] ${todo.text}`}
              divider={idx !== todoList.length - 1}
            />
          ))}
        </List>
      )}
    </Paper>
  );
}

export default TodoList;
