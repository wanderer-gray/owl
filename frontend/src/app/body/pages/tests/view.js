import { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import {
  inject,
  observer,
} from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListSubheader,
  ListItemAvatar,
  ListItemText,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import TestIcon from '@material-ui/icons/Assignment';
import SurveyIcon from '@material-ui/icons/Assessment';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { types, searchTypes } from '../../../../enums/tests';

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginTop: '16px',
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
  pagination: {
    margin: '8px',
  },
}));

const AnswersView = observer(({ AnswersStore }) => {
  const classes = useStyles();

  const {
    open,
    testId,
    title,
    offset,
    count,
    id,
    points,
    maxPoints,
    questions,
    decisions,
    onClose,
    onOffset,
    deleteAnswer,
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
            #{testId} {title}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Paper
        className={classes.paper}
        elevation={0}
      >
        <Typography
          className={classes.title}
          variant={'h6'}
        >
          Версия ответов: #{offset + 1}

          <IconButton
            edge={'end'}
            onClick={() => deleteAnswer(id)}
          >
            <DeleteIcon />
          </IconButton>
        </Typography>

        {count ? (
          <Pagination
            className={classes.pagination}
            showFirstButton={true}
            showLastButton={true}
            page={offset + 1}
            count={count}
            siblingCount={5}
            onChange={(_, page) => onOffset((page - 1))}
          />
        ) : null}

        <Typography
          className={classes.title}
          variant={'h6'}
        >
          Баллы: {points} / {maxPoints}
        </Typography>

        <Typography
          className={classes.title}
          variant={'body1'}
        >
          Вопросы
        </Typography>

        <List>
          {questions.map((question, index) => {
            const { id, title, options } = question;

            return (
              <Fragment key={id}>
                <ListSubheader color={'primary'}>#{index + 1} {title}</ListSubheader>
                
                {options.map((option) => {
                  const{
                    id,
                    title,
                  } = option;

                  return (
                    <ListItem
                      key={id}
                      dense={true}
                    >
                      <ListItemText primary={title} />
                    </ListItem>
                  );
                })}
              </Fragment>
            );
          })}
        </List>

        {decisions.length ? (
          <Fragment>
            <Typography
              className={classes.title}
              variant={'body1'}
            >
              Решения
            </Typography>

            <List>
              {decisions.map((decision, index) => {
                const { title, description } = decision;

                return (
                  <ListItem key={index}>
                    <ListSubheader>{title}</ListSubheader>

                    <ListItemText primary={description} />
                  </ListItem>
                );
              })}
            </List>
          </Fragment>
        ) : null}
      </Paper>
    </Dialog>
  );
});

const getCallback = ({ TestsStore, AnswersStore, test }) => () => {
  const {
    type,
    setTestId,
  } = TestsStore;
  const { onOpen } = AnswersStore;

  if (type === searchTypes.COMPLETED) {
    return onOpen(test);
  }

  return setTestId(test.id);
};

const TestsView = observer(({ TestsStore, AnswersStore, AuthStore }) => {
  const classes = useStyles();

  const {
    tabIndex,
    tests,
    count,
    offset,
    limit,
    type,
    title,
    testId,
    onTabIndexChange,
    onOffset,
  } = TestsStore;

  if (testId) {
    if (type === searchTypes.MY) {
      return <Redirect to={`/test/edit/${testId}`} />;
    }

    return <Redirect to={`/test/view/${testId}`} />;
  }

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Тесты и опросы
      </Typography>

      {AuthStore.isAuth ? (
        <Paper className={classes.tabs}>
          <Tabs
            centered={true}
            textColor={'primary'}
            indicatorColor={'primary'}
            value={tabIndex}
            onChange={onTabIndexChange}
          >
            <Tab label={'Все'} />
            <Tab label={'Мои'} />
            <Tab label={'Назначенные'} />
            <Tab label={'Пройденные'} />
          </Tabs>
        </Paper>
      ) : null}

      {!count ? (
        <p>
          Ничего не найдено по запросу: {title}
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
        {tests.map((test) => {
          const { id, type, title } = test;

          return (
            <ListItem
              key={id}
              onClick={getCallback({ TestsStore, AnswersStore, test })}
            >
              <ListItemAvatar>
                {type === types.TEST ? (
                  <TestIcon />
                ) : (
                  <SurveyIcon />
                )}
              </ListItemAvatar>

              <ListItemText primary={title} />
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

      <AnswersView AnswersStore={AnswersStore} />
    </Fragment>
  );
});

export default inject(
  ({ AuthStore }) => { 
    return {
      AuthStore
    };
  }
)(TestsView);
