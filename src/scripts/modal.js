function handleEscKeyUp(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");

    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

export function openModal(modal) {
  modal.classList.add("popup_is-opened");
  window.addEventListener("keydown", handleEscKeyUp);
}

export function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  window.removeEventListener("keydown", handleEscKeyUp);
}
