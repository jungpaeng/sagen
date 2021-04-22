import React from 'react';
import { useGlobalStore } from 'sagen';
import { AppBar, Button, Paper, Toolbar, Typography } from '@material-ui/core';
import { userStore } from '../store/userStore';

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  // @ts-ignore
  const [{ name, count }, setUser] = useGlobalStore(userStore);

  return (
    <Paper elevation={0} style={{ padding: 0, margin: 0, backgroundColor: '#fafafa' }}>
      <AppBar color="primary" position="static" style={{ height: 64 }}>
        <Toolbar style={{ height: 64 }}>
          <Typography color="inherit">{name}</Typography>
          <Typography color="inherit">({count})</Typography>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              // @ts-ignore
              setUser((curr) => ({ ...curr, count: curr.count + 1 }));
            }}>
            Add Count
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Paper>
  );
}

export default Layout;
