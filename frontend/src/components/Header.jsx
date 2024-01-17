import {Link, Routes, Route} from "react-router-dom";
import headerLogo from "../images/logo/logo.svg";

function Header({email, onLogout}) {
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип" />
      <div className="header__auth">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <p className="header__email">{email}</p>
                <Link to="/signin" className="header__link" onClick={onLogout}>
                  Выйти
                </Link>
              </>
            }
          />

          <Route
            path="/signin"
            element={
              <Link to="/signup" className="header__link">
                Регистрация
              </Link>
            }
          />

          <Route
            path="/signup"
            element={
              <Link to="/signin" className="header__link">
                Войти
              </Link>
            }
          />
        </Routes>
      </div>
    </header>
  );
}

export default Header;
