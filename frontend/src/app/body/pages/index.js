import React from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Main  from './main/Main';
import TestViewPage from './testView/TestView';
import TestEditPage from './testEdit/TestEdit';
import Profile from './profile';
import Contacts from './contacts';
import Groups from './groups';
import System from './system';
import Roles from './roles';
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
        <Route path="/" exact component={Main} />
        <Route path="/test/view" exact component={TestViewPage} />
        <Route path="/test/edit" exact component={TestEditPage} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/contacts" exact component={Contacts} />
        <Route path="/groups" exact component={Groups} />

        {checkPermissions(permissions, objects.SYSTEM) ? (
          <Route path="/system" exact component={System} />
        ) : null}
        {checkPermissions(permissions, objects.ROLES) ? (
          <Route path="/roles" exact component={Roles} />
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
