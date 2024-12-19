import './index.css';

import {
  nodes,
  profile,
  buttons,
  modals,
  forms,
  validationSettings,
} from '../components/utils/constants';
import { createCard, handleLike } from '../components/card';
import { closeModal, openModal, handleModalClose } from '../components/modal';
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
  handleSubmit,
  isValidImageUrl,
} from '../components/utils/utilites';

// Функции
function setProfileText(newTitle, newDescription) {
  profile.title.textContent = newTitle;
  profile.description.textContent = newDescription;
}

function setProfileAvatar(src) {
  profile.avatar.src = src;
}

function renderCard(cardData, userId = null, isNew = false) {
  const card = createCard(
    nodes.cardTemplate,
    cardData,
    {
      userId,
      isNew,
    },
    {
      delete: handleDelete,
      like: handleLike,
      view: handleImageView,
    }
  );

  if (isNew) {
    nodes.cardContainer.prepend(card);
  } else {
    nodes.cardContainer.append(card);
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
  modals.imageView.picture.src = currentImg.src;
  modals.imageView.picture.alt = currentImg.alt;
  modals.imageView.caption.textContent = currentImg.alt;
  openModal(modals.imageView.container);
}

function handleDelete(evt) {
  const currentCard = evt.target.closest('.card');
  const id = currentCard.dataset.id;
  forms.confirmDelete.dataset.id = id;
  openModal(modals.confirmDelete);
}

async function handleAvatarUpdateSubmit(evt) {
  async function makeRequest() {
    const url = forms.inputs.avatarLink.value;
    await isValidImageUrl(url);
    const resAvatar = await updateAvatar(url);
    setProfileAvatar(resAvatar.avatar);
    closeModal(modals.avatarEdit);
  }

  handleSubmit(makeRequest, evt);
}

async function handleProfileFormSubmit(evt) {
  async function makeRequest() {
    const resUserData = await updateProfile(
      forms.inputs.name.value,
      forms.inputs.job.value
    );
    setProfileText(resUserData.name, resUserData.about);
    closeModal(modals.profileEdit);
  }

  handleSubmit(makeRequest, evt);
}

async function handleMestoFormSubmit(evt) {
  async function makeRequest() {
    const url = forms.inputs.cardLink.value;
    await isValidImageUrl(url);
    const resCard = await addCard(forms.inputs.cardName.value, url);
    renderCard(resCard, null, true);
    closeModal(modals.mestoAdd);
  }

  handleSubmit(makeRequest, evt);
}

async function handleConfirmDeleteFormSumbit(evt) {
  async function makeRequest() {
    const id = forms.confirmDelete.dataset.id;
    const card = nodes.cardContainer.querySelector(`[data-id="${id}"]`);
    await deleteCard(id);
    card.remove();
    closeModal(modals.confirmDelete);
  }

  handleSubmit(makeRequest, evt, 'Удаление...');
}

// Установка обработчиков
modals.all.forEach((modal) => {
  modal.addEventListener('mousedown', handleModalClose);
});

forms.avatarUpdate.addEventListener('submit', handleAvatarUpdateSubmit);
forms.profileEdit.addEventListener('submit', handleProfileFormSubmit);
forms.mestoAdd.addEventListener('submit', handleMestoFormSubmit);
forms.confirmDelete.addEventListener('submit', handleConfirmDeleteFormSumbit);

buttons.avatarEdit.addEventListener('click', () => {
  openModal(modals.avatarEdit);
});

buttons.profileEdit.addEventListener('click', () => {
  forms.inputs.name.value = profile.title.textContent;
  forms.inputs.job.value = profile.description.textContent;
  clearValidation(forms.profileEdit, validationSettings);
  openModal(modals.profileEdit);
});

buttons.mestoAdd.addEventListener('click', () => {
  clearValidation(forms.mestoAdd, validationSettings);
  openModal(modals.mestoAdd);
});

// Загружаем контент
loadContent();

// Включаем валидацию
enableValidation(validationSettings);
