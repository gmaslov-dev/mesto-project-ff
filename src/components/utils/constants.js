const nodes = {
  cardTemplate: document.querySelector('#card-template').content,
  cardContainer: document.querySelector('.places__list'),
};

const profile = {
  container: document.querySelector('.profile'),
  avatar: document.querySelector('.profile__image'),
  title: document.querySelector('.profile__title'),
  description: document.querySelector('.profile__description'),
  
};

const buttons = {
  avatarEdit: document.querySelector('.profile__avatar-container'),
  profileEdit: document.querySelector('.profile__edit-button'),
  mestoAdd: document.querySelector('.profile__add-button'),
}

const modals = {
  all: document.querySelectorAll('.popup'),
  avatarEdit: document.querySelector('.popup_type_edit-avatar'),
  profileEdit: document.querySelector('.popup_type_edit'),
  mestoAdd: document.querySelector('.popup_type_new-card'),
  confirmDelete: document.querySelector('.popup_type_confirm-delete'),
  imageView: {
    container: document.querySelector('.popup_type_image'),
    picture: document.querySelector('.popup_type_image .popup__image'),
    caption: document.querySelector('.popup__caption'),
  },
};

const forms = {
  avatarUpdate: document.forms['edit-avatar'],
  profileEdit: document.forms['edit-profile'],
  mestoAdd: document.forms['new-place'],
  confirmDelete: document.forms['confirm-delete'],
  inputs: {
    avatarLink: document.forms['edit-avatar'].elements.link,
    name: document.forms['edit-profile'].elements.name,
    job: document.forms['edit-profile'].elements.description,
    cardName: document.forms['new-place'].elements['place-name'],
    cardLink: document.forms['new-place'].elements.link,
  },
};

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

export  { nodes, profile, buttons, modals, forms, validationSettings };
