import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  TextField,
  InputLabel,
  Select,
  MenuItem,
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
import { objects, actions } from '../../../../enums/permissions';

const useStyles = makeStyles(() => ({
  input: {
    marginBottom: '8px'
  },
}));

const PermissionsView = observer(({ PermissionsStore }) => {
  const {
    permissions,
    RoleStore: {
      permissionIds,
      setPermissionIds,
    },
  } = PermissionsStore;

  return (
    <Fragment>
      <InputLabel htmlFor={'select-permissions'}>
        Разрешения
      </InputLabel>
      <Select
        id={'select-permissions'}
        variant={'outlined'}
        multiple={true}
        fullWidth={true}
        value={permissionIds}
        onChange={(event) => setPermissionIds(event.target.value)}
      >
        {permissions.map(({ id, object, action }) => (
          <MenuItem
            key={id}
            value={id}
          >
            {`${objects.getTitle(object)} -> ${actions.getTitle(action)}`}
          </MenuItem>
        ))}
      </Select>
    </Fragment>
  );
});

const RoleView = observer(({ RoleStore }) => {
  const classes = useStyles();

  const {
    id,
    name,
    setName,
    open,
    onClose,
    onSave,
    PermissionsStore,
  } = RoleStore;

  return (
    <Dialog
      scroll={'paper'}
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {id ? `Редактирование роли #${id}` : 'Создание роли'}
      </DialogTitle>

      <DialogContent dividers={true}>
        <TextField
          className={classes.input}
          label={'Название'}
          variant={'outlined'}
          fullWidth={true}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <PermissionsView PermissionsStore={PermissionsStore} />
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

const RolesView = observer(({
  RolesStore,
  RoleEditStore,
  RoleCreateStore,
}) => {
  const {
    roles,
    count,
    name,
    deleteRole,
  } = RolesStore;

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Роли

        <IconButton
          edge={'end'}
          onClick={RoleCreateStore.onOpen}
        >
          <AddIcon />
        </IconButton>
      </Typography>

      {count ? (
        <List>
          {roles.map((role) => {
            const { id, name } = role;

            return (
              <ListItem
                key={id}
                onClick={() => RoleEditStore.onOpen(role)}
              >
                <ListItemText primary={name} />

                <ListItemSecondaryAction>
                  <IconButton
                    edge={'end'}
                    onClick={() => deleteRole(id)}
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
          Ничего не найдено по запросу: {name}
        </p>
      )}

      <RoleView RoleStore={RoleEditStore} />
      <RoleView RoleStore={RoleCreateStore} />
    </Fragment>
  );
});

export default RolesView;
