import {React, useRef} from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Сохранить"
      onSubmit={handleSubmit}
    >
      {
        <>
          <input
            className="popup__input"
            id="avatar_input"
            name="avatar"
            type="url"
            ref={avatarRef}
            placeholder="Ссылка на изображение"
            required
          />
          <span className="popup__input-span popup__input-span_error" id="avatar_input_error" />
        </>
      }
    </PopupWithForm>
  );
}
