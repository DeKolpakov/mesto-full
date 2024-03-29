const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');
const DublicateError = require('../errors/DublicateError');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-__v');
    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-__v');
    if (!user) {
      return next(
        new NotFoundError('Пользователь по указанному _id не найден.')
      );
    }
    return res.json(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return next(
          new BadRequestError('Переданы некорректные данные пользователя')
        );
      default:
        return next(error);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: passwordHash,
    });

    return res.send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя.'
          )
        );
      case 'MongoServerError':
        if (error.code === 11000) {
          return next(
            new DublicateError('Пользователь с таким email уже существует.')
          );
        }
        return next(error);
      default:
        return next(error);
    }
  }
};

module.exports.loginUser = async (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthorizationError('Неправильные почта или пароль'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AuthorizationError('Неправильные почта или пароль'));
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
      {
        expiresIn: '7d',
      }
    );

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: true,
    });
    return res.send({
      email: user.email,
      _id: user._id,
      message: 'Успешная авторизация',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id).select('-__v');
    if (!currentUser) {
      return next(new NotFoundError('Пользовательс указанным _id не найден.'));
    }
    return res.json(currentUser);
  } catch (error) {
    return next(error);
  }
};

module.exports.updateUserData = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!userUpdate) {
      return next(new NotFoundError('Пользователь с указанным _id не найден.'));
    }
    return res.send(userUpdate);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля.'
          )
        );
      default:
        return next(error);
    }
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const avatarUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (avatarUpdate) {
      return res.json(avatarUpdate);
    }
    return next(new NotFoundError('Пользователь с указанным _id не найден.'));
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля.'
          )
        );
      default:
        return next(error);
    }
  }
};
