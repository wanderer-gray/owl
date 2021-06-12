import React from 'react';
import { CssBaseline } from '@material-ui/core';
import Header from './header';
import Body from './body';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Header />

      <Body />
    </div>
  );
};

export default App;
