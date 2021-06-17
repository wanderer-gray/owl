import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';

const useStyles = makeStyles((theme) => ({
  input: {
    marginRight: '16px'
  },
}));

const ProfileView = observer(({ store }) => {
  const classes = useStyles();

  const {
    profile,
    open,
    password,
    newPassword,
    setPassword,
    setNewPassword,
    onOpen,
    onClose,
    updateLink,
    updatePassword,
    deleteAccount,
  } = store;

  if (!profile) {
    return (
      <Fragment>
        <Typography variant={'h4'}>
          Профиль
        </Typography>

        <div>Не удалось получить профиль пользователя</div>
      </Fragment>
    );
  }

  const {
    id,
    email,
    link,
  } = profile;

  return (
    <Fragment>
      <Typography variant={'h4'}>
        Профиль
      </Typography>

      <Table>
        <TableBody>
          <TableRow>
            <TableCell variant={'head'}>ID</TableCell>
            <TableCell>{id}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant={'head'}>Email</TableCell>
            <TableCell>{email}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant={'head'}>Link</TableCell>
            <TableCell>
              {link}

              <IconButton onClick={updateLink}>
                <RefreshIcon />
              </IconButton>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant={'head'}>Password</TableCell>
            <TableCell>
              <TextField
                className={classes.input}
                type={'password'}
                placeholder={'Старый пароль'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <TextField
                className={classes.input}
                type={'password'}
                placeholder={'Новый пароль'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />

              <Button onClick={updatePassword}>
                Обновить
              </Button>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant={'head'}>Удалить аккаунт</TableCell>
            <TableCell>
              <Button
                color={'secondary'}
                variant={'outlined'}
                onClick={onOpen}
              >
                Удалить
              </Button>

              <Dialog
                open={open}
                onClose={onClose}
              >
                <DialogTitle>Вы уверены, что хотите удалить аккаунт?</DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    Если вы удалите аккаунт, то все контакты, группы, тесты и результаты будут потеряны.
                  </DialogContentText>

                  <DialogActions>
                    <Button
                      color={'primary'}
                      onClick={onClose}
                    >
                      Отмена
                    </Button>
                    <Button
                      color={'primary'}
                      onClick={deleteAccount}
                    >
                      Удалить
                    </Button>
                  </DialogActions>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Fragment>
  );
});

export default ProfileView;
