import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  inject,
  observer,
} from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Divider,
}from '@material-ui/core';
import TestIcon from '@material-ui/icons/Assignment';
import ProfileIcon from '@material-ui/icons/AccountBox';
import ContactsIcon from '@material-ui/icons/Contacts';
import GroupsIcon from '@material-ui/icons/Group';
import UsersIcon from '@material-ui/icons/People';
import SystemIcon from '@material-ui/icons/Settings';
import RolesIcon from '@material-ui/icons/Security';
import { objects } from '../../../enums';
import { checkPermissions } from '../../../utils';

const useStyles = makeStyles((theme) => ({
  aside: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

const Item = ({ Icon, to }) => (
  <ListItem button={true}>
    <Link to={to}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
    </Link>
  </ListItem>
);

const View = observer(({ AuthStore }) => {
  const classes = useStyles();

  const { permissions } = AuthStore;

  const hideItems = [];

  checkPermissions(permissions, objects.ROLES) && hideItems.push({
    key: objects.ROLES,
    to: '/roles',
    Icon: RolesIcon,
  });
  checkPermissions(permissions, objects.USERS) && hideItems.push({
    key: objects.USERS,
    to: '/users',
    Icon: UsersIcon,
  });
  checkPermissions(permissions, objects.SYSTEM) && hideItems.push({
    key: objects.SYSTEM,
    to: '/system',
    Icon: SystemIcon,
  });

  return (
    <Drawer
      variant={'permanent'}
      className={classes.aside}
      classes={{
        paper: classes.aside,
      }}
    >
      <div className={classes.toolbar} />

      <List>
        <Item Icon={TestIcon} to={'/'} />
        <Item Icon={ProfileIcon} to={'/profile'} />
        <Item Icon={ContactsIcon} to={'/contacts'} />
        <Item Icon={GroupsIcon} to={'/groups'} />
      </List>
      {hideItems.length ? (
        <Fragment>
          <Divider />
          <List>
            {hideItems.map(({ key, to, Icon }) => (
              <Item key={key} to={to} Icon={Icon} />
            ))}
          </List>
        </Fragment>
      ) : null}
    </Drawer>
  );
});

export default inject(({ AuthStore }) => {
  return {
    AuthStore,
  };
})(View);
