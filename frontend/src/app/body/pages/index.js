import React from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Main  from './main/Main';
import Profile from './profile';
import Contacts from './contacts';
import TestViewPage from './testView/TestView';
import TestEditPage from './testEdit/TestEdit';
import UserPage from './users/Users';
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

      <Switch >
        <Route path="/" exact component={Main} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/groups" exact component={null} />
        <Route path="/contacts" exact component={Contacts} />
        <Route path="/test/view" exact component={TestViewPage} />
        <Route path="/test/edit" exact component={TestEditPage} />
        <Route path="/users" exact component={UserPage} />
        <Route path="/admin" exact component={AdminPage} />

        <Redirect to="/" exact/>
      </Switch>
    </main>
  );
};

export default AppRouter;
