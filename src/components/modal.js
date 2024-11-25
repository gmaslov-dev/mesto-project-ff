function openModal(element) {
  element.classList.add('popup_is-opened');
}

function closeModal(element) {
  element.classList.remove('popup_is-opened');
}

export { openModal, closeModal };