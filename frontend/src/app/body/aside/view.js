import React from 'react';
import { Link } from 'react-router-dom';
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

const View = ({ store }) => {
  const classes = useStyles();

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
      <Divider />
      <List>
        <Item Icon={UsersIcon} to={'/'} />
        <Item Icon={SystemIcon} to={'/'} />
        <Item Icon={RolesIcon} to={'/'} />
      </List>
    </Drawer>
  );
};

export default View;
