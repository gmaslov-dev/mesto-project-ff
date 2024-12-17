// Основные переменные api
const API_BASE_URL = 'https://nomoreparties.co';
const token = 'aa73eb14-67e0-49b7-b4c6-6839fe35bf10';
const cohortId = 'wff-cohort-29';

// Пути
const API_PATHS = {
  CARDS: {
    LIST: '/cards',
    SPECIFIC: (cardId) => `/cards/${cardId}`,
    LIKES: (cardId) => `/cards/likes/${cardId}`,
  },
  PROFILE: {
    DATA: '/users/me',
    AVATAR: '/users/me/avatar',
  },
};

// Методы
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// Основа для отправки запросов
async function fetchData(endpoint, method = 'GET', body = null) {
  const url = `${API_BASE_URL}/v1/${cohortId}${endpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Ошибка ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}

// Специфика по запросам
async function getInitialCards() {
  return fetchData(API_PATHS.CARDS.LIST);
}

async function getUserInfo() {
  return fetchData(API_PATHS.PROFILE.DATA);
}

async function updateProfile(name, about) {
  return fetchData(API_PATHS.PROFILE.DATA, HTTP_METHODS.PATCH, { name, about });
}

async function addCard(name, link) {
  return fetchData(API_PATHS.CARDS.LIST, HTTP_METHODS.POST, { name, link });
}

async function deleteCard(id) {
  return fetchData(API_PATHS.CARDS.SPECIFIC(id), HTTP_METHODS.DELETE);
}

async function addLike(id) {
  return fetchData(API_PATHS.CARDS.LIKES(id), HTTP_METHODS.PUT);
}

async function removeLike(id) {
  return fetchData(API_PATHS.CARDS.LIKES(id), HTTP_METHODS.DELETE);
}

async function updateAvatar(avatar) {
  return fetchData(API_PATHS.PROFILE.AVATAR, HTTP_METHODS.PATCH, { avatar });
}

export {
  getInitialCards,
  getUserInfo,
  updateProfile,
  addCard,
  deleteCard,
  addLike,
  removeLike,
  updateAvatar,
};
