import {
  inject,
  observer,
} from 'mobx-react';
import { Link as ReactLink } from 'react-router-dom';
import {
  Typography,
  Link,
} from '@material-ui/core';
import LogIn from './login';
import Restore from './restore';
import SignUp from './signup';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    width: '350px'
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  body: {
    marginTop: '16px'
  },
  foot: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  link: {
    color: '#000',
    textDecoration: 'none',
    textTransform: 'uppercase',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
}));

const AuthViewBody = observer(({ AuthStore }) => {
  const { type } = AuthStore;

  switch(type) {
    case 'login':
      return <LogIn AuthStore={AuthStore} />;
    
    case 'restore':
      return <Restore AuthStore={AuthStore} />;
    
    case 'signup':
      return <SignUp AuthStore={AuthStore} />;

    default:
      return null;
  }
});

const AuthViewFoot = observer(({ AuthStore }) => {
  const {
    type,
    setType
  } = AuthStore;

  switch(type) {
    case 'login':
      return (
        <>
          <Link onClick={() => setType('signup')}>
            Регистрация
          </Link>
          
          <Link
            color={'inherit'}
            onClick={() => setType('restore')}
          >
            Забыли пароль?
          </Link>
        </>
      );
    
    case 'restore':
      return (
        <>
          <Link onClick={() => setType('login')}>
            Войти в систему
          </Link>

          <Link
            color={'inherit'}
            onClick={() => setType('signup')}
          >
            Регистрация
          </Link>
        </>
      );
    
    case 'signup':
      return (
        <>
          <Link onClick={() => setType('login')}>
            Войти в систему
          </Link>

          <Link
            color={'inherit'}
            onClick={() => setType('restore')}
          >
            Забыли пароль?
          </Link>
        </>
      );

    default:
      return null;
  }
});

const AuthView = observer(({ AuthStore, children }) => {
  const classes = useStyles();

  const {
    open,
    close
  } = AuthStore;

  if (!open) {
    return children;
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}> 
        <div className={classes.head}>
          <Typography variant={'h6'}>
            Сова
          </Typography>

          <ReactLink
            className={classes.link}
            to={'/'}
            onClick={close}
          >
            Закрыть
          </ReactLink>
        </div>

        <div className={classes.body}>
          {<AuthViewBody AuthStore={AuthStore} />}
        </div>

        <div className={classes.foot}>
          {<AuthViewFoot AuthStore={AuthStore} />}
        </div>
      </div>
    </div>
  )
});

export default inject(
  ({ AuthStore }) => { 
    return {
      AuthStore
    };
  }
)(AuthView);
