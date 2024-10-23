import "../pages/index.css"; // добавьте импорт главного файла стилей
import initialCards from "./cards.js";
import { openModal, closeModal } from "./modal.js";
import { createCard, setContainers } from "./card.js";

function renderCard(item, options, method = "prepend") {

  // создаем карточку, передавая обработчики в виде объекта `callbacks`
  const cardElement = createCard(item, options);

  // вставляем карточку, используя метод (вставится `prepend` или `append`)
  cardsContainer[ method ](cardElement);
}

// @todo: Вывести карточки на страницу
function renderCards() {
  if (!cardsContainer) return;

  // load all cards from array
  initialCards.forEach((item) =>
    cardsContainer.append(
      createCard(item, { previewImageFunction: previewImage })
    )
  );
}

function previewImage(event) {
  popupImage.src = event.target.src;
  popupTitle.textContent = event.target.alt;

  // to make changing the image without popups
  setTimeout(() => {
    openModal(popupImageWindow);
  }, 200);
}

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardsContainer = document.querySelector(".places__list");

const popupEditWindow = document.querySelector(".popup_type_edit");
const popupNameInput = popupEditWindow.querySelector(".popup__input_type_name");
const popupDescriptionInput = popupEditWindow.querySelector(".popup__input_type_description");
const popupEditForm = document.forms["edit-profile"];
const nameElement = document.querySelector(".profile__title");
const descriptionElement = document.querySelector(".profile__description");

const popupNewCardWindow = document.querySelector(".popup_type_new-card");

const popupImageWindow = document.querySelector(".popup_type_image");
const popupImage = popupImageWindow.querySelector(".popup__image");
const popupTitle = popupImageWindow.querySelector(".popup__caption");

// set edid button event listener and its form variable
const editButton = document.querySelector(".profile__edit-button");

// set add button event listener and its form variable
const addButton = document.querySelector(".profile__add-button");
const popupAddForm = document.forms["new-place"];


setContainers(cardTemplate, cardsContainer);

// initial render of all cards
renderCards();

// handle popups
const popups = document.querySelectorAll('.popup')

popups.forEach((popup) => {
    popup.addEventListener('mousedown', (event) => {

        if (event.target.classList.contains('popup_is-opened')) {
          closeModal(popup)
        }
        if (event.target.classList.contains('popup__close')) {
          closeModal(popup)
        }
    })
})

editButton.addEventListener("click", (event) => {
  popupNameInput.value = nameElement.textContent;
  popupDescriptionInput.value = descriptionElement.textContent;

  openModal(popupEditWindow);
});

popupEditForm.addEventListener("submit", function (event) {
  event.preventDefault();

  nameElement.textContent = popupNameInput.value;
  descriptionElement.textContent = popupDescriptionInput.value;

  closeModal(popupEditWindow);
});

addButton.addEventListener("click", (event) => {
  openModal(popupNewCardWindow);
});

popupAddForm.addEventListener("submit", (event) => {
  event.preventDefault();

  renderCard({ name: popupAddForm["place-name"].value, link: popupAddForm.link.value }, { previewImageFunction: previewImage })

  closeModal(popupNewCardWindow);
  popupAddForm.reset();
});
