import React from 'react';
import { useSetSagenState } from 'sagen';
import { TextField, Paper, Button, Grid } from '@material-ui/core';
import { userTodoListStore } from '../store/userTodoListStore';

function AddTodo() {
  const setUserTodoList = useSetSagenState(userTodoListStore);
  const [inputValue, setInputValue] = React.useState('');

  const onInputChange = React.useCallback((event: any) => setInputValue(event.target.value), []);
  const addTodoItem = React.useCallback(() => {
    setUserTodoList((curr) => ({
      ...curr,
      user: { ...curr.user, name: inputValue },
      todoList: [...curr.todoList, { text: inputValue, checked: false }],
    }));
    setInputValue('');
  }, [inputValue, setUserTodoList]);

  return (
    <Paper style={{ margin: 16, padding: 16 }}>
      <Grid container>
        <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
          <TextField
            placeholder="Add Todo here"
            value={inputValue}
            onChange={onInputChange}
            fullWidth
          />
        </Grid>
        <Grid xs={2} md={1} item>
          <Button fullWidth color="secondary" variant="outlined" onClick={addTodoItem}>
            Add
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AddTodo;
