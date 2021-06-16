import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
} from '@material-ui/core';
import Accounts from './accounts';
import Conditions from './conditions';

const useStyles = makeStyles(() => ({
  tabs: {
    marginTop: '16px',
  },
}));

const Content = ({ tabIndex }) => {
  switch (tabIndex) {
    case 0:
      return <Accounts />;

    case 1:
      return <Conditions />;
    
    default:
      return null;
  }
};

const SystemView = observer(({ store }) => {
  const classes = useStyles();

  const {
    tabIndex,
    onTabIndexChange,
  } = store;

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Система
      </Typography>

      <Paper className={classes.tabs}>
        <Tabs
          centered={true}
          textColor={'primary'}
          indicatorColor={'primary'}
          value={tabIndex}
          onChange={onTabIndexChange}
        >
          <Tab label={'Email аккаунты'} />
          <Tab label={'Email условия'} />
        </Tabs>
      </Paper>

      <Box>
        <Content tabIndex={tabIndex} />
      </Box>
    </Fragment>
  );
});

export default SystemView;
