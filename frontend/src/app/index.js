import React from 'react';
import {
  inject,
  Provider
} from 'mobx-react';
import { CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
