// Основные переменные api
const API_BASE_URL = 'https://nomoreparties.co';
const token = 'aa73eb14-67e0-49b7-b4c6-6839fe35bf10';
const cohortId = 'wff-cohort-29';

// Пути 
const apiEndpoint = {
  CARDS: {
    LIST: '/cards',
    SPECIFIC: (cardId) => `/cards/${cardId}`,
    LIKES: (cardId) => `/cards/likes/${cardId}`
  },
  PROFILE: {
    DATA: '/users/me',
    AVATAR: '/users/me/avatar',
  }
};

// Методы
const httpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

function fetchData (endpoint, method='GET', body=null) {
  const url = `${API_BASE_URL}/v1/${cohortId}${endpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options)
    .then((res) => {
      if(!res.ok) {
        throw Promise.reject(`Ошибка ${res.status}`);
      }
      return res.json();
    });
};

const getInitialCards = () => {
  return fetchData(apiEndpoint.CARDS.LIST);
};

const getUserInfo = () => {
  return fetchData(apiEndpoint.PROFILE.DATA);
}

function updateProfile (name, about) {
  return fetchData(apiEndpoint.PROFILE.DATA, httpMethod.PATCH, {name, about});
}

function addCard(name, link) {
  return fetchData(apiEndpoint.CARDS.LIST, httpMethod.POST, {name, link});
}

function deleteCard(id) {
  return fetchData(apiEndpoint.CARDS.SPECIFIC(id), httpMethod.DELETE);
}

export { getInitialCards, getUserInfo, updateProfile, addCard, deleteCard };