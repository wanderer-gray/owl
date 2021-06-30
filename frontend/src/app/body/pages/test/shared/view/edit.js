import { Fragment } from 'react';
import {
  inject,
  observer,
} from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  ButtonGroup,
  Button,
  Radio,
  Checkbox,
  MenuItem,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Slider,
}from '@material-ui/core';
import {
  TimePicker,
  DateTimePicker,
} from '@material-ui/pickers';
import {
  DragDropContext, 
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  SplineSeries,
  BarSeries,
  Title,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import Pagination from '@material-ui/lab/Pagination';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import DragIcon from '@material-ui/icons/DragHandle';
import GreenIcon from '@material-ui/icons/Done';
import YellowIcon from '@material-ui/icons/Warning';
import RedIcon from '@material-ui/icons/Error';
import { green, yellow, red } from '@material-ui/core/colors';
import { statuses, tests, questions } from '../../../../../../enums';
import { objects, actions } from '../../../../../../enums/permissions';
import { fmtDateTime, checkPermissions } from '../../../../../../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
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
  pagination: {
    margin: '8px',
  },
}));

const ContactsView = observer(({ ContactStore, ContactsStore }) => {
  const classes = useStyles();

  const {
    contacts,
    searchContacts,
  } = ContactsStore;
  const { onContact } = ContactStore;

  return (
    <Autocomplete
      className={classes.input}
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

        onContact(contact);
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

const ContactView = observer(({ ContactStore, ContactsStore }) => {
  const classes = useStyles();

  const {
    open,
    id,
    begin,
    end,
    limit,
    setBegin,
    setEnd,
    setLimit,
    onClose,
    onSave
  } = ContactStore;

  return (
    <Dialog
      scroll={'paper'}
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {id ? `Редактирование контакта #${id}` : 'Создание контакта'}
      </DialogTitle>

      <DialogContent dividers={true}>
        <ContactsView
          ContactStore={ContactStore}
          ContactsStore={ContactsStore}
        />

        <DateTimePicker
          className={classes.input}
          ampm={false}
          label={'Начало доступа'}
          okLabel={'Сохранить'}
          clearLabel={'Очистить'}
          cancelLabel={'Отмена'}
          clearable={true}
          fullWidth={true}
          inputVariant={'outlined'}
          value={begin}
          onChange={setBegin}
          minDate={new Date()}
        />

        <DateTimePicker
          className={classes.input}
          ampm={false}
          label={'Конец доступа'}
          okLabel={'Сохранить'}
          clearLabel={'Очистить'}
          cancelLabel={'Отмена'}
          clearable={true}
          fullWidth={true}
          inputVariant={'outlined'}
          value={end}
          onChange={setEnd}
          minDate={begin || new Date()}
        />

        <TextField
          className={classes.input}
          label={'Лимит (0 - бесконечность)'}
          variant={'outlined'}
          fullWidth={true}
          value={limit}
          onChange={(event) => setLimit(event.target.value)}
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

const GroupsView = observer(({ GroupStore, GroupsStore }) => {
  const classes = useStyles();

  const {
    groups,
    searchGroups,
  } = GroupsStore;
  const { onGroup } = GroupStore;

  return (
    <Autocomplete
      className={classes.input}
      fullWidth={true}
      getOptionLabel={(option) => option.title}
      getOptionSelected={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={'Группы'}
          variant={'outlined'}
        />
      )}
      options={groups}
      onChange={(_, group, reason) => {
        if (reason !== 'select-option') {
          return;
        }

        onGroup(group);
      }}
      onInputChange={(_, title, reason) => {
        if (reason !== 'input') {
          return;
        }
        
        searchGroups(title);
      }}
    />
  );
});

const GroupView = observer(({ GroupStore, GroupsStore }) => {
  const classes = useStyles();

  const {
    open,
    id,
    begin,
    end,
    limit,
    setBegin,
    setEnd,
    setLimit,
    onClose,
    onSave
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
        <GroupsView
          GroupStore={GroupStore}
          GroupsStore={GroupsStore}
        />

        <DateTimePicker
          className={classes.input}
          ampm={false}
          label={'Начало доступа'}
          okLabel={'Сохранить'}
          clearLabel={'Очистить'}
          cancelLabel={'Отмена'}
          clearable={true}
          fullWidth={true}
          inputVariant={'outlined'}
          value={begin}
          onChange={setBegin}
          minDate={new Date()}
        />

        <DateTimePicker
          className={classes.input}
          ampm={false}
          label={'Конец доступа'}
          okLabel={'Сохранить'}
          clearLabel={'Очистить'}
          cancelLabel={'Отмена'}
          clearable={true}
          fullWidth={true}
          inputVariant={'outlined'}
          value={end}
          onChange={setEnd}
          minDate={begin || new Date()}
        />

        <TextField
          className={classes.input}
          label={'Лимит (0 - бесконечность)'}
          variant={'outlined'}
          fullWidth={true}
          value={limit}
          onChange={(event) => setLimit(event.target.value)}
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

const SharedView = observer(({
  SharedStore,

  ContactsStore,
  ContactEditStore,
  ContactCreateStore,

  GroupsStore,
  GroupEditStore,
  GroupCreateStore,
}) => {
  const classes = useStyles();

  const {
    open,
    availableAll,
    contacts,
    groups,
    setAvailableAll,
    deleteContact,
    deleteGroup,
    onClose,
    onSave,
  } = SharedStore;

  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={onClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge={'start'}
            color={'inherit'}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            className={classes.title}
            variant={'h6'}
          >
            Поделиться
          </Typography>

          <Button
            color={'inherit'}
            onClick={onSave}
          >
            Сохранить
          </Button>
        </Toolbar>
      </AppBar>
      
      <Paper
        className={classes.paper}
        elevation={0}
      >
        <FormControlLabel
          className={classes.input}
          label={'Доступно всем'}
          labelPlacement={'start'}
          control={(
            <Switch
              color={'primary'}
              checked={availableAll}
              onChange={() => setAvailableAll(!availableAll)}
            />
          )}
        />

        {!availableAll ? (
          <Fragment>
            <Typography variant={'h6'}>
              Контакты

              <IconButton onClick={ContactCreateStore.onOpen}>
                <AddIcon />
              </IconButton>
            </Typography>

            <List>
              {contacts.map((contact, index) => {
                const {
                  id,
                  email,
                  begin,
                  end,
                  limit,
                } = contact;

                return (
                  <ListItem
                    key={id}
                    onClick={() => ContactEditStore.onOpen(contact)}
                  >
                    <ListItemText primary={email} />
                    <ListItemText primary={fmtDateTime(begin) || 'Не указано'} />
                    <ListItemText primary={fmtDateTime(end) || 'Не указано'} />
                    <ListItemText primary={limit || 'Не ограничено'} />

                    <ListItemSecondaryAction>
                      <IconButton
                        edge={'end'}
                        onClick={() => deleteContact(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>

            
            <Typography variant={'h6'}>
              Группы

              <IconButton onClick={GroupCreateStore.onOpen}>
                <AddIcon />
              </IconButton>
            </Typography>

            <List>
              {groups.map((group, index) => {
                const {
                  id,
                  title,
                  begin,
                  end,
                  limit,
                } = group;
                return (
                  <ListItem
                    key={id}
                    onClick={() => GroupEditStore.onOpen(group)}
                  >
                    <ListItemText primary={title} />
                    <ListItemText primary={fmtDateTime(begin) || 'Не указано'} />
                    <ListItemText primary={fmtDateTime(end) || 'Не указано'} />
                    <ListItemText primary={limit || 'Не ограничено'} />

                    <ListItemSecondaryAction>
                      <IconButton
                        edge={'end'}
                        onClick={() => deleteGroup(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Fragment>
        ) : null}
      </Paper>
      
      <ContactView
        ContactStore={ContactEditStore}
        ContactsStore={ContactsStore}
      />
      <ContactView
        ContactStore={ContactCreateStore}
        ContactsStore={ContactsStore}
      />

      <GroupView
        GroupStore={GroupEditStore}
        GroupsStore={GroupsStore}
      />
      <GroupView
        GroupStore={GroupCreateStore}
        GroupsStore={GroupsStore}
      />
    </Dialog>
  );
});

const DecisionView = observer(({ DecisionStore, DecisionsStore }) => {
  const classes = useStyles();

  const {
    open,
    title,
    description,
    from,
    to,
    setTitle,
    setDescription,
    setFrom,
    setTo,
    onClose,
    onSave,
  } = DecisionStore;
  const { maxPoints } = DecisionsStore;

  return (
    <Dialog
      scroll={'paper'}
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        Решения редактирование
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
        
        <TextField
          className={classes.input}
          label={'Описание'}
          variant={'outlined'}
          fullWidth={true}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <Slider
          valueLabelDisplay={'on'}
          max={maxPoints}
          value={[from, to]}
          onChange={(_, value) => {
            setFrom(value[0]);
            setTo(value[1]);
          }}
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

const DecisionsView = observer(({
  DecisionsStore,
  DecisionEditStore,
  DecisionCreateStore,
}) => {
  const classes = useStyles();

  const {
    open,
    decisions,
    removeDecision,
    onClose,
    onSave,
  } = DecisionsStore;

  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={onClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge={'start'}
            color={'inherit'}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            className={classes.title}
            variant={'h6'}
          >
            Решения
          </Typography>

          <Button
            color={'inherit'}
            onClick={onSave}
          >
            Сохранить
          </Button>
        </Toolbar>
      </AppBar>
      
      <Paper
        className={classes.paper}
        elevation={0}
      >
        <Typography variant={'h6'}>
          Решения на основе баллов

          {decisions.length < 10 ? (
            <IconButton onClick={DecisionCreateStore.onOpen}>
              <AddIcon />
            </IconButton>
          ) : null}
        </Typography>

        <List>
          {decisions.map((decision, index) => {
            const {
              title,
              from,
              to,
            } = decision;

            return (
              <ListItem
                key={index}
                onClick={() => DecisionEditStore.onOpen(decision)}
              >
                <ListItemText primary={title} />
                <ListItemText primary={from} />
                <ListItemText primary={to} />

                <ListItemSecondaryAction>
                  <IconButton
                    edge={'end'}
                    onClick={() => removeDecision(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Paper>

      <DecisionView
        DecisionStore={DecisionEditStore}
        DecisionsStore={DecisionsStore}
      />
      <DecisionView
        DecisionStore={DecisionCreateStore}
        DecisionsStore={DecisionsStore}
      />
    </Dialog>
  );
});

const GetIcon = ({ color }) => {
  switch (color) {
    case 'green':
      return <GreenIcon style={{ color: green[500] }} />;
    
    case 'yellow':
      return <YellowIcon style={{ color: yellow[500] }} />;
    
    case 'red':
      return <RedIcon style={{ color: red[500] }} />;

    default:
      return null;
  }
};

const AnswerView = observer(({ AnswerStore }) => {
  const classes = useStyles();

  const {
    open,
    email,
    points,
    maxPoints,
    questions,
    onClose,
  } = AnswerStore;

  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={onClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge={'start'}
            color={'inherit'}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            className={classes.title}
            variant={'h6'}
          >
            Ответы пользователя
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Paper
        className={classes.paper}
        elevation={0}
      >
        <Typography variant={'h6'}>
          Пользователь: {email}. Баллы: {points} / {maxPoints}
        </Typography>

        <List>
          {questions.map((question) => {
            const {
              id,
              title,
              points,
              maxPoints,
              options,
            } = question;

            return (
              <Fragment key={id}>
                <ListSubheader disableGutters={true}>{title} {points} / {maxPoints}</ListSubheader>
                
                {options.map((option) => {
                  const{
                    id,
                    title,
                    color,
                  } = option;

                  return (
                    <ListItem key={id}>
                      <GetIcon color={color} />
                      <ListItemText primary={title} />
                    </ListItem>
                  );
                })}
              </Fragment>
            );
          })}
        </List>
      </Paper>
    </Dialog>
  );
});

const AnswersView = observer(({
  AnswersStore,
  AnswerViewStore,
}) => {
  const classes = useStyles();

  const {
    open,
    users,
    count,
    offset,
    limit,
    onClose,
    onOffset,
  } = AnswersStore;

  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={onClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge={'start'}
            color={'inherit'}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            className={classes.title}
            variant={'h6'}
          >
            Результаты
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Paper
        className={classes.paper}
        elevation={0}
      >
        <Typography variant={'h6'}>
          Пользователи и ответы
        </Typography>

        {!count ? (
          <p>
            Ничего не найдено
          </p>
        ) : null}

        {count > limit ? (
          <Pagination
            className={classes.pagination}
            showFirstButton={true}
            showLastButton={true}
            page={offset / limit + 1}
            count={Math.ceil(count / limit)}
            siblingCount={5}
            onChange={(_, page) => onOffset((page - 1) * limit)}
          />
        ) : null}

        <List>
          {users.map((user) => {
            const {
              id,
              email,
              points,
            } = user;

            return (
              <ListItem
                key={id}
                onClick={() => AnswerViewStore.onOpen(user)}
              >
                <ListItemText primary={`${email} ${points}`} />
              </ListItem>
            );
          })}
        </List>

        {count > limit ? (
          <Pagination
            className={classes.pagination}
            showFirstButton={true}
            showLastButton={true}
            page={offset / limit + 1}
            count={Math.ceil(count / limit)}
            siblingCount={5}
            onChange={(_, page) => onOffset((page - 1) * limit)}
          />
        ) : null}
      </Paper>

      <AnswerView AnswerStore={AnswerViewStore} />
    </Dialog>
  );
});

const AnalyticsView = observer(({ AnalyticsStore }) => {
  const classes = useStyles();

  const {
    open,
    dataPoints,
    dataQuestions,
    onClose,
  } = AnalyticsStore;

  return (
    <Dialog
      fullScreen={true}
      open={open}
      onClose={onClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge={'start'}
            color={'inherit'}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            className={classes.title}
            variant={'h6'}
          >
            Аналитика
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Paper
        className={classes.paper}
        elevation={0}
      >
        <Grid
          container={true}
          spacing={3}
        >
          <Grid
            item={true}
            xs={12}
          >
            <Paper>
              <Chart data={dataPoints}>
                <ArgumentAxis />
                <ValueAxis />

                <SplineSeries
                  name="spline"
                  valueField="count"
                  argumentField="points"
                />

                <Title text="Количество тестов (y) / количество очков (x)" />
              </Chart>
            </Paper>
          </Grid>

          {dataQuestions.map(({id, title, options}) => {
            return (
              <Grid
                key={id}
                item={true}
                xs={6}
              >
                <Paper>
                  <Chart data={options}>
                    <ArgumentAxis />
                    <ValueAxis />

                    <BarSeries
                      valueField="count"
                      argumentField="title"
                    />
                    <Title text={title} />

                    <EventTracker />
                    <Tooltip />
                  </Chart>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Dialog>
  );
});

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
  AuthStore,

  TestStore,
  QuestionEditStore,

  SharedStore,

  ContactsStore,
  ContactEditStore,
  ContactCreateStore,

  GroupsStore,
  GroupEditStore,
  GroupCreateStore,

  DecisionsStore,
  DecisionEditStore,
  DecisionCreateStore,

  AnswersStore,
  AnswerViewStore,

  AnalyticsStore,
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
    deleteTest,
  } = TestStore;

  if (status === statuses.loading) {
    return (
      <Typography variant={'h6'}>
        Загрузка
      </Typography>
    );
  }

  if (status === statuses.error) {
    return (
      <Typography variant={'h6'}>
        Не удалось загрузить данные
      </Typography>
    );
  }

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
              {tests.types.getTitle(type)} редактирование

              {checkPermissions(AuthStore, objects.TESTS, actions.DELETE) ? (
                <IconButton onClick={deleteTest}>
                  <DeleteIcon />
                </IconButton>
              ) : null}
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

            <ButtonGroup
              className={classes.buttons}
              fullWidth={true}
            >
              <Button onClick={onSave}>
                Сохранить
              </Button>
              <Button onClick={SharedStore.onOpen}>
                Поделиться
              </Button>
              {DecisionsStore.maxPoints ? (
                <Button onClick={DecisionsStore.onOpen}>
                  Решения
                </Button>
              ) : null}
            </ButtonGroup>
            <ButtonGroup
              className={classes.buttons}
              fullWidth={true}
            >
              <Button onClick={AnswersStore.onOpen}>
                Результаты
              </Button>
              <Button onClick={AnalyticsStore.onOpen}>
                Аналитика
              </Button>
            </ButtonGroup>

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
      
      <SharedView
        SharedStore={SharedStore}

        ContactsStore={ContactsStore}
        ContactEditStore={ContactEditStore}
        ContactCreateStore={ContactCreateStore}

        GroupsStore={GroupsStore}
        GroupEditStore={GroupEditStore}
        GroupCreateStore={GroupCreateStore}
      />

      <DecisionsView
        DecisionsStore={DecisionsStore}
        DecisionEditStore={DecisionEditStore}
        DecisionCreateStore={DecisionCreateStore}
      />
      
      <AnswersView
        AnswersStore={AnswersStore}
        AnswerViewStore={AnswerViewStore}
      />

      <AnalyticsView AnalyticsStore={AnalyticsStore} />
    </div>
  );
});

export default inject(({ AuthStore }) => {
  return {
    AuthStore,
  };
})(TestEditView);
