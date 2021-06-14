import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MainPage  from './main/Main';
import TestViewPage from './testView/TestView';
import TestEditPage from './testEdit/TestEdit';
import UserPage from './users/Users';
import GroupsPage from './groups/Groups';
import AdminPage from './admin/Admin';

const useStyles = makeStyles((theme) => ({
  pages: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

const AppRouter = () => {
  const classes = useStyles();

  return (
    <main className={classes.pages}>
      <div className={classes.toolbar} />

      <Router>
        <Switch >
          <Route path="/" exact component={MainPage} />
          <Route path="/test/view" exact component={TestViewPage} />
          <Route path="/test/edit" exact component={TestEditPage} />
          <Route path="/users" exact component={UserPage} />
          <Route path="/groups" exact component={GroupsPage} />
          <Route path="/admin" exact component={AdminPage} />

          <Redirect to="/" exact/>
        </Switch>
      </Router>
    </main>
  );
};

export default AppRouter;
