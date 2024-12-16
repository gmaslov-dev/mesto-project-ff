import './index.css';

import { createCard, handleLike, handleDelete, showDeleteBtn } from '../components/card';
import { closeModal, openModal } from '../components/modal';
import { clearValidation, enableValidation } from '../components/validation';
import { getInitialCards, getUserInfo, updateProfile, addCard } from '../components/api';

// DOM-узлы
const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');

// Профиль
const profile = document.querySelector('.profile');
const title = profile.querySelector('.profile__title');
const description = profile.querySelector('.profile__description');
const avatar = profile.querySelector('.profile__image');

// Кнопки
const btnAvatarEdit = document.querySelector('.profile__avatar-container');
const btnProfileEdit = document.querySelector('.profile__edit-button');
const btnMestoAdd = document.querySelector('.profile__add-button');

// Модальные окна
const modalAvatarEdit = document.querySelector('.popup_type_edit-avatar');
const modalProfileEdit = document.querySelector('.popup_type_edit');
const modalMestoAdd = document.querySelector('.popup_type_new-card');

const modalImageView = document.querySelector('.popup_type_image');
const modalImageViewPicture = modalImageView.querySelector('.popup__image');
const modalImageViewCaption = document.querySelector('.popup__caption');

// Формы
const formAvatarUpdate = document.forms['edit-avatar'];
//TODO наименование ссылок проверить
const avatarLink = formAvatarUpdate.link;

const formProfileEdit = document.forms['edit-profile'];
const nameInput = formProfileEdit.elements.name;
const jobInput = formProfileEdit.elements.description;

const formMestoAdd = document.forms['new-place'];
const cardNameInput = formMestoAdd.elements['place-name'];
const cardLinkInput = formMestoAdd.elements.link;

// Настройки валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Функции
function renderCard(cardData, userId=null, isNew=false) {
  const card = createCard(cardTemplate, cardData, {
    delete: handleDelete,
    like: handleLike,
    view: handleImageView
  });

  // Показать кнопку удаления, если пользователь — владелец или карточка новая
  if(userId && isOwner(cardData.owner._id, userId) || isNew) {
    showDeleteBtn(card);
  }

  // Установить состояние кнопки лайка, если есть лайк от пользователя
  if(userId && cardData.likes.some((like) => userId === like._id)) {
    card.querySelector('.card__like-button').classList.add('card__like-button_is-active');
  }

  

  if (isNew) {
    cardContainer.prepend(card);
  } else {
    cardContainer.append(card);
  }
}

function setProfileText(newTitle, newDescription) {
  title.textContent = newTitle;
  description.textContent = newDescription;
}

function setProfileAvatar(src) {
  avatar.src = src;
};

// Обработчики
function handleImageView(evt) {
  const currentImg = evt.target;

    modalImageViewPicture.src = currentImg.src;
    modalImageViewPicture.alt = currentImg.alt;
    modalImageViewCaption.textContent = currentImg.alt;

    openModal(modalImageView);
}

function handleModalClose(evt) {
  const modal = evt.currentTarget;

  if (!modal.classList.contains('popup_type_image')) {
    clearValidation(modal.querySelector('.popup__form'), validationSettings);
  }

  if (evt.target.classList.contains('popup__close') || evt.target === modal) {
    closeModal(modal);
  }
}

function handleAvatarUpdateSubmit(evt) {
  evt.preventDefault();
  console.log('submit');
//updateAvatar()
  /*
  closeModal(modalMestoAdd);
  formMestoAdd.reset();
  clearValidation(formMestoAdd, validationSettings);
  */
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  updateProfile(nameInput.value, jobInput.value)
    .then((resProfile) => setProfileText(resProfile.name, resProfile.about))
    .catch(console.log)
    .finally(() => closeModal(modalProfileEdit));
}

function handleMestoFormSubmit(evt) {
  evt.preventDefault();
  addCard(cardNameInput.value, cardLinkInput.value)
    .then((resCard) => renderCard(resCard, null, true))
    .catch(console.log)
    .finally(() => {
      closeModal(modalMestoAdd);
      formMestoAdd.reset();
      clearValidation(formMestoAdd, validationSettings);
    });
}

// Проверка что владелец
function isOwner(ownerId, cardId) {
  return ownerId === cardId;
}

// Вывод карточек на страницу
Promise.all([getUserInfo(), getInitialCards()])
  .then(([resProfile, resData]) => {
    // Выводим информацию о профиле
    setProfileText(resProfile.name, resProfile.about);
    setProfileAvatar(resProfile.avatar);

    // Выводим карточки на страницу
    resData.forEach((cardData) => renderCard(cardData, resProfile._id));
  })
  .catch((err) => console.log(err));

// Обработчики
modalProfileEdit.addEventListener('click', handleModalClose);
modalMestoAdd.addEventListener('click', handleModalClose);
modalImageView.addEventListener('click', handleModalClose);
modalAvatarEdit.addEventListener('click', handleModalClose);

// Обработчики форм
formAvatarUpdate.addEventListener('submit', handleAvatarUpdateSubmit);
formProfileEdit.addEventListener('submit', handleProfileFormSubmit);
formMestoAdd.addEventListener('submit', handleMestoFormSubmit);


// Обработчики модальных окон
btnAvatarEdit.addEventListener('click', () => {
  console.log(1);
  openModal(modalAvatarEdit);
  console.log(avatarLink);
});

btnProfileEdit.addEventListener('click', () => {
  nameInput.value = title.textContent;
  jobInput.value = description.textContent;
  clearValidation(formProfileEdit, validationSettings);
  openModal(modalProfileEdit);
});

// Добавление карточки
btnMestoAdd.addEventListener('click', () => {
  openModal(modalMestoAdd);
});

// Включение валидации форм
enableValidation(validationSettings);
