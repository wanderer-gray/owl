import { Fragment } from 'react';
import {
  inject,
  observer,
} from 'mobx-react';
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
import { objects, actions } from '../../../../../enums/permissions';
import { getCheckPermissions } from '../../../../../utils';

const useStyles = makeStyles(() => ({
  title: {
    marginTop: '16px',
  },
  input: {
    marginBottom: '8px'
  },
}));

const AccountView = observer(({ AccountStore, checkPermissions }) => {
  const classes = useStyles();

  const { SYSTEM } = objects;

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
          onChange={(event) => checkPermissions(SYSTEM, actions.UPDATE) && setHost(event.target.value)}
        />

        <TextField
          className={classes.input}
          label={'Port'}
          variant={'outlined'}
          fullWidth={true}
          value={port}
          onChange={(event) => checkPermissions(SYSTEM, actions.UPDATE) && setPort(event.target.value)}
        />

        <FormControlLabel
          className={classes.input}
          label={'Secure'}
          labelPlacement={'start'}
          control={(
            <Switch
              color={'primary'}
              checked={secure}
              onChange={() => checkPermissions(SYSTEM, actions.UPDATE) && setSecure(!secure)}
            />
          )}
        />

        <TextField
          className={classes.input}
          label={'User'}
          variant={'outlined'}
          fullWidth={true}
          value={user}
          onChange={(event) => checkPermissions(SYSTEM, actions.UPDATE) && setUser(event.target.value)}
        />

        <TextField
          className={classes.input}
          label={'Pass'}
          variant={'outlined'}
          fullWidth={true}
          value={pass}
          onChange={(event) => checkPermissions(SYSTEM, actions.UPDATE) && setPass(event.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          color={'primary'}
          onClick={onClose}
        >
          Отмена
        </Button>
        {checkPermissions(SYSTEM, actions.UPDATE) ? (
          <Button
            color={'primary'}
            onClick={onSave}
          >
            Сохранить
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
});

const AccountsView = observer(({
  AuthStore,
  AccountsStore,
  AccountEditStore,
  AccountCreateStore,
}) => {
  const classes = useStyles();

  const checkPermissions = getCheckPermissions(AuthStore);
  const { SYSTEM } = objects;

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

        {checkPermissions(SYSTEM, actions.CREATE) ? (
          <IconButton
            edge={'end'}
            onClick={AccountCreateStore.onOpen}
          >
            <AddIcon />
          </IconButton>
        ) : null}
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
                {checkPermissions(SYSTEM, actions.DELETE) ? (
                  <IconButton
                    edge={'end'}
                    onClick={() => deleteAccount(id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>

      <AccountView
        AccountStore={AccountEditStore}
        checkPermissions={checkPermissions}
      />
      <AccountView
        AccountStore={AccountCreateStore}
        checkPermissions={checkPermissions}
      />
    </Fragment>
  );
});

export default inject(({ AuthStore }) => {
  return {
    AuthStore,
  };
})(AccountsView);
