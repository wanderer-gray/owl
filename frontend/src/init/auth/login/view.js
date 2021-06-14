import { observer } from 'mobx-react';
import {
  TextField,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  input: {
    marginBottom: '8px'
  },
  button: {
    marginTop: '8px'
  }
}));

const LogInView = observer(({ LogInStore }) => {
  const classes = useStyles();
  
  const {
    email,
    password,
    setEmail,
    setPassword,
    LogIn
  } = LogInStore;

  return (
    <>
      <TextField
        className={classes.input}
        type={'email'}
        variant={'outlined'}
        fullWidth={true}
        label={'Email'}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        className={classes.input}
        type={'password'}
        variant={'outlined'}
        fullWidth={true}
        label={'Password'}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <Button
        className={classes.button}
        variant={'outlined'}
        fullWidth={true}
        onClick={LogIn}
      >
        Войти
      </Button>
    </>
  );
});

export default LogInView;
