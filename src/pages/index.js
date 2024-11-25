import './index.css';

import { getData } from '../components/cardsData';
import { createCard, deleteCard, likeCard } from '../components/card';
import { closeModal, openModal } from '../components/modal';

// DOM-узлы
const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');

// Профиль
const profile = document.querySelector('.profile');
const title = profile.querySelector('.profile__title');
const description = profile.querySelector('.profile__description');

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


// Функции
function renderCard(name, link, isNew=false) {
  const card = createCard(cardTemplate, name, link, deleteCard, likeCard, handleImageView);
  if (isNew) {
    cardContainer.prepend(card);
  } else {
    cardContainer.append(card);
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

function handleModalClose(evt) {
  const modal = evt.currentTarget;

  if (evt.target.classList.contains('popup__close') || evt.target === modal) {
    closeModal(modal);
  }
}

function handleFormSubmit(evt) {
  evt.preventDefault();

  const currentForm = evt.target;

  if (currentForm === formProfileEdit) {
    title.textContent = nameInput.value;
    description.textContent = jobInput.value;
    closeModal(modalProfileEdit);
  }

  if (currentForm === formMestoAdd) {
    renderCard(cardNameInput.value, cardLinkInput.value, true);
    closeModal(modalMestoAdd);
    currentForm.reset();
  }
}

// Вывод карточек на страницу
getData().forEach(({ name, link }) => renderCard(name, link));

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

  openModal(modalProfileEdit);
});

// Добавление карточки
btnMestoAdd.addEventListener('click', () => {
  openModal(modalMestoAdd);
});
