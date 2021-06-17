import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  title: {
    marginTop: '16px',
  },
  input: {
    marginBottom: '8px'
  },
}));

const AccountView = observer(({ AccountStore }) => {
  const classes = useStyles();

  const {
    id,
    host,
    port,
    secure,
    user,
    pass,
    setHost,
    setPort,
    setSecure,
    setUser,
    setPass,
    open,
    onClose,
    onSave,
  } = AccountStore;

  return (
    <Dialog
      scroll={'paper'}
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {id ? `Редактирование аккаунта #${id}` : 'Создание аккаунта'}
      </DialogTitle>

      <DialogContent dividers={true}>
        <TextField
          className={classes.input}
          label={'Host'}
          variant={'outlined'}
          fullWidth={true}
          value={host}
          onChange={(event) => setHost(event.target.value)}
        />

        <TextField
          className={classes.input}
          label={'Port'}
          variant={'outlined'}
          fullWidth={true}
          value={port}
          onChange={(event) => setPort(event.target.value)}
        />

        <FormControlLabel
          className={classes.input}
          value={'start'}
          label={'Secure'}
          labelPlacement={'start'}
          control={(
            <Switch
              color={'primary'}
              checked={secure}
              onChange={() => {
                setSecure(!secure);
              }}
            />
          )}
        />

        <TextField
          className={classes.input}
          label={'User'}
          variant={'outlined'}
          fullWidth={true}
          value={user}
          onChange={(event) => setUser(event.target.value)}
        />

        <TextField
          className={classes.input}
          label={'Pass'}
          variant={'outlined'}
          fullWidth={true}
          value={pass}
          onChange={(event) => setPass(event.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          color={'primary'}
          onClick={onClose}
        >
          Отмена
        </Button>
        <Button
          color={'primary'}
          onClick={onSave}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const AccountsView = observer(({
  AccountsStore,
  AccountEditStore,
  AccountCreateStore,
}) => {
  const classes = useStyles();

  const {
    accounts,
    deleteAccount,
  } = AccountsStore;

  return (
    <Fragment>
      <Typography
        className={classes.title}
        variant={'h5'}
      >
        Email аккаунты

        <IconButton
          edge={'end'}
          onClick={AccountCreateStore.onOpen}
        >
          <AddIcon />
        </IconButton>
      </Typography>

      <List>
        {accounts.map((account) => {
          const { id, host, user } = account;

          return (
            <ListItem
              key={id}
              onClick={() => AccountEditStore.onOpen(account)}
            >
              <ListItemText primary={host} />

              <ListItemText primary={user} />

              <ListItemSecondaryAction>
                <IconButton
                  edge={'end'}
                  onClick={() => deleteAccount(id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>

      <AccountView AccountStore={AccountEditStore} />
      <AccountView AccountStore={AccountCreateStore} />
    </Fragment>
  );
});

export default AccountsView;
