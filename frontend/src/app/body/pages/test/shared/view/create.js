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
  Button,
  Radio,
  Checkbox,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
}from '@material-ui/core';
import { TimePicker } from '@material-ui/pickers';
import {
  DragDropContext, 
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIcon from '@material-ui/icons/DragHandle';
import { statuses, tests, questions } from '../../../../../../enums';

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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  overflow: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

const OptionItemView = observer(({ TestStore, QuestionStore, option }) => {
  const classes = useStyles();

  const { types: questionTypes } = questions;

  const { type: questionType } = QuestionStore;

  const {
    checked,
    title,
    onChecked,
    setTitle,
  } = option;

  return (
    <Fragment>
      <DragIcon />

      {questionType === questionTypes.RADIO_BUTS ? (
        <Radio
          checked={checked}
          onClick={onChecked}
        />
      ) : (
        <Checkbox
          checked={checked}
          onClick={onChecked}
        />
      )}

      <TextField
        className={classes.input}
        fullWidth={true}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
    </Fragment>
  )
});

const QuestionView = observer(({ QuestionStore }) => {
  const classes = useStyles();

  const { types: testTypes } = tests;
  const { types: questionTypes } = questions;

  const {
    index,
    title,
    description,
    type,
    points,
    options,
    setTitle,
    setDescription,
    setPoints,
    onType,
    onDragEnd,
    addOption,
    removeOption,
    TestStore,
  } = QuestionStore;
  const { type: testType } = TestStore;

  return (
    <Fragment>
      <Typography variant={'h6'}>
        Вопрос #{index + 1}
      </Typography>

      <TextField
        className={classes.input}
        label={'Заголовок'}
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
        helperText={`${description.length}/255`}
      />
      
      <InputLabel htmlFor={'select-type'}>
        Тип вопроса
      </InputLabel>
      <Select
        className={classes.input}
        id={'select-type'}
        fullWidth={true}
        value={type}
        onChange={(event) => onType(event.target.value)}
      >
        <MenuItem value={questionTypes.RADIO_BUTS}>{questionTypes.getTitle(questionTypes.RADIO_BUTS)}</MenuItem>
        <MenuItem value={questionTypes.CHECK_BOXS}>{questionTypes.getTitle(questionTypes.CHECK_BOXS)}</MenuItem>
      </Select>

      {testType === testTypes.TEST ? (
        <TextField
          className={classes.input}
          label={'Баллы'}
          fullWidth={true}
          value={points}
          onChange={(event) => setPoints(event.target.value)}
          helperText={'0 - 100'}
        />
      ) : null}

      <Typography variant={'h6'}>
        Варианты ({options.length} / 10)
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {options.map((option, index) => (
                <Draggable
                  key={index}
                  draggableId={String(index)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <OptionItemView
                        TestStore={TestStore}
                        QuestionStore={QuestionStore}
                        option={option}
                      />

                      {!snapshot.isDragging ? (
                        <ListItemSecondaryAction>
                          <IconButton
                            edge={'end'}
                            onClick={() => removeOption(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      ) : null}
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      {options.length < 10 ? (
        <IconButton onClick={addOption}>
          <AddIcon />
        </IconButton>
      ) : null}
    </Fragment>
  );
});

const QuestionItemTitleView = observer(({ index, question }) => {
  const classes = useStyles();

  const { title } = question;

  return (
    <ListItemText
      className={classes.overflow}
      primary={`#${index + 1} ${title}`}
    />
  );
});

const TestEditView = observer(({
  TestStore,
  QuestionEditStore,
}) => {
  const classes = useStyles();

  const { types } = tests;

  const {
    status,
    type,
    title,
    description,
    time,
    questions,
    setType,
    setTitle,
    setDescription,
    setTime,
    onDragEnd,
    addQuestion,
    removeQuestion,
    onSave,
  } = TestStore;

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
            <Typography variant={'h6'}>
              {tests.types.getTitle(type)} создание
            </Typography>

            <InputLabel htmlFor={'select-test-type'}>Тип</InputLabel>
            <Select
              className={classes.input}
              id={'select-test-type'}
              fullWidth={true}
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <MenuItem value={types.TEST}>{types.getTitle(types.TEST)}</MenuItem>
              <MenuItem value={types.SURVEY}>{types.getTitle(types.SURVEY)}</MenuItem>
            </Select>

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
              helperText={`${description.length}/255`}
            />

            <TimePicker
              ampm={false}
              label={'Ограничение по времени'}
              variant={'inline'}
              fullWidth={true}
              value={time}
              onChange={setTime}
            />

            <Button
              className={classes.buttons}
              variant={'outlined'}
              fullWidth={true}
              onClick={onSave}
              disabled={status === statuses.loading}
            >
              Сохранить
            </Button>

            <Typography variant={'h6'}>
              Вопросы ({questions.length} / 100)

              {questions.length < 100 ? (
                <IconButton onClick={addQuestion}>
                  <AddIcon />
                </IconButton>
              ) : null}
            </Typography>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <List
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {questions.map((question, index) => (
                      <Draggable
                        key={index}
                        draggableId={String(index)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => QuestionEditStore.onOpen(question)}
                          >
                            <QuestionItemTitleView
                              index={index}
                              question={question}
                            />

                            {!snapshot.isDragging ? (
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge={'end'}
                                  onClick={() => removeQuestion(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            ) : null}
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          </Paper>
        </Grid>

        <Grid
          xs={7}
          item={true}
        >
          <Paper className={classes.paper}>
            {QuestionEditStore.open ? (
              <QuestionView QuestionStore={QuestionEditStore} />
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

export default TestEditView;
