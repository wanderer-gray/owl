import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { types as testTypes } from '../../../../../enums/tests'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttons: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const TestView = observer(({ TestStore }) => {
  const classes = useStyles();

  const {
    info,
    test,
    question,
    result,
    type,
    questions,
    questionIndex,
    setQuestion,
    pastQuestion,
    nextQuestion,
    getTest,
    setAnswer,
    getResult,
  } = TestStore;

  if (!info) {
    return (
      <Typography variant={'h6'}>
        Получение информации о тесте...
      </Typography>
    );
  }

  if (!test) {
    const {
      id,
      type,
      title,
      description,
      time,
    } = info;

    const root = new Date(0, 0, 0, 0, 0, 0, 0);
    const mins = (new Date(time).getTime() - root.getTime()) / 1000 / 60;

    return (
      <Fragment>
        <Typography variant={'h6'}>
          Информация
        </Typography>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant={'head'}>ID</TableCell>
              <TableCell>{id}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant={'head'}>Тип</TableCell>
              <TableCell>{type === testTypes.TEST ? 'Тест' : 'Опрос'}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant={'head'}>Название</TableCell>
              <TableCell>{title}</TableCell>
            </TableRow>

            {description ? (
              <TableRow>
                <TableCell variant={'head'}>Описание</TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ) : null}

            <TableRow>
              <TableCell variant={'head'}>Время</TableCell>
              <TableCell>{mins} мин</TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant={'head'}>Начать тест</TableCell>
              <TableCell>
                <Button
                  color={'secondary'}
                  variant={'outlined'}
                  onClick={getTest}
                >
                  Начать
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Fragment>
    );
  }

  if (result) {
    if (type === testTypes.SURVEY) {
      <Typography variant={'h6'}>
        Спасибо за участие в опросе
      </Typography>
    }

    const {
      points,
      decisions,
      testPoints,
    } = result;
    
    return (
      <Fragment>
        <Typography variant={'h6'}>
          Спасибо за участие в тесте
        </Typography>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant={'head'}>Количество баллов за тест</TableCell>
              <TableCell>{points} / {testPoints}</TableCell>
            </TableRow>

            {decisions.map(({ title, description }, index) => (
              <TableRow key={index}>
                <TableCell variant={'head'}>{title}</TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Fragment>
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
              {type === testTypes.TEST ? 'Тест' : 'Опрос'} #{test.id} {test.title}
            </Typography>

            <Button
              className={classes.button}
              variant={'outlined'}
              fullWidth={true}
              onClick={getResult}
            >
              Завершить
            </Button>

            <Typography variant={'h6'}>
              Вопросы {questions.length}
            </Typography>

            <List>
              {questions.map((question, index) => (
                <ListItem
                  key={index}
                  onClick={() => setQuestion(question)}
                >
                  <ListItemText primary={`#${index + 1} ${question.title}`}/>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid
          xs={7}
          item={true}
        >
          <Paper className={classes.paper}>
            <Typography variant={'h6'}>
              Вопрос #{questionIndex + 1}
            </Typography>

            <Typography variant={'body1'}>
              {question.title}
            </Typography>

            {question.description ? (
              <Typography variant={'body2'}>
                {question.description}
              </Typography>
            ) : null}

            <Typography variant={'h6'}>
              Варианты
            </Typography>

            <List>
              {question.options.map(({id, checked, title}) => (
                <ListItem key={id}>
                  <FormControlLabel
                    labelPlacement={'end'}
                    label={title}
                    onClick={() => setAnswer(id, !checked)}
                    control={question.type === 1 ? (
                      <Radio
                        color={'primary'}
                        checked={!!checked}
                      />
                    ) : (
                      <Checkbox
                        color={'primary'}
                        checked={!!checked}
                      />
                    )}
                  />
                </ListItem>
              ))}
            </List>

            <ButtonGroup
              className={classes.buttons}
              fullWidth={true}
            >
              {questionIndex ? (
                <Button onClick={pastQuestion}>
                  Назад
                </Button>
              ) : null}

              {questionIndex + 1 < questions.length ? (
                <Button onClick={nextQuestion}>
                  Далее
                </Button>
              ) : null}

              {questionIndex + 1 === questions.length ? (
                <Button onClick={getResult}>
                  Завершить
                </Button>
              ) : null}
            </ButtonGroup>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
});

export default TestView;
