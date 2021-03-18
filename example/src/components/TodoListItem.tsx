import React from 'react';
import {
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { useGlobalStore } from 'sagen';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import todoListStore, { TodoItem } from '../store/todoListStore';

export type TodoListItemProps = {
  idx: number;
  divider: boolean;
  text: string;
  checked: boolean;
};

function TodoListItem(props: TodoListItemProps) {
  const [_, setTodoList] = useGlobalStore(todoListStore);

  const onCheckBoxToggle = () => {
    setTodoList((curr: TodoItem[]) =>
      curr.map((todo, todoIdx) => {
        if (todoIdx !== props.idx) return todo;
        return {
          text: todo.text,
          checked: !todo.checked,
        };
      }),
    );
  };

  const onButtonClick = () => {
    setTodoList((curr: TodoItem[]) =>
      curr.filter((todo, todoIdx) => {
        return todoIdx !== props.idx;
      }),
    );
  };

  return (
    <ListItem divider={props.divider}>
      <Checkbox onClick={onCheckBoxToggle} checked={props.checked} disableRipple />
      <ListItemText primary={props.text} />
      <ListItemSecondaryAction>
        <IconButton aria-label="Delete Todo" onClick={onButtonClick}>
          <DeleteOutlined />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
export default TodoListItem;
