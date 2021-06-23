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
import AddIcon from '@material-ui/icons/Add';
import ProfileIcon from '@material-ui/icons/AccountBox';
import ContactsIcon from '@material-ui/icons/Contacts';
import GroupsIcon from '@material-ui/icons/Group';
import UsersIcon from '@material-ui/icons/People';
import SystemIcon from '@material-ui/icons/Settings';
import RolesIcon from '@material-ui/icons/Security';
import { objects, actions } from '../../../enums/permissions';
import { getCheckPermissions } from '../../../utils';

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

const Items = ({ items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <List>
      {items.map(({ key, to, Icon }) => (
        <Item key={key} to={to} Icon={Icon} />
      ))}
    </List>
  );
};

const Aside = observer(({ AuthStore }) => {
  const classes = useStyles();

  const checkPermissions = getCheckPermissions(AuthStore);

  const items = [{
    key: objects.TESTS,
    to: '/',
    Icon: TestIcon,
  }];

  checkPermissions(objects.TESTS, actions.CREATE) && items.push({
    key: `${objects.TESTS}:${actions.CREATE}`,
    to: '/test/createOrEdit',
    Icon: AddIcon,
  });
  
  AuthStore.isAuth && items.push({
    key: 'profile',
    to: '/profile',
    Icon: ProfileIcon,
  });

  checkPermissions(objects.CONTACTS) && items.push({
    key: objects.CONTACTS,
    to: '/contacts',
    Icon: ContactsIcon,
  });
  checkPermissions(objects.GROUPS) && items.push({
    key: objects.GROUPS,
    to: '/groups',
    Icon: GroupsIcon,
  });

  const hideItems = [];

  checkPermissions(objects.ROLES) && hideItems.push({
    key: objects.ROLES,
    to: '/roles',
    Icon: RolesIcon,
  });
  checkPermissions(objects.USERS) && hideItems.push({
    key: objects.USERS,
    to: '/users',
    Icon: UsersIcon,
  });
  checkPermissions(objects.SYSTEM) && hideItems.push({
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

      <Items items={items} />

      {items.length && hideItems.length ? (
        <Divider />
      ) : null}

      <Items items={hideItems} />
    </Drawer>
  );
});

export default inject(({ AuthStore }) => {
  return {
    AuthStore,
  };
})(Aside);
