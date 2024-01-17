import {React, useEffect, useState} from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({isOpen, onClose, onAddPlace}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlace({
      name,
      link,
    });
  };

  useEffect(() => {
    if (isOpen) {
      setName("");
      setLink("");
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      name="addimage"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Создать"
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input"
        id="image-name"
        name="name"
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Название"
        required
        minLength="2"
        maxLength="30"
      />
      <span className="popup__input-span popup__input-span_error" id="image-name_error" />
      <input
        className="popup__input"
        id="image-link"
        name="link"
        type="url"
        value={link}
        onChange={handleLinkChange}
        placeholder="Ссылка на картинку"
        required
      />
      <span className="popup__input-span popup__input-span_error" id="image-link_error" />
    </PopupWithForm>
  );
}
