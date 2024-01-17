import {React, useContext} from 'react';
import Card from './Card';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Main({onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete, cards}) {
  const userContext = useContext(CurrentUserContext);

  return (
    <main className='main'>
      <section className='profile'>
        <div className='profile__avatar'>
          <img className='profile__avatar-image' id='avatar-image' src={userContext.avatar} alt='Аватар' />
          <div className='profile__avatar-overlay'>
            <button className='profile__avatar-icon' type='button' onClick={onEditAvatar} aria-label='сменить аватар' />
          </div>
        </div>
        <div className='profile__info'>
          <h1 className='profile__name'>{userContext.name}</h1>
          <button
            className='profile__button-edit profile__button-open'
            type='button'
            onClick={onEditProfile}
            aria-label='изменить профиль'
          />
          <p className='profile__description'>{userContext.about}</p>
        </div>
        <button className='profile__button-add' type='button' onClick={onAddPlace} aria-label='добавить фото' />
      </section>

      <section className='galery'>
        {cards.map((card) => (
          <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />
        ))}
      </section>
    </main>
  );
}

export default Main;
