import './pages/index.css';

import { getData } from "./components/cardsData";
import { createCard, deleteCard } from "./components/card";

// template карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const cardContainer = document.querySelector('.places__list');


// Вывод карточек на страницу
getData().forEach(({name, link}) => {
  const card = createCard(cardTemplate ,name, link, deleteCard);
  cardContainer.append(card);
});
