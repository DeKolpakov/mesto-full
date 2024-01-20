const { celebrate, Joi } = require('celebrate');

module.exports.loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.createUserValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
    ),
  }),
});

module.exports.userIdValidate = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24).messages({
      'string.length': 'Ошибка валидации ID пользователя',
      'string.alphanum': 'Ошибка валидации ID пользователя',
      'any.required': 'Поле является обязвтельным',
    }),
  }),
});

module.exports.updateUserValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.updateAvatarValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
  }),
});

module.exports.cardIdValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24).messages({
      'string.length': 'Ошибка валидации ID карточки',
      'string.alphanum': 'Ошибка валидации ID карточки',
      'any.required': 'Поле является обязвтельным',
    }),
  }),
});

module.exports.createCardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
  }),
});
