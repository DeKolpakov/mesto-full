import React, {useState} from "react";
import {Link} from "react-router-dom";

function Register({isOpen, onClose, handleRegistration, isSuccess}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleRegistration(email, password);
  };

  return (
    <>
      <div className="auth">
        <h2 className="auth__title">Регистрация</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
          <input
            className="auth__input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            className="auth__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button className="auth__button" type="submit">
            Зарегистрироваться
          </button>
        </form>
        <div className="auth__description">
          <p className="auth__description-text">Уже зарегистрированы?</p>
          <Link to="/signin" className="auth__description-link">
            {" "}
            Войти
          </Link>
        </div>
      </div>
    </>
  );
}

export default Register;
