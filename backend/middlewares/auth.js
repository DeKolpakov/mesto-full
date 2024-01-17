require('dotenv').config();

const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new AuthorizationError('Необходима авторизация');
    }

    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }
  req.user = payload;

  next();
};
