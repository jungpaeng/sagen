import React from 'react';
import { useGlobalStore } from 'sagen';
import { TextField, Paper, Button, Grid } from '@material-ui/core';
import todoListStore, { TodoItem } from '../store/todoListStore';

function AddTodo() {
  const [_, setTodoList] = useGlobalStore(todoListStore);
  const [inputValue, setInputValue] = React.useState('');

  const onInputChange = (event: any) => setInputValue(event.target.value);
  const addTodoItem = () => {
    setTodoList((curr: TodoItem[]) => [...curr, { text: inputValue, checked: false }]);
    setInputValue('');
  };

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
