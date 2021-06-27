import { Fragment } from 'react';
import {
  inject,
  observer,
} from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { objects, actions } from '../../../../../enums/permissions';
import { getCheckPermissions } from '../../../../../utils';

const useStyles = makeStyles(() => ({
  title: {
    marginTop: '16px',
  },
}));

const groupByObject = (globalPermissions) => globalPermissions
  .filter(({ object }, index) => {
    const idx = globalPermissions.findIndex((globalPermission) => globalPermission.object === object);

    return idx === index;
  })
  .map(({object}) => {
    const items = globalPermissions
      .filter((globalPermission) => globalPermission.object === object)
      .map(({id, action, permit}) => {
        return {
          id,
          action,
          permit,
        };
      });

    return {
      object,
      items
    };
  });

const GlobalPermissionsView = observer(({ AuthStore, store }) => {
  const classes = useStyles();

  const checkPermissions = getCheckPermissions(AuthStore);
  const { SYSTEM } = objects;

  const {
    globalPermissions,
    updateGlobalPermission
  } = store;

  const values = groupByObject(globalPermissions);

  return (
    <Fragment>
      <Typography
        className={classes.title}
        variant={'h5'}
      >
        Глобальные разрешения
      </Typography>

      <List>
        {values.map(({ object, items }) => (
            <Fragment key={object}>
              <ListSubheader>{objects.getTitle(object)}</ListSubheader>
              
              {items.map(({id, action, permit}) => (
                <ListItem key={id}>
                  <ListItemText primary={
                    <FormControlLabel
                      labelPlacement={'start'}
                      label={actions.getTitle(action)}
                      control={(
                        <Switch
                          color={'primary'}
                          checked={permit}
                          onChange={() => checkPermissions(SYSTEM, actions.UPDATE) && updateGlobalPermission(id, !permit)}
                        />
                      )}
                    />
                  } />
                </ListItem>
              ))}
            </Fragment>
          ))}
      </List>
    </Fragment>
  );
});

export default inject(({ AuthStore }) => {
  return {
    AuthStore,
  };
})(GlobalPermissionsView);
