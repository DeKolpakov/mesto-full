require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const cors = require('./middlewares/cors');
const auth = require('./middlewares/auth');
const limiter = require('./middlewares/limiter');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { loginUser, createUser } = require('./controllers/users');
const { logRequest, logError } = require('./middlewares/Logger');

const {
  createUserValidate,
  loginValidate,
} = require('./middlewares/validation');

const errorHandler = require('./middlewares/errorHandler')
const NotFoundError = require('./errors/NotFoundError');

const { PORT, BDADDRES } = process.env;

const app = express();

mongoose.connect(BDADDRES || 'mongodb://127.0.0.1:27017/mydb');

app.use(limiter);
app.use(helmet());
app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logRequest);

app.post('/signin', loginValidate, loginUser);
app.post('/signup', createUserValidate, createUser);
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use(() => {
  throw new NotFoundError('Неверно указан путь.');
});

app.use(logError);
app.use(errors());
app.use(errorHandler);

app.listen(PORT || 3000);
