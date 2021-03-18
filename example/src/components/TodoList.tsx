import React from 'react';
import { List, Paper } from '@material-ui/core';
import TodoListItem from './TodoListItem';
import { useGlobalStore } from 'sagen';
import todoListStore from '../store/todoListStore';

function TodoList() {
  const [todoList] = useGlobalStore(todoListStore);

  return (
    <Paper style={{ margin: 16 }}>
      {todoList.length > 0 && (
        <List style={{ overflow: 'scroll' }}>
          {todoList.map((todo, idx) => (
            <TodoListItem
              {...todo}
              idx={idx}
              key={`TodoItem.${idx}`}
              divider={idx !== todoList.length - 1}
            />
          ))}
        </List>
      )}
    </Paper>
  );
}

export default TodoList;
