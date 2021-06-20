import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  Tabs,
  Tab,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  tabs: {
    marginTop: '16px',
  },
}));


const TestsView = observer(({ Store }) => {
  const classes = useStyles();

  const {
    tabIndex,
    onTabIndexChange,
  } = Store;

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Тесты
      </Typography>

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
    </Fragment>
  );
});

export default TestsView;
