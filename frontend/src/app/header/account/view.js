import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    display: 'flex',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

const AccountView = observer(({ store }) => {
  const classes = useStyles();

  const {
    anchorEl,
    isAuth,
    onOpen,
    onClose,
    onLogIn,
    onLogOut
  } = store;

  return (
    <Fragment>
      <div className={classes.grow} />
      <div className={classes.root}>
        <IconButton
          edge={'end'}
          color={'inherit'}
          aria-label={'Аккаунт текущего пользователя'}
          aria-haspopup={true}
          onClick={onOpen}
        >
          <AccountCircle />
        </IconButton>

        <Menu
          keepMounted={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={onClose}
        >
          {isAuth ? (
            <MenuItem>
              <Link
                to={'/profile'}
                className={classes.link}
              >
                Профиль
              </Link>
            </MenuItem>
          ) : null}
          {!isAuth ? (
            <MenuItem onClick={onLogIn}>Войти в систему</MenuItem>
          ) : (
            <MenuItem onClick={onLogOut}>Выйти из системы</MenuItem>
          )}
        </Menu>
      </div>
    </Fragment>
  );
});

export default AccountView;
