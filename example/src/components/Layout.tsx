import React from 'react';
import { AppBar, Paper, Toolbar, Typography } from '@material-ui/core';

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <Paper elevation={0} style={{ padding: 0, margin: 0, backgroundColor: '#fafafa' }}>
      <AppBar color="primary" position="static" style={{ height: 64 }}>
        <Toolbar style={{ height: 64 }}>
          <Typography color="inherit">TODO APP</Typography>
        </Toolbar>
      </AppBar>
      {children}
    </Paper>
  );
}

export default Layout;
