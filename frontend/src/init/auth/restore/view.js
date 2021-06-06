import { observer } from 'mobx-react';
import {
  TextField,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: '8px'
  },
  button: {
    marginTop: '8px'
  }
}));

const RestoreView = observer(({ RestoreStore }) => {
  const classes = useStyles();
  
  const {
    step,
    email,
    code,
    password,
    setEmail,
    setCode,
    setPassword,
    sendRestoreCode,
    Restore
  } = RestoreStore;

  return (
    <>
      <TextField
        className={classes.input}
        disabled={step !== 1}
        type={'email'}
        variant={'outlined'}
        fullWidth={true}
        label={'Email'}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      { step === 1 ? (
        <Button
          className={classes.button}
          variant={'outlined'}
          fullWidth={true}
          onClick={sendRestoreCode}
        >
          Получить код
        </Button>
      ) : null}

      { step === 2 ? (
        <>
          <TextField
            className={classes.input}
            variant={'outlined'}
            fullWidth={true}
            label={'Code'}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <TextField
            className={classes.input}
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
            onClick={Restore}
          >
            Сохранить
          </Button>
        </>
      ) : null}
    </>
  );
});

export default RestoreView;
