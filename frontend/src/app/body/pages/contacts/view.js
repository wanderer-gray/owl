import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    padding: '16px',
    marginTop: '16px',
  },
  input: {
    width: '350px',
    marginRight: '8px'
  },
}));

const ContactsView = observer(({ store }) => {
  const classes = useStyles();

  const {
    contacts,
    count,
    email,
    link,
    setLink,
    createContact,
    deleteContact,
  } = store;

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Контакты
      </Typography>

      <Paper
        className={classes.paper}
        variant={'outlined'}
      >
        <TextField
          className={classes.input}
          size={'small'}
          variant={'outlined'}
          label={'Добавить контакт'}
          placeholder={'Ссылка пользователя...'}
          value={link}
          onChange={(event) => setLink(event.target.value)}
        />

        <Button
          onClick={createContact}
        >
          Добавить
        </Button>
      </Paper>

      {count ? (
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
                  onClick={() => deleteContact(id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <p>
          Ничего не найдено по запросу: {email}
        </p>
      )}
    </Fragment>
  );
});

export default ContactsView;
