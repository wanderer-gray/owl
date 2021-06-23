import { Fragment } from 'react';
import { observer } from 'mobx-react';
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

const useStyles = makeStyles(() => ({
  title: {
    marginTop: '16px',
  },
}));

const GlobalPermissionsView = observer(({ store }) => {
  const classes = useStyles();

  const {
    globalPermissions,
    updateGlobalPermission
  } = store;

  const permissions = globalPermissions
    .filter(({ object }, index) => {
      const idx = globalPermissions.findIndex(
        (permission) => permission.object === object
      );

      return idx === index;
    })
    .map(({ object }) => {

    });

  return (
    <Fragment>
      <Typography
        className={classes.title}
        variant={'h5'}
      >
        Глобальные разрешения
      </Typography>

      <List>
        {globalPermissions.map((globalPermission) => {
          const {
            id,
            object,
            action,
            permit,
          } = globalPermission;

          return (
            <ListItem key={id}>
              <ListItemText primary={objects.getTitle(object)} />

              <ListItemText primary={
                <FormControlLabel
                  labelPlacement={'start'}
                  label={actions.getTitle(action)}
                  control={(
                    <Switch
                      color={'primary'}
                      checked={permit}
                      onChange={() => {
                        updateGlobalPermission(id, !permit);
                      }}
                    />
                  )}
                />
              } />
            </ListItem>
          );
        })}
      </List>
    </Fragment>
  );
});

export default GlobalPermissionsView;
