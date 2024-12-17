function handleError(error) {
  if (error.message === 'Недействительный URL изображения') {
    console.error('Ошибка: Недействительный URL изображения.');
  } else {
    console.error(`Произошла непредвиденная ошибка: ${error}`);
  }
}

function toggleButtonText(button, isLoading) {
  button.textContent = isLoading ? 'Сохранение...' : 'Сохранить';
}

function isValidImageUrl(url) {
  return fetch(url, { method: 'HEAD' })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}`);
      }
      const contentType = res.headers.get('Content-Type');
      return contentType && contentType.startsWith('image/');
    })
    .catch((err) => {
      console.error(`Произошла ошибка при проверке URL: ${err.message}`);
      return false;
    });
}

export { handleError, toggleButtonText, isValidImageUrl };
