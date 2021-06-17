import React from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Tests  from './tests';
import Profile from './profile';
import Contacts from './contacts';
import Groups from './groups';
import Roles from './roles';
import Users from './users';
import System from './system';
import { objects } from '../../../enums';
import { checkPermissions } from '../../../utils';

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

const AppRouter = observer(({ AuthStore }) => {
  const classes = useStyles();

  const { permissions } = AuthStore;

  return (
    <main className={classes.pages}>
      <div className={classes.toolbar} />

      <Switch >
        <Route path="/" exact component={Tests} />
        <Route path="/test/view/:link" exact component={Tests} />
        <Route path="/test/edit/:testId" exact component={Tests} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/contacts" exact component={Contacts} />
        <Route path="/groups" exact component={Groups} />

        {checkPermissions(permissions, objects.ROLES) ? (
          <Route path="/roles" exact component={Roles} />
        ) : null}
        {checkPermissions(permissions, objects.USERS) ? (
          <Route path="/users" exact component={Users} />
        ) : null}
        {checkPermissions(permissions, objects.SYSTEM) ? (
          <Route path="/system" exact component={System} />
        ) : null}

        <Redirect to="/" exact/>
      </Switch>
    </main>
  );
});

export default inject(({ AuthStore }) => {
  return {
    AuthStore,
  };
})(AppRouter);
