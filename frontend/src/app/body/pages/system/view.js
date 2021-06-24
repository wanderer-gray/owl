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
import GlobalPermissions from './globalPermissions';
import { actions } from '../../../../enums/emailConditions';

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
      return <Conditions action={actions.LOGIN} />;
  
    case 2:
      return <Conditions action={actions.SIGNUP} />;

    case 3:
      return <Conditions action={actions.RESTORE} />;
    
    case 4:
      return <GlobalPermissions />;

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
          variant={'fullWidth'}
          textColor={'primary'}
          indicatorColor={'primary'}
          value={tabIndex}
          onChange={onTabIndexChange}
        >
          <Tab label={'Email аккаунты'} />
          <Tab label={'Email условия входа'} />
          <Tab label={'Email условия регистрации'} />
          <Tab label={'Email условия восстановления'} />
          <Tab label={'Глобальные разрешения'} />
        </Tabs>
      </Paper>

      <Box>
        <Content tabIndex={tabIndex} />
      </Box>
    </Fragment>
  );
});

export default SystemView;
