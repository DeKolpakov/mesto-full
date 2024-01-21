const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UserRightsError = require('../errors/UserRightsError');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.json(card);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.'
          )
        );
      default:
        return next(error);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.cardId);
    if (!deletedCard) {
      return next(new NotFoundError('Карточка с указанным _id не найдена.'));
    }
    if (deletedCard.owner.toString() !== req.user._id.toString()) {
      return next(
        new UserRightsError('Недостаточно прав для удаления этой карточки')
      );
    }
    return res.send({ message: 'Карточка успешно удалена.' });
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные при удалении карточки.'
          )
        );
      default:
        return next(error);
    }
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      return res.send(card);
    }
    return next(new NotFoundError('Передан несуществующий _id карточки.'));
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка.'
          )
        );
      default:
        return next(error);
    }
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      return res.send(card);
    }
    return next(new NotFoundError('Передан несуществующий _id карточки.'));
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка.'
          )
        );
      default:
        return next(error);
    }
  }
};
