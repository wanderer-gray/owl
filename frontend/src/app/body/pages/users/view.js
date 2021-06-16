import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  input: {
    marginBottom: '8px'
  },
}));

const RolesView = observer(({ RolesStore }) => {
  const {
    roles,
    searchRoles,
    UserStore: {
      addRole,
    },
  } = RolesStore;

  return (
    <Autocomplete
      fullWidth={true}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={'Роли'}
          variant={'outlined'}
        />
      )}
      options={roles}
      onChange={(_, role, reason) => {
        if (reason !== 'select-option') {
          return;
        }

        addRole(role);
      }}
      onInputChange={(_, name, reason) => {
        if (reason !== 'input') {
          return;
        }
        
        searchRoles(name);
      }}
    />
  );
});

const UserView = observer(({ UserStore }) => {
  const classes = useStyles();

  const {
    id,
    email,
    password,
    roles,
    setEmail,
    setPassword,
    removeRole,
    open,
    onClose,
    onSave,
    RolesStore,
  } = UserStore;

  return (
    <Dialog
      scroll={'paper'}
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {id ? `Редактирование пользователя #${id}` : 'Создание пользователя'}
      </DialogTitle>

      <DialogContent dividers={true}>
        <TextField
          className={classes.input}
          label={'Email'}
          variant={'outlined'}
          fullWidth={true}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {password !== undefined ? (
          <TextField
            className={classes.input}
            label={'Password'}
            variant={'outlined'}
            fullWidth={true}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        ) : null}

        <RolesView RolesStore={RolesStore} />

        <List>
          {roles.map(({ id, name }) => (
            <ListItem key={id}>
              <ListItemText primary={name} />

              <ListItemSecondaryAction>
                <IconButton
                  edge={'end'}
                  onClick={() => removeRole(id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
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

const UsersView = observer(({
  UsersStore,
  UserEditStore,
  UserCreateStore,
}) => {
  const {
    users,
    count,
    email,
    deleteUser,
  } = UsersStore;

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Пользователи

        <IconButton
          edge={'end'}
          onClick={UserCreateStore.onOpen}
        >
          <AddIcon />
        </IconButton>
      </Typography>

      {count ? (
        <List>
          {users.map((user) => {
            const { id, email } = user;

            return (
              <ListItem
                key={id}
                onClick={() => UserEditStore.onOpen(user)}
              >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>

                <ListItemText primary={email} />

                <ListItemSecondaryAction>
                  <IconButton
                    edge={'end'}
                    onClick={() => deleteUser(id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <p>
          Ничего не найдено по запросу: {email}
        </p>
      )}

      <UserView UserStore={UserEditStore} />
      <UserView UserStore={UserCreateStore} />
    </Fragment>
  );
});

export default UsersView;
