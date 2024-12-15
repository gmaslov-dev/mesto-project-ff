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
const btnProfileEdit = document.querySelector('.profile__edit-button');
const btnMestoAdd = document.querySelector('.profile__add-button');

// Модальные окна
const modalProfileEdit = document.querySelector('.popup_type_edit');
const modalMestoAdd = document.querySelector('.popup_type_new-card');

const modalImageView = document.querySelector('.popup_type_image');
const modalImageViewPicture = modalImageView.querySelector('.popup__image');
const modalImageViewCaption = document.querySelector('.popup__caption');

// Формы
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
function renderCard(cardData, props={userId: null, isNew: false}) {
  const card = createCard(cardTemplate, cardData, {delete: handleDelete, like: handleLike, view: handleImageView});
  if(props.userId && isOwner(cardData.owner._id, props.userId) || props.isNew) {
    showDeleteBtn(card);
  }

  if (props.isNew) {
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

function handleFormSubmit(evt) {
  evt.preventDefault();

  const currentForm = evt.target;

  if (currentForm === formProfileEdit) {
    updateProfile(nameInput.value, jobInput.value)
      .then((resProfile) => setProfileText(resProfile.name, resProfile.about));
    closeModal(modalProfileEdit);
  }

  if (currentForm === formMestoAdd) {
    addCard(cardNameInput.value, cardLinkInput.value)
      .then((resCard) => renderCard(resCard, {isNew: true}))
      .catch((err) => console.log(err))
      .finally(closeModal(modalMestoAdd));

    currentForm.reset();
    clearValidation(currentForm, validationSettings);
  }
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
    resData.forEach((cardData) => renderCard(cardData, {userId: resProfile._id}));
  })
  .catch((err) => console.log(err));

// Обработчики
modalProfileEdit.addEventListener('click', handleModalClose);
modalMestoAdd.addEventListener('click', handleModalClose);
modalImageView.addEventListener('click', handleModalClose);

// Обработчики форм
formProfileEdit.addEventListener('submit', handleFormSubmit);
formMestoAdd.addEventListener('submit', handleFormSubmit);


// Обработчики модальных окон
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


// Удаление лайка
// fetchData(apiEndpoint.CARDS.LIKES('675b2d412ea9d60bd1324a1e'), httpMethod.DELETE)
//   .then((res) => console.log(res));

// постановка лайка
// fetchData(apiEndpoint.CARDS.LIKES('675b2d412ea9d60bd1324a1e'), httpMethod.PUT)
//   .then((res) => console.log(res));

// Удаление карточки
// fetchData(apiEndpoint.CARDS.SPECIFIC(cardId), httpMethod.DELETE)
//   .then((res) => console.log(res));
