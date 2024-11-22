/*

В файле index.js должны остаться:
объявления и инициализация глобальных констант и переменных с 
DOM-элементами страницы,

обработчики событий (при открытии и закрытии попапов; 
при отправке форм; обработчик, открывающий попап при клике 
по изображению карточки);

вызовы других функций, подключённых из созданных модулей, 
которым нужно будет передавать объявленные здесь переменные и 
обработчики.
*/



import './pages/index.css';

import { getData } from './components/cardsData';
import { createCard, deleteCard } from './components/card';
import { closeModal, openModal } from './components/modal';

// DOM узлы
const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');

// модальные окна
const editBtn = document.querySelector('.profile__edit-button');
const editPopup = document.querySelector('.popup_type_edit');

const addBtn = document.querySelector('.profile__add-button');
const addPopup = document.querySelector('.popup_type_new-card');

const imgPopup = document.querySelector('.popup_type_image');

// Вывод карточек на страницу
getData().forEach(({name, link}) => {
  const card = createCard(cardTemplate ,name, link, deleteCard);
  cardContainer.append(card);
});

// попапы
// TODO передавать слушатель закртия попапа
editBtn.addEventListener('click', () => {
  const closeBtn = editPopup.querySelector('.popup__close');
  openModal(editPopup);
  closeBtn.addEventListener('click', closeModal);
});

addBtn.addEventListener('click', () => {
  openModal(addPopup);
  closeBtn.addEventListener('click', closeModal);
});


cardContainer.addEventListener('click', (evt) => {
  console.log(evt);

  openModal(imgPopup);

  // подставлять данные карточки в попап!
});