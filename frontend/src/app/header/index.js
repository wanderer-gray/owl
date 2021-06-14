import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Search from './search';
import Account from './account';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  logoLink: {
    textDecoration: 'none',
    color: theme.palette.common.white,
  }
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar
      position={'fixed'}
      className={classes.appBar}>
      <Toolbar>
        <Typography
          variant={'h6'}
          noWrap={true}
        >
          <a
            className={classes.logoLink}
            href={'/'}
          >
            Сова
          </a>
        </Typography>

        <Search />

        <Account />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
