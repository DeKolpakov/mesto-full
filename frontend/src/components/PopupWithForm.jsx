import React from 'react';

function PopupWithForm({name, title, isOpen, onClose, buttonText, onSubmit, children}) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}>
      <div className={`popup__container popup__container_type_${name}`}>
        <h2 className='popup__title'>{title}</h2>
        <button className='popup__button-close' type='button' onClick={onClose} aria-label='закрыть окно' />

        <form
          className={`popup__form popup__form_type_${name}`}
          id={`${name}-form`}
          name={`${name}-form`}
          noValidate
          method='post'
          onSubmit={onSubmit}
        >
          {children}

          <button
            className={`popup__button-save popup__button-save_type_${name}`}
            id={`submit-button-${name}`}
            type='submit'
            aria-label='Подтверждение'
            //disabled
          >
            {buttonText || 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
