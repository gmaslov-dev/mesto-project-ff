import './index.css';

import { createCard, handleLike, showDeleteBtn } from '../components/card';
import { closeModal, openModal } from '../components/modal';
import { clearValidation, enableValidation } from '../components/validation';
import {
  getInitialCards,
  getUserInfo,
  updateProfile,
  addCard,
  updateAvatar,
  deleteCard,
} from '../components/api';
import {
  handleError,
  toggleButtonText,
  isValidImageUrl,
} from '../components/utilites';

// DOM-узлы
const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');

// Профиль
const profile = document.querySelector('.profile');
const avatar = profile.querySelector('.profile__image');
const title = profile.querySelector('.profile__title');
const description = profile.querySelector('.profile__description');

// Кнопки открытия модальных окон
const btnAvatarEdit = document.querySelector('.profile__avatar-container');
const btnProfileEdit = document.querySelector('.profile__edit-button');
const btnMestoAdd = document.querySelector('.profile__add-button');

// Модальные окна
const modalAvatarEdit = document.querySelector('.popup_type_edit-avatar');
const modalProfileEdit = document.querySelector('.popup_type_edit');
const modalMestoAdd = document.querySelector('.popup_type_new-card');
const modalConfirmDelete = document.querySelector('.popup_type_confirm-delete');

const modalImageView = document.querySelector('.popup_type_image');
const modalImageViewPicture = modalImageView.querySelector('.popup__image');
const modalImageViewCaption = document.querySelector('.popup__caption');

// Формы
const formAvatarUpdate = document.forms['edit-avatar'];
const avatarLinkInput = formAvatarUpdate.elements.link;

const formProfileEdit = document.forms['edit-profile'];
const nameInput = formProfileEdit.elements.name;
const jobInput = formProfileEdit.elements.description;

const formMestoAdd = document.forms['new-place'];
const cardNameInput = formMestoAdd.elements['place-name'];
const cardLinkInput = formMestoAdd.elements.link;

const formConfimDelete = document.forms['confirm-delete'];

// Настройки валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// Функции
function setProfileText(newTitle, newDescription) {
  title.textContent = newTitle;
  description.textContent = newDescription;
}

function setProfileAvatar(src) {
  avatar.src = src;
}

function isOwner(ownerId, cardId) {
  return ownerId === cardId;
}

function resetAndClearForm(form, settings) {
  form.reset();
  clearValidation(form, settings);
}

function renderCard(cardData, userId = null, isNew = false) {
  const card = createCard(cardTemplate, cardData, {
    delete: handleDelete,
    like: handleLike,
    view: handleImageView,
  });

  // Показать кнопку удаления, если пользователь — владелец или карточка новая (созданая пользователем)
  if ((userId && isOwner(cardData.owner._id, userId)) || isNew) {
    showDeleteBtn(card);
  }

  // Установить состояние кнопки лайка, если есть лайк от пользователя
  if (userId && cardData.likes.some((like) => userId === like._id)) {
    const likeBtn = card.querySelector('.card__like-button');
    likeBtn.classList.add('card__like-button_is-active');
  }

  if (isNew) {
    cardContainer.prepend(card);
  } else {
    cardContainer.append(card);
  }
}

async function loadContent() {
  try {
    const [resProfile, resData] = await Promise.all([
      getUserInfo(),
      getInitialCards(),
    ]);
    setProfileText(resProfile.name, resProfile.about);
    setProfileAvatar(resProfile.avatar);
    resData.forEach((cardData) => renderCard(cardData, resProfile._id));
  } catch (err) {
    handleError(err);
  }
}

// Обработчики
function handleImageView(evt) {
  const currentImg = evt.target;
  modalImageViewPicture.src = currentImg.src;
  modalImageViewPicture.alt = currentImg.alt;
  modalImageViewCaption.textContent = currentImg.alt;
  openModal(modalImageView);
}

function handleDelete(evt) {
  const currentCard = evt.target.closest('.card');
  const id = currentCard.dataset.id;
  formConfimDelete.dataset.id = id;
  openModal(modalConfirmDelete);
}

