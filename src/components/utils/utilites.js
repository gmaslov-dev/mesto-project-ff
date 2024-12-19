function handleError(error) {
  if (error.message === 'Недействительный URL изображения') {
    console.error('Ошибка: Недействительный URL изображения.');
  } else {
    console.error(`Произошла непредвиденная ошибка: ${error}`);
  }
}

function renderLoading(isLoading, button, buttonText='Сохранить', loadingText='Сохранение...') {
  if (isLoading) {
    button.textContent = loadingText
  } else {
    button.textContent = buttonText
  }
}

async function handleSubmit(request, evt, loadingText='Сохранение...') {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  const initialText = submitBtn.textContent;

  renderLoading(true, submitBtn, initialText, loadingText);

  try {
    await request();
    evt.target.reset();
  } catch (err) {
    handleError(err);
  } finally {
    renderLoading(false, submitBtn, initialText);
  }
}

function validateImageUrl(url) {
  return fetch(url, { method: 'HEAD' })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}`);
      }
      const contentType = res.headers.get('Content-Type');
      return contentType && contentType.startsWith('image/');
    })
    .catch((err) => {
      handleError(err);
      return false;
    });
}

async function isValidImageUrl(url) {
  const isValid = await validateImageUrl(url);
  if (!isValid) {
    throw new Error('Недействительный URL изображения');
  }
}

export { handleError, handleSubmit, isValidImageUrl };
