import '../pages/index.css'; // добавьте импорт главного файла стилей 

import { openModal, closeModal, handlePopup } from "./modal.js";
import { renderCards, createCard, setContainers } from "./card.js";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardsContainer = document.querySelector('.places__list');

setContainers(cardTemplate, cardsContainer);

// initial render of all cards
renderCards();



// SPRINT 6
// 3. Работа модальных окон

const popupEdit = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");

// set handlers to the popups
handlePopup(popupEdit)
handlePopup(popupNewCard)
handlePopup(popupImage)


// set edid button event listener and its form variable
const editButton = document.querySelector(".profile__edit-button");
const popupEditForm = popupEdit.querySelector(".popup__form");

editButton.addEventListener("click", (event) => {
    function editHandler(event) {
        event.preventDefault();

        nameElement.textContent = popupNameInput.value;
        descriptionElement.textContent = popupDescriptionInput.value;

        closeModal(popupEdit);
        popupEditForm.removeEventListener("submit", editHandler)
    }

    const nameElement = document.querySelector(".profile__title");
    const descriptionElement = document.querySelector(".profile__description");

    const popupNameInput = popupEdit.querySelector(".popup__input_type_name");
    const popupDescriptionInput = popupEdit.querySelector(".popup__input_type_description");

    popupNameInput.value = nameElement.textContent;
    popupDescriptionInput.value = descriptionElement.textContent;

    popupEditForm.addEventListener("submit", editHandler);

    openModal(popupEdit);
});


// set add button event listener and its form variable
const addButton = document.querySelector(".profile__add-button");
const popupAddForm = popupNewCard.querySelector(".popup__form");

addButton.addEventListener("click", (event) => {
    openModal(popupNewCard);
});

popupAddForm.addEventListener("submit", (event) => {
    event.preventDefault();

    cardsContainer.insertBefore(createCard({ name: popupAddForm["place-name"].value, link: popupAddForm.link.value }), cardsContainer.firstChild)

    closeModal(popupNewCard);
    popupAddForm.reset();
})