function handleModalClose(evt) {
  const modal = evt.currentTarget;

  if (!modal.classList.contains('popup_type_image')) {
    const form = modal.querySelector('.popup__form');
    clearValidation(form, validationSettings);
  }

  if (evt.target.classList.contains('popup__close') || evt.target === modal) {
    closeModal(modal);
  }
}

async function handleAvatarUpdateSubmit(evt) {
  evt.preventDefault();
  const btnSubmit = evt.target.querySelector('.popup__button');
  toggleButtonText(btnSubmit, true);
  const linkLink = avatarLinkInput.value;

  try {
    const isValid = await isValidImageUrl(linkLink);
    if (!isValid) {
      throw new Error('Недействительный URL изображения');
    }
    const resAvatar = await updateAvatar(linkLink);
    setProfileAvatar(resAvatar.avatar);
  } catch (err) {
    handleError(err);
  } finally {
    closeModal(modalAvatarEdit);
    toggleButtonText(btnSubmit, false);
    resetAndClearForm(formAvatarUpdate, validationSettings);
  }
}

async function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const btnSubmit = evt.target.querySelector('.popup__button');
  toggleButtonText(btnSubmit, true);

  try {
    const resProfile = await updateProfile(nameInput.value, jobInput.value);
    setProfileText(resProfile.name, resProfile.about);
  } catch (err) {
    handleError(err);
  } finally {
    closeModal(modalProfileEdit);
    toggleButtonText(btnSubmit, false);
  }
}

async function handleMestoFormSubmit(evt) {
  evt.preventDefault();
  const btnSubmit = evt.target.querySelector('.popup__button');
  toggleButtonText(btnSubmit, true);
  const cardName = cardNameInput.value;
  const cardLink = cardLinkInput.value;

  try {
    const isValid = await isValidImageUrl(cardLink);
    if (!isValid) {
      throw new Error('Недействительный URL изображения');
    }
    const resCard = await addCard(cardName, cardLink);
    renderCard(resCard, null, true);
  } catch (err) {
    handleError(err);
  } finally {
    closeModal(modalMestoAdd);
    toggleButtonText(btnSubmit, false);
    resetAndClearForm(formMestoAdd, validationSettings);
  }
}

async function handleConfirmDeleteFormSumbit(evt) {
  evt.preventDefault();
  const btnSubmit = evt.target.querySelector('.popup__button');
  toggleButtonText(btnSubmit, true);
  const id = formConfimDelete.dataset.id;
  const card = cardContainer.querySelector(`[data-id="${id}"]`);

  try {
    await deleteCard(id);
    card.remove();
  } catch (err) {
    handleError(err);
  } finally {
    toggleButtonText(btnSubmit, false);
    closeModal(modalConfirmDelete);
  }
}

// Установка обработчиков закрытия модального окна
modalProfileEdit.addEventListener('click', handleModalClose);
modalMestoAdd.addEventListener('click', handleModalClose);
modalImageView.addEventListener('click', handleModalClose);
modalAvatarEdit.addEventListener('click', handleModalClose);
modalConfirmDelete.addEventListener('click', handleModalClose);

// Установка обработчиков отправки форм
formAvatarUpdate.addEventListener('submit', handleAvatarUpdateSubmit);
formProfileEdit.addEventListener('submit', handleProfileFormSubmit);
formMestoAdd.addEventListener('submit', handleMestoFormSubmit);
modalConfirmDelete.addEventListener('submit', handleConfirmDeleteFormSumbit);

// Установка обработчиков открытия модальных окон
btnAvatarEdit.addEventListener('click', () => {
  openModal(modalAvatarEdit);
});

btnProfileEdit.addEventListener('click', () => {
  nameInput.value = title.textContent;
  jobInput.value = description.textContent;
  clearValidation(formProfileEdit, validationSettings);
  openModal(modalProfileEdit);
});

btnMestoAdd.addEventListener('click', () => {
  openModal(modalMestoAdd);
});

// Загружаем контент
loadContent();

// Включаем
enableValidation(validationSettings);
