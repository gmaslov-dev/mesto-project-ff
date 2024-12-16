import { deleteCard, addLike, removeLike } from "./api";

function createCard(cardTemplate, cardData, handlers) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const img = card.querySelector('.card__image');
  const deleteBtn = card.querySelector('.card__delete-button');
  const likeBtn = card.querySelector('.card__like-button');
  const likeCount = card.querySelector('.card__like-count');

  card.querySelector('.card__title').textContent = cardData.name;
  img.alt = cardData.name;
  img.src = cardData.link;
  card.dataset.id = cardData._id;
  likeCount.textContent = cardData.likes.length;

  img.addEventListener('click', handlers.view);
  deleteBtn.addEventListener('click', handlers.delete);
  likeBtn.addEventListener('click', handlers.like);

  return card;
}

function handleDelete(evt) {
  const card = evt.target.closest('.card');
  const id = card.dataset.id;
  deleteCard(id)
    .then(() => card.remove())
    .catch(err => console.log(err));
}

function toggleLike(evt, isLiked) {
  const card = evt.target.closest('.card');
  const likeCount = card.querySelector('.card__like-count');
  const toggleLikeAPI = isLiked ? removeLike : addLike;

  toggleLikeAPI(card.dataset.id)
    .then((resCard) => {
      likeCount.textContent = resCard.likes.length;
      evt.target.classList.toggle('card__like-button_is-active', !isLiked);
    })
    .catch(err => console.log(err));
}

function handleLike(evt) {
  const isLiked = evt.target.classList.contains('card__like-button_is-active');
  toggleLike(evt, isLiked);
}

function showDeleteBtn(card) {
  const deleteBtn = card.querySelector('.card__delete-button');
  deleteBtn.removeAttribute('hidden');
}

export { createCard, handleDelete, handleLike, showDeleteBtn };
