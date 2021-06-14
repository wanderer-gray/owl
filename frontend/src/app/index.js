import React from 'react';
import { inject } from 'mobx-react';
import { CssBaseline, makeStyles } from '@material-ui/core';
import Header from './header';
import Body from './body';

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

export default inject(
  ({ AuthStore }) => {
    return {
      AuthStore
    };
  }
)(App);
