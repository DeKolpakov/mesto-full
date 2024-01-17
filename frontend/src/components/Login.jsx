import React, {useState} from "react";

function Login({isOpen, onClose, handleLogin, isSuccess}) {
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
    handleLogin(email, password);
  };

  return (
    <>
      <div className="auth">
        <h2 className="auth__title">Вход</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
          <input
            className="auth__input"
            type="email"
            placeholder="Email"
            value={email || ""}
            onChange={handleEmailChange}
          />
          <input
            className="auth__input"
            type="password"
            placeholder="Password"
            value={password || ""}
            onChange={handlePasswordChange}
          />
          <button className="auth__button" type="submit">
            Войти
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
