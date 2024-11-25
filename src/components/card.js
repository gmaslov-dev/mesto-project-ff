function createCard(cardTemplate, title, src, deleteHandler, likeHandler, viewHandler) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const img = card.querySelector('.card__image');
  const deleteBtn = card.querySelector('.card__delete-button');
  const likeBtn = card.querySelector('.card__like-button');

  card.querySelector('.card__title').textContent = title;
  img.src = src;
  img.alt = title;

  img.addEventListener('click', viewHandler);
  deleteBtn.addEventListener('click', deleteHandler);
  likeBtn.addEventListener('click', likeHandler)

  return card;
}

function deleteCard(evt) {
  const card = evt.target.closest('.card');
  card.remove();
}

function likeCard (evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, likeCard };
