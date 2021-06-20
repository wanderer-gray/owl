import { Link } from 'react-router-dom'; 
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
}from '@material-ui/core';
import Search from './search';
import Account from './account';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  logo: {
    marginRight: '12px',
  },
  logoLink: {
    textDecoration: 'none',
    color: theme.palette.common.white,
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Typography
          className={classes.logo}
          variant={'h6'}
        >
          <Link
            className={classes.logoLink}
            to={'/'}
          >
            Сова
          </Link>
        </Typography>

        <Search />

        <Account />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
