import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const userContext = React.useContext(CurrentUserContext);

  function handleClick() {
    onCardClick(card);
  }
  const isOwn = card.owner === userContext._id;

  function handleDeleteClick() {
    onCardDelete(card);
  }

  const isLiked = card.likes.some((id) => id === userContext._id);

  const cardLikeButtonClassName = `galery__button-like ${isLiked ? 'galery__button-like_active' : ''}`;

  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <div className='galery__item'>
      {isOwn && <button className='galery__button-delete' type='button' aria-label='удалить' onClick={handleDeleteClick} />}
      <img className='galery__photo' src={card.link} alt={card.name} onClick={handleClick} />
      <div className='galery__card'>
        <h2 className='galery__title'>{card.name}</h2>
        <div className='galery__like'>
          <button className={cardLikeButtonClassName} type='button' aria-label='лайк' onClick={handleLikeClick} />
          <span className='galery__total-like' id='total-like'>
            {card.likes.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
