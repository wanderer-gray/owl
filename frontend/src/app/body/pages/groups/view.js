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
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import GroupIcon from '@material-ui/icons/Group';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  input: {
    marginBottom: '8px'
  },
}));

const GroupView = observer(({
  open,
  group,
  setGroupTitle,
  addGroupContact,
  delGroupContact,
  contacts,
  searchContacts,
  onOpenContacts,
  onClose,
  onSave,
}) => {
  const classes = useStyles();

  const {
    id,
    title,
    contacts: groupContacts,
  } = group;

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {id ? `Редактирование группы #${id}` : 'Создание группы'}
      </DialogTitle>

      <DialogContent>
        <TextField
          className={classes.input}
          label={'Название'}
          variant={'outlined'}
          fullWidth={true}
          value={title}
          onChange={(event) => setGroupTitle(event.target.value)}
        />

        <Autocomplete
          fullWidth={true}
          getOptionLabel={(option) => option.email}
          getOptionSelected={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} variant={'outlined'} />}
          options={contacts}
          onChange={(_, contact, reason) => {
            if (reason !== 'select-option') {
              return;
            }

            addGroupContact(contact);
          }}
          onInputChange={(_, email, reason) => {
            if (reason !== 'input') {
              return;
            }
            
            searchContacts(email);
          }}
          onOpen={onOpenContacts}
        />
        
        <List>
          {groupContacts.map(({ id, email }) => (
            <ListItem key={id}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>

              <ListItemText primary={email} />

              <ListItemSecondaryAction>
                <IconButton
                  edge={'end'}
                  onClick={() => delGroupContact(id)}
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

const GroupsView = observer(({ store }) => {
  const {
    groups,
    count,
    title,
    open,
    group,
    setGroupTitle,
    addGroupContact,
    delGroupContact,
    contacts,
    searchContacts,
    onOpenContacts,
    onOpen,
    onClose,
    onSave,
    deleteGroup,
  } = store;

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Группы

        <IconButton
          edge={'end'}
          onClick={() => onOpen()}
        >
          <GroupAddIcon />
        </IconButton>
      </Typography>

      {count ? (
        <List>
          {groups.map(({ id, title }) => (
            <ListItem
              key={id}
              onClick={() => onOpen(id)}
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
          ))}
        </List>
      ) : (
        <p>
          Ничего не найдено по запросу: {title}
        </p>
      )}

      <GroupView
        open={open}
        group={group}
        setGroupTitle={setGroupTitle}
        addGroupContact={addGroupContact}
        delGroupContact={delGroupContact}
        contacts={contacts}
        searchContacts={searchContacts}
        onOpenContacts={onOpenContacts}
        onOpen={onOpen}
        onClose={onClose}
        onSave={onSave}
      />
    </Fragment>
  );
});

export default GroupsView;
