require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const limiter = require('./middlewares/limiter');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { loginUser, createUser } = require('./controllers/users');
const { logRequest, logError } = require('./middlewares/Logger');

const {
  createUserValidate,
  loginValidate,
} = require('./middlewares/validation');

const NotFoundError = require('./errors/NotFoundError');

const { PORT } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mydb');

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://dekolpakov.nomoredomainsmonster.ru',
      'https://api.dekolpakov.nomoredomainsmonster.ru',
    ],
    credentials: true,
    maxAge: 30,
  })
);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logRequest);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidate, loginUser);
app.post('/signup', createUserValidate, createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use(logError);
app.use(errors());

app.use(() => {
  throw new NotFoundError('Неверно указан путь.');
});

app.use((err, req, res, next) => {
  const { statusCode, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT || 3000);
