import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  InputLabel,
  Select,
  Radio,
  Checkbox,
  FormControlLabel,
  Switch,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
}from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import { tests } from '../../../../../enums';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  input: {
    marginBottom: '8px'
  },
  buttons: {
    margin: theme.spacing(1),
  },
}));

const MembersView = observer(({ MembersStore }) => {
  const {
    members,
    searchMembers,
    TestStore: {
      addMember,
    } = {},
  } = MembersStore || {};

  return (
    <Autocomplete
      fullWidth={true}
      getOptionLabel={(option) => option.text}
      getOptionSelected={(option, value) => option.id === value.id && option.type === value.type}
      renderInput={(params) => (
        <TextField
          {...params}
          label={'Контакты и группы'}
          variant={'outlined'}
        />
      )}
      options={members}
      onChange={(_, member, reason) => {
        if (reason !== 'select-option') {
          return;
        }

        addMember(member);
      }}
      onInputChange={(_, text, reason) => {
        if (reason !== 'input') {
          return;
        }
        
        searchMembers(text);
      }}
    />
  );
});

const LinksView = observer(({ LinksStore }) => {
  const classes = useStyles();

  const {
    links,
    onClose,
    createLink,
    deleteLink,
    TestStore: {
      availableAll,
      setAvailableAll,
    },
  } = LinksStore;

  return (
    <Dialog
      scroll={'paper'}
      fullWidth={true}
      open={false}
      onClose={onClose}
    >
      <DialogTitle>
        Поделиться
      </DialogTitle>

      <DialogContent dividers={true}>
        <FormControlLabel
          className={classes.input}
          label={'Доступна всем'}
          labelPlacement={'start'}
          control={(
            <Switch
              color={'primary'}
              checked={availableAll}
              onClick={() => setAvailableAll(!availableAll)}
            />
          )}
        />

        <List>
          {links.map(({ id, link, begin, end }) => (
            <ListItem key={id}>
              <ListItemAvatar>
                <Avatar>
                  <LinkIcon />
                </Avatar>
              </ListItemAvatar>

              <ListItemText primary={link} />

              <ListItemText primary={begin} />

              <ListItemText primary={end} />

              <ListItemSecondaryAction>
                <IconButton
                  edge={'end'}
                  onClick={() => deleteLink(id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <IconButton onClick={createLink}>
          <AddIcon />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
});

const QuestionsView = observer(({ QuestionsStore }) => {
  const {
    questions,
    addQuestion,
    removeQuestion,
    QuestionStore,
  } = QuestionsStore;

  return (
    <Fragment>
      <Typography variant={'h6'}>
        Вопросы

        <IconButton onClick={addQuestion}>
          <AddIcon />
        </IconButton>
      </Typography>

      <List>
        {questions.map((question, index) => {
          const { title } = question;

          return (
            <ListItem
              key={index}
              onClick={() => QuestionStore.onOpen(question)}
            >
              <ListItemText primary={`#${index + 1} ${title}`} />

              <ListItemSecondaryAction>
                <IconButton
                  edge={'end'}
                  onClick={() => removeQuestion(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Fragment>
  );
});

const QuestionView = observer(({ QuestionStore }) => {
  const classes = useStyles();

  const {
    index,
    title,
    description,
    type,
    points,
    options,
    setTitle,
    setDescription,
    setType,
    setPoints,
    setOptionChecked,
    setOptionTitle,
    addOption,
    removeOption,
  } = QuestionStore;

  return (
    <Fragment>
      <Typography variant={'h6'}>
        Вопрос #{index + 1}
      </Typography>

      <TextField
        className={classes.input}
        label={'Название'}
        required={true}
        fullWidth={true}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <TextField
        className={classes.input}
        label={'Описание'}
        rowsMax={3}
        multiline={true}
        fullWidth={true}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      
      <InputLabel htmlFor={'select-type'}>
        Тип вопроса
      </InputLabel>
      <Select
        className={classes.input}
        id={'select-type'}
        fullWidth={true}
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <MenuItem value={tests.types.RADIO_BUTS}>Выбор одного пункта из набора</MenuItem>
        <MenuItem value={tests.types.CHECK_BOXS}>Выбор нескольких пунктов из набора</MenuItem>
      </Select>

      <TextField
        className={classes.input}
        label={'Баллы'}
        required={true}
        fullWidth={true}
        value={points}
        onChange={(event) => setPoints(event.target.value)}
      />

      <List>
        {options.map(({ checked, title }, index) => (
          <ListItem key={index}>
            {type === tests.types.RADIO_BUTS ? (
              <Radio
                checked={checked}
                onClick={() => setOptionChecked(index, !checked)}
              />
            ) : (
              <Checkbox
                checked={checked}
                onClick={() => setOptionChecked(index, !checked)}
              />
            )}

            <TextField
              className={classes.input}
              required={true}
              fullWidth={true}
              value={title}
              onChange={(event) => setOptionTitle(index, event.target.value)}
            />

            <ListItemSecondaryAction>
              <IconButton
                edge={'end'}
                onClick={() => removeOption(index)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <IconButton onClick={addOption}>
        <AddIcon />
      </IconButton>
    </Fragment>
  );
});

const CreateTestView = observer(({ store }) => {
  const classes = useStyles();

  const {
    id,
    title,
    description,
    setTitle,
    setDescription,
    onSave,
    deleteTest,
    LinksStore,
    QuestionsStore,
  } = store;
  const { QuestionStore } = QuestionsStore;

  return (
    <div className={classes.root}>
      <Grid
        spacing={2}
        container={true}
      >
        <Grid
          xs={5}
          item={true}
        >
          <Paper className={classes.paper}>
            {id ? (
              <Typography variant={'h6'}>
                Тест #{id}

                <IconButton
                  edge={'end'}
                  onClick={() => deleteTest(id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Typography>
            ) : null}

            <TextField
              className={classes.input}
              label={'Название'}
              fullWidth={true}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <TextField
              className={classes.input}
              label={'Описание'}
              rowsMax={3}
              multiline={true}
              fullWidth={true}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            
            <ButtonGroup className={classes.buttons} color={'primary'}>
              <Button onClick={onSave}>Сохранить</Button>
              {id ? (
                <Fragment>
                  <Button onClick={LinksStore.onOpen}>Поделиться</Button>
                  <Button>Аналитика</Button>
                </Fragment>
              ) : null}
            </ButtonGroup>

            <LinksView LinksStore={LinksStore} />
            <QuestionsView QuestionsStore={QuestionsStore} />
          </Paper>
        </Grid>

        <Grid
          xs={7}
          item={true}
        >
          <Paper className={classes.paper}>
            {QuestionStore.open ? (
              <QuestionView QuestionStore={QuestionStore} />
            ) : (
              <Typography variant={'h6'}>
                Необходимо создать или выбрать вопрос
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
});

export default CreateTestView;
