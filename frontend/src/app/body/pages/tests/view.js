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
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import TestIcon from '@material-ui/icons/Assignment';
import SurveyIcon from '@material-ui/icons/Assessment';
import { types, searchTypes } from '../../../../enums/tests';

const useStyles = makeStyles(() => ({
  tabs: {
    marginTop: '16px',
  },
  pagination: {
    margin: '8px',
  },
}));


const TestsView = observer(({ TestsStore, AuthStore }) => {
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
    setTestId,
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
        {tests.map(({id, type, title}) => (
          <ListItem
            key={id}
            onClick={() => setTestId(id)}
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
        ))}
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
