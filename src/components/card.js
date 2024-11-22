// Функция создания карточки
function createCard(cardTemplate, title, src, deleteHandler) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const img = card.querySelector('.card__image');
  const deleteBtn = card.querySelector('.card__delete-button');

  card.querySelector('.card__title').textContent = title;
  img.src = src;
  img.alt = title;
  deleteBtn.addEventListener('click', deleteHandler);

  return card;
}

// Функция удаления карточки
function deleteCard(evt) {
  const card = evt.target.closest('.card');
  card.remove();
}

export { createCard, deleteCard };