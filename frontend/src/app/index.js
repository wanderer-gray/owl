import React from 'react';
import { inject } from 'mobx-react';
import { BrowserRouter as Router } from 'react-router-dom';
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
    <Router>
      <div className={classes.root}>
        <CssBaseline />

        <Header />

        <Body />
      </div>
    </Router>
  );
};

export default inject(
  ({ AuthStore }) => {
    return {
      AuthStore
    };
  }
)(App);
