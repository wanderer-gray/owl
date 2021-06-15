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
import GroupIcon from '@material-ui/icons/Group';

const useStyles = makeStyles(() => ({
  input: {
    marginBottom: '8px'
  },
}));

const ContactsView = observer(({ ContactsStore }) => {
  const {
    contacts,
    searchContacts,
    GroupStore: {
      addContact,
    },
  } = ContactsStore;

  return (
    <Autocomplete
      fullWidth={true}
      getOptionLabel={(option) => option.email}
      getOptionSelected={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={'Контакты'}
          variant={'outlined'}
        />
      )}
      options={contacts}
      onChange={(_, contact, reason) => {
        if (reason !== 'select-option') {
          return;
        }

        addContact(contact);
      }}
      onInputChange={(_, email, reason) => {
        if (reason !== 'input') {
          return;
        }
        
        searchContacts(email);
      }}
    />
  );
});

const GroupView = observer(({ GroupStore }) => {
  const classes = useStyles();

  const {
    id,
    title,
    contacts,
    setTitle,
    removeContact,
    open,
    onClose,
    onSave,
    ContactsStore,
  } = GroupStore;

  return (
    <Dialog
      scroll={'paper'}
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {id ? `Редактирование группы #${id}` : 'Создание группы'}
      </DialogTitle>

      <DialogContent dividers={true}>
        <TextField
          className={classes.input}
          label={'Название'}
          variant={'outlined'}
          fullWidth={true}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <ContactsView ContactsStore={ContactsStore} />

        <List>
          {contacts.map(({ id, email }) => (
            <ListItem key={id}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>

              <ListItemText primary={email} />

              <ListItemSecondaryAction>
                <IconButton
                  edge={'end'}
                  onClick={() => removeContact(id)}
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

const GroupsView = observer(({
  GroupsStore,
  GroupEditStore,
  GroupCreateStore,
}) => {
  const {
    groups,
    count,
    title,
    deleteGroup,
  } = GroupsStore;

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Группы

        <IconButton
          edge={'end'}
          onClick={GroupCreateStore.onOpen}
        >
          <AddIcon />
        </IconButton>
      </Typography>

      {count ? (
        <List>
          {groups.map((group) => {
            const { id, title } = group;

            return (
              <ListItem
                key={id}
                onClick={() => GroupEditStore.onOpen(group)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <GroupIcon />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText primary={title} />

                <ListItemSecondaryAction>
                  <IconButton
                    edge={'end'}
                    onClick={() => deleteGroup(id)}
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
          Ничего не найдено по запросу: {title}
        </p>
      )}

      <GroupView GroupStore={GroupEditStore} />
      <GroupView GroupStore={GroupCreateStore} />
    </Fragment>
  );
});

export default GroupsView;
