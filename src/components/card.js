import { addLike, removeLike } from './api';
import { handleError } from './utils/utilites';

function showDeleteBtn(card) {
  const deleteBtn = card.querySelector('.card__delete-button');
  deleteBtn.removeAttribute('hidden');
}

function isOwner(ownerId, cardId) {
  return ownerId === cardId;
}

function setDeleteButton(card, cardData, options) {
  if ((options.userId && isOwner(cardData.owner._id, options.userId)) || options.isNew) {
    showDeleteBtn(card);
  }
}

function setLikeButtom(likeBtn, cardData, options) {
  if (options.userId && cardData.likes.some((like) => options.userId === like._id)) {
    likeBtn.classList.add('card__like-button_is-active');
  }
}

function createCard(cardTemplate, cardData, options, handlers) {
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

  setDeleteButton(card, cardData, options);
  setLikeButtom(likeBtn, cardData, options);

  img.addEventListener('click', handlers.view);
  likeBtn.addEventListener('click', handlers.like);
  deleteBtn.addEventListener('click', handlers.delete);

  return card;
}

async function toggleLike(evt, isLiked) {
  const card = evt.target.closest('.card');
  const likeCount = card.querySelector('.card__like-count');
  const toggleLikeAPI = isLiked ? removeLike : addLike;

  try {
    const resCard = await toggleLikeAPI(card.dataset.id);
    likeCount.textContent = resCard.likes.length;
    evt.target.classList.toggle('card__like-button_is-active', !isLiked);
  } catch (err) {
    handleError(err);
  }
}

function handleLike(evt) {
  const isLiked = evt.target.classList.contains('card__like-button_is-active');
  toggleLike(evt, isLiked);
}

export { createCard, handleLike };
