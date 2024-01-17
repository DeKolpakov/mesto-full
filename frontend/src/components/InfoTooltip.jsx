import React from "react";
import tooltipOk from "../images/icons/tooltip-ok.svg";
import tooltipError from "../images/icons/tooltip-error.svg";

function InfoTooltip({isOpen, onClose, isSuccess, registerError, registerDone}) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container popup__container_type_tooltipe">
        <button
          className="popup__button-close"
          type="button"
          onClick={onClose}
          aria-label="закрыть окно"
        />
        <img
          className="popup__tooltip-image"
          src={isSuccess ? tooltipOk : tooltipError}
          alt={isSuccess ? "Галочка" : "Крестик"}
        />
        <h2 className="popup__title">{isSuccess ? registerDone : registerError}</h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
