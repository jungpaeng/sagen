import React from 'react';
import Layout from './components/Layout';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

function App() {
  return (
    <Layout>
      <AddTodo />
      <TodoList />
    </Layout>
  );
}

export default App;
