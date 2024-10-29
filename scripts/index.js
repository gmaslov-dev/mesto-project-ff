// template карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const cardContainer = document.querySelector('.places__list');

// Функция создания карточки
function createCard(title, src, deleteHandler) {
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
  const card = evt.target.closest('.card'); // @todo: Выбрать карточку
  card.remove();
}

// Вывод карточек на страницу
initialCards.forEach(({name, link}) => {
  const card = createCard(name, link, deleteCard);
  cardContainer.append(card);
});
