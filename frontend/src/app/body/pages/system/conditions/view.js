import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import WhiteIcon from '@material-ui/icons/CheckOutlined';
import BlackIcon from '@material-ui/icons/CancelOutlined';
import { types, actions } from '../../../../../enums/emailConditions';

const useStyles = makeStyles(() => ({
  title: {
    marginTop: '16px',
  },
  input: {
    marginBottom: '8px'
  },
}));

const ConditionView = observer(({ ConditionStore }) => {
  const classes = useStyles();

  const {
    id,
    condition,
    type,
    setCondition,
    setType,
    open,
    onClose,
    onSave,
  } = ConditionStore;

  return (
    <Dialog
      scroll={'paper'}
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {id ? `Редактирование условия #${id}` : 'Создание условия'}
      </DialogTitle>

      <DialogContent dividers={true}>
        <TextField
          className={classes.input}
          label={'Условие'}
          variant={'outlined'}
          fullWidth={true}
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
        />

        <FormControlLabel
          label={`Тип условия "${types.getTitle(type)}": `}
          labelPlacement={'start'}
          control={(
            <Switch
              color={'primary'}
              checked={type === types.WHITE}
              onChange={setType}
            />
          )}
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

const ConditionsView = observer(({
  ConditionsStore,
  ConditionEditStore,
  ConditionCreateStore,
}) => {
  const classes = useStyles();

  const {
    action,
    conditions,
    deleteCondition,
  } = ConditionsStore;

  return (
    <Fragment>
      <Typography
        className={classes.title}
        variant={'h5'}
      >
        Email условия {actions.getTitle(action)}

        <IconButton
          edge={'end'}
          onClick={ConditionCreateStore.onOpen}
        >
          <AddIcon />
        </IconButton>
      </Typography>

      <List>
        {conditions.map((conditionData) => {
          const { id, condition, type } = conditionData;

          return (
            <ListItem
              key={id}
              onClick={() => ConditionEditStore.onOpen(conditionData)}
            >
              <ListItemAvatar>
                <Avatar>
                  {type === types.WHITE ? (
                    <WhiteIcon />
                  ) : (
                    <BlackIcon />
                  )}
                </Avatar>
              </ListItemAvatar>

              <ListItemText primary={condition} />

              <ListItemSecondaryAction>
                <IconButton
                  edge={'end'}
                  onClick={() => deleteCondition(id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>

      <ConditionView ConditionStore={ConditionEditStore} />
      <ConditionView ConditionStore={ConditionCreateStore} />
    </Fragment>
  );
});

export default ConditionsView;
