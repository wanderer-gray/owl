import React from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Tests  from './tests';
import CreateOrEditTest  from './test/createOrEdit';
import Profile from './profile';
import Contacts from './contacts';
import Groups from './groups';
import Roles from './roles';
import Users from './users';
import System from './system';
import { objects, actions } from '../../../enums/permissions';
import { getCheckPermissions } from '../../../utils';

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

const Routers = ({ routers }) => {
  if (!routers.length) {
    return null;
  }

  return (
    <Switch>
      {routers.map(({ path, component }) => (
        <Route
          key={path}
          exact={true}
          path={path}
          component={component}
        />
      ))}

      <Redirect to="/" exact/>
    </Switch>
  );
};

const AppRouter = observer(({ AuthStore }) => {
  const classes = useStyles();

  const checkPermissions = getCheckPermissions(AuthStore);

  const routers = [{
    path: '/',
    component: Tests,
  }];

  checkPermissions(objects.TESTS, actions.CREATE) && routers.push({
    path: '/test/createOrEdit',
    component: CreateOrEditTest,
  });

  AuthStore.isAuth && routers.push({
    path: '/profile',
    component: Profile,
  });

  checkPermissions(objects.CONTACTS) && routers.push({
    path: '/contacts',
    component: Contacts,
  });
  checkPermissions(objects.GROUPS) && routers.push({
    path: '/groups',
    component: Groups,
  });

  checkPermissions(objects.ROLES) && routers.push({
    path: '/roles',
    component: Roles,
  });
  checkPermissions(objects.USERS) && routers.push({
    path: '/users',
    component: Users,
  });
  checkPermissions(objects.SYSTEM) && routers.push({
    path: '/system',
    component: System,
  });

  return (
    <main className={classes.pages}>
      <div className={classes.toolbar} />

      <Routers routers={routers} />
    </main>
  );
});

export default inject(({ AuthStore }) => {
  return {
    AuthStore,
  };
})(AppRouter);
