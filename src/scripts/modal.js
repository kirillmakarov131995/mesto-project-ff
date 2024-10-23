const handleEscKeyUp = (event) => {
    if (event.key === "Escape") {
        const openedPopup = document.querySelector(".popup_is-opened");

        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
};

export const openModal = (modal) => {
    modal.classList.add("popup_is-opened");
    window.addEventListener("keydown", handleEscKeyUp);
};

export const closeModal = (modal) => {
    modal.classList.remove("popup_is-opened");
    window.removeEventListener("keydown", handleEscKeyUp);
};


export const handlePopup = (popupElement) => {
    const closeButton = popupElement.querySelector(".popup__close");
    closeButton.addEventListener("click", () => {
        closeModal(popupElement);
    });

    popupElement.addEventListener("mousedown", (event) => {
        if (event.target.classList.contains("popup")) {
            closeModal(popupElement);
        }
    });
}


