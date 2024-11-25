import './index.css';

import { getData } from '../components/cardsData';
import { createCard, deleteCard } from '../components/card';
import { closeModal, openModal } from '../components/modal';

// DOM узлы
const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');

// кнопки
const btnProfileEdit = document.querySelector('.profile__edit-button');
const btnMestoAdd = document.querySelector('.profile__add-button');

// модальные окна
const modalProfileEdit = document.querySelector('.popup_type_edit');
const modalMestoAdd = document.querySelector('.popup_type_new-card');
const modalImage = document.querySelector('.popup_type_image');

// формы
const formProfileEdit = document.forms['edit-profile'];
const formMestoAdd = document.forms['new-place'];
console.log(formProfileEdit);

// обработчики событий
function handleCloseBtnClick(evt) {
  const popup = evt.currentTarget;
  
  if (evt.target === popup) {
    document.removeEventListener('keydown', handleEscapeKeydown);
    closeModal(popup);
  }
}

function handleOverlayClick(evt) {
  const popup = evt.currentTarget;

  if (evt.target.classList.contains('popup__close')) {
    document.removeEventListener('keydown', handleEscapeKeydown);
    closeModal(popup);
  }
}

function handleEscapeKeydown(evt) {
  const popup = document.querySelector('.popup_is-opened');

  if (evt.key === 'Escape') {
    document.removeEventListener('keydown', handleEscapeKeydown);
    closeModal(popup);
  }
}

function handleFormSubmit(evt) {

}

// Вывод карточек на страницу
getData().forEach(({name, link}) => {
  const card = createCard(cardTemplate ,name, link, deleteCard);
  cardContainer.append(card);
});


// можальные окна

// редактирование профиля
btnProfileEdit.addEventListener('click', () => {
  const profile = document.querySelector('.profile');
  const title = profile.querySelector('.profile__title');
  const description = profile.querySelector('.profile__description');

  formProfileEdit.elements.name.value = title.textContent;
  formProfileEdit.elements.description.value = description.textContent;

  openModal(modalProfileEdit);
  modalProfileEdit.addEventListener('click', handleCloseBtnClick);
  modalProfileEdit.addEventListener('click', handleOverlayClick);
  document.addEventListener('keydown', handleEscapeKeydown);
});

// добавление карточки
btnMestoAdd.addEventListener('click', () => {
  openModal(modalMestoAdd);
  modalMestoAdd.addEventListener('click', handleCloseBtnClick);
  modalMestoAdd.addEventListener('click', handleOverlayClick);
  document.addEventListener('keydown', handleEscapeKeydown);
});

// просмотр изображения
cardContainer.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('card__image')) {
    const currentImg = evt.target;
    const modalImg = modalImage.querySelector('.popup__image');
    modalImg.src = currentImg.src;
    modalImg.alt = currentImg.alt;
    openModal(modalImage);
    modalImage.addEventListener('click', handleCloseBtnClick);
    modalImage.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleEscapeKeydown);
  }
});
