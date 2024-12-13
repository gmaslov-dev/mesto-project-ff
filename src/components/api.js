const API_BASE_URL = 'https://nomoreparties.co';

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

const httpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

const createApiRequest = (cohortId, token) => {
  const basePath = `${API_BASE_URL}/v1/${cohortId}`;

  // универсальная функция выполнения запросов
  return (endpoint, method='GET', body=null) => {
    const url = `${basePath}${endpoint}`;

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
};


export { createApiRequest, apiEndpoint, httpMethod };
