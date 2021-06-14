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
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(12),
  },
}));

const AppRouter = () =>  {
  const classes = useStyles();

  return (
    
    <div className={classes.root}>
      <main className={classes.content}>
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
    </div>
  );
}

export default AppRouter;
