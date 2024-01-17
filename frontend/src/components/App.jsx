import {React, useState, useEffect} from 'react';
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import Header from '../components/Header';
import Main from './Main';
import Footer from './Footer';

import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';

import api from '../utils/api';
import auth from '../utils/auth';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddImagePopupOpen, setIsAddImagePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [infoTooltipStatus, setInfoTooltipStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('_id');
    if (userId) {
      Promise.all([api.getProfileInfo(), api.getCards()])
        .then(([profileInfo, cards]) => {
          setCurrentUser(profileInfo);
          setCards(cards);
        })
        .catch((err) => {
          console.log(`Ошибка получения данных: ${err.message}`);
        });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const userId = localStorage.getItem('_id');
    if (userId) {
      auth
        .checkToken(userId)
        .then((res) => {
          setEmail(res.email);
          setIsLoggedIn(true);
          navigate('/', {replace: true});
        })
        .catch((err) => {
          console.log(`Ошибка верификации токена, ${err.message}`);
        });
    }
  }, [navigate]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddImagePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsAvatarPopupOpen(true);
  };

  function closeAllPopups() {
    setSelectedCard(null);
    setIsEditProfilePopupOpen(false);
    setIsAddImagePopupOpen(false);
    setIsAvatarPopupOpen(false);
    setTooltipOpen(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((id) => id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((item) => (item._id === card._id ? newCard : item)));
      })
      .catch((error) => {
        console.error('Ошибка добавления лайка: ', error);
      });
  }

  function handleCardDelete(card) {
    api
      .delCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch((error) => {
        console.error('Ошибка удаления карточки: ', error);
      });
  }

  function handleUpdateUser(userData) {
    api
      .editUserInfo(userData)
      .then((newUserData) => {
        setCurrentUser(newUserData);

        closeAllPopups();
      })
      .catch((error) => {
        console.error('Ошибка обнавления данных профиля:', error);
      });
  }

  function handleUpdateAvatar(data) {
    api
      .editAvatar(data)
      .then((newUserData) => {
        setCurrentUser(newUserData);

        closeAllPopups();
      })
      .catch((error) => {
        console.error('Ошибка обнавления аватара:', error);
      });
  }

  function handleAddPlaceSubmit(data) {
    api
      .postCard(data)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка добавления карточки: ${err}`);
      });
  }

  function handleLogout() {
    localStorage.removeItem('_id');
    setIsLoggedIn(false);
    setEmail('');
  }

  function handleLogin(email, password) {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res) {
          localStorage.setItem('_id', res._id);
          setIsLoggedIn(true);
          setEmail(email);
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(`Ошибка авторизации: ${err}`);
        setTooltipOpen(true);
        setInfoTooltipStatus(false);
      });
  }

  function handleRegistration(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setInfoTooltipStatus(true);
      })
      .catch((err) => {
        console.log(`Ошибка регистрации: ${err}`);
        setInfoTooltipStatus(false);
      })
      .finally(() => {
        setTooltipOpen(true);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header email={email} onLogout={handleLogout} />
      <Routes>
        <Route path='/signin' element={<Login handleLogin={handleLogin} />} />

        <Route path='/signup' element={<Register handleRegistration={handleRegistration} />} />

        <Route
          path='/'
          element={
            <ProtectedRoute
              element={Main}
              isLoggedIn={isLoggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />
          }
        />
        <Route path='/*' element={isLoggedIn ? <Navigate to='/' /> : <Navigate to='/signin' />} />
      </Routes>

      {isLoggedIn ? <Footer /> : ''}

      <InfoTooltip
        isOpen={tooltipOpen}
        onClose={closeAllPopups}
        isSuccess={infoTooltipStatus}
        registerError={'Что-то пошло не так! Попробуйте ещё раз.'}
        registerDone={'Вы успешно зарегистрировались!'}
      />

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

      <EditAvatarPopup isOpen={isAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

      <AddPlacePopup isOpen={isAddImagePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
    </CurrentUserContext.Provider>
  );
}

export default App;
