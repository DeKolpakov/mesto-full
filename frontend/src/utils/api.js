const BASE_URL = 'https://api.dekolpakov.nomoredomainsmonster.ru';
//const BASE_URL = 'http://localhost:3000';
class Api {
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка запроса: ${res.status}`);
  }

  //___PROFILE_________________________________________________________________________________

  getProfileInfo() {
    return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  editUserInfo(data) {
    return fetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._checkResponse);
  }

  //___AVATAR__________________________________________________________________________________

  editAvatar(data) {
    return fetch(`${BASE_URL}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._checkResponse);
  }

  //___CARD____________________________________________________________________________________

  getCards() {
    return fetch(`${BASE_URL}/cards`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  postCard(data) {
    return fetch(`${BASE_URL}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._checkResponse);
  }

  delCard(cardId) {
    return fetch(`${BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  //_________________________________________________________________________________________

  changeLikeCardStatus(cardId, isLiked) {
    const methodLike = isLiked ? 'PUT' : 'DELETE';
    return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: methodLike,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(this._checkResponse);
  }
}

const api = new Api(BASE_URL);

export default api;
