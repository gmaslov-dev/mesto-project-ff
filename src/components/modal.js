function handleEscapeKeydown(evt) {
  if (evt.key === 'Escape') {
    const openModal = document.querySelector('.popup_is-opened');
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function handleModalClose(evt) {
  const modal = evt.currentTarget;

  if (evt.target.classList.contains('popup__close') || evt.target === modal) {
    closeModal(modal);
  }
}

function openModal(modal) {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscapeKeydown);
}

function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscapeKeydown);
}

export { openModal, closeModal, handleModalClose };
