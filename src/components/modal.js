function openModal(element) {
  element.classList.add('popup_is-opened');
}

function closeModal(evt) {
  const popup = evt.target.closest('.popup');
  popup.classList.remove('popup_is-opened');
}

export { openModal, closeModal };