import "../pages/index.css"; // добавьте импорт главного файла стилей
// import initialCards from "./cards.js";
import { openModal, closeModal } from "./modal.js";
import { createCard, setContainers } from "./card.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  updateUserProfile,
  getCards,
  getProfileInfo,
  addNewCard,
  removeCard,
  removeLike,
  addLike,
  updateUserProfileAvatar,
} from "./api.js";

// ---------------------
// GLOABAL VARS
// ---------------------

let userId = null; //my profile id

const defaultFormClasses = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardsContainer = document.querySelector(".places__list");

const popupEditWindow = document.querySelector(".popup_type_edit");
const popupNameInput = popupEditWindow.querySelector(".popup__input_type_name");
const popupDescriptionInput = popupEditWindow.querySelector(
  ".popup__input_type_description"
);
const popupEditForm = document.forms["edit-profile"];
const nameElement = document.querySelector(".profile__title");
const descriptionElement = document.querySelector(".profile__description");
const profileImageElement = document.querySelector(".profile__image");

const popupNewCardWindow = document.querySelector(".popup_type_new-card");

const popupImageWindow = document.querySelector(".popup_type_image");
const popupImage = popupImageWindow.querySelector(".popup__image");
const popupTitle = popupImageWindow.querySelector(".popup__caption");

const popupDeleteWindow = document.querySelector(".popup_type_delete");
const popupDeleteForm = document.forms["delete-card"];

const popupEditProfileImageWindow = document.querySelector(
  ".popup_type_avatar-edit "
);
const popupEditProfileImageForm = document.forms["edit-avatar"];

const popups = document.querySelectorAll(".popup");

// set edid button event listener and its form variable
const editButton = document.querySelector(".profile__edit-button");

// set add button event listener and its form variable
const addButton = document.querySelector(".profile__add-button");
const popupAddForm = document.forms["new-place"];

// ---------------------
// GLOABAL VARS END
// ---------------------

// ----------------------------------------------------------------------------------

// ---------------------
// CARDS LOGIC
// ---------------------

// function renderCard(item, options, method = "prepend") {

//   // создаем карточку, передавая обработчики в виде объекта `callbacks`
//   const cardElement = createCard(item, options);

//   // вставляем карточку, используя метод (вставится `prepend` или `append`)
//   cardsContainer[method](cardElement);
// }

function renderCards(data, userProfileId) {
  if (!cardsContainer) return;

  cardsContainer.textContent = "";

  // load all cards from array

  data.forEach((item) => {
    cardsContainer.append(
      createCard(
        item,
        {
          deleteCardFunction: handleDeleteCard,
          previewImageFunction: previewImage,
          likeCardFunction: updateLikeState,
        },
        userProfileId
      )
    );
  });
}

function previewImage(event) {
  popupImage.src = event.target.src;
  popupTitle.textContent = event.target.alt;

  // to make changing the image without popups
  setTimeout(() => {
    openModal(popupImageWindow);
  }, 200);
}

// ---------------------
// CARDS LOGIC END
// ---------------------

// ----------------------------------------------------------------------------------

// ---------------------
// POPUPS
// ---------------------

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains("popup_is-opened")) {
      closeModal(popup);
    }

    if (event.target.classList.contains("popup__close")) {
      closeModal(popup);
    }
  });
});

editButton.addEventListener("click", (event) => {
  clearValidation(defaultFormClasses, popupEditForm);

  popupNameInput.value = nameElement.textContent;
  popupDescriptionInput.value = descriptionElement.textContent;

  openModal(popupEditWindow);
});

popupEditForm.addEventListener("submit", function (event) {
  event.preventDefault();

  setLoadingButtonState(true, event.target.elements["submit-button"]);

  updateUserProfile({
    name: popupNameInput.value,
    about: popupDescriptionInput.value,
  })
    .then((data) => {
      nameElement.textContent = data.name;
      descriptionElement.textContent = data.about;
    })
    .finally(() => {
      closeModal(popupEditWindow);
      setLoadingButtonState(false, event.target.elements["submit-button"]);
    })
    .catch((err) => {
      console.log(err);
    });
});

addButton.addEventListener("click", (event) => {
  clearValidation(defaultFormClasses, popupAddForm);
  openModal(popupNewCardWindow);
});

popupAddForm.addEventListener("submit", (event) => {
  event.preventDefault();

  setLoadingButtonState(true, event.target.elements["submit-button"]);

  addNewCard({
    name: popupAddForm["place-name"].value,
    link: popupAddForm.link.value,
  })
    .then((data) => {
      loadCards(userId);
    })
    .finally(() => {
      closeModal(popupNewCardWindow);
      setLoadingButtonState(false, event.target.elements["submit-button"]);
    })
    .catch((err) => {
      console.log(err);
    });
});

profileImageElement.addEventListener("click", (event) => {
  clearValidation(defaultFormClasses, popupEditProfileImageForm);
  openModal(popupEditProfileImageWindow);
});

popupEditProfileImageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  setLoadingButtonState(true, event.target.elements["submit-button"]);

  updateUserProfileAvatar({
    avatar: popupEditProfileImageForm.elements["link"].value,
  })
    .finally(() => {
      closeModal(popupEditProfileImageWindow);
      setLoadingButtonState(false, event.target.elements["submit-button"]);
    })
    .catch((err) => {
      console.log(err);
    });
});

// delete card confirm popup
let cardForDelete = {};

function handleDeleteCard(cardId, cardElement) {
  cardForDelete = {
    id: cardId,
    cardElement,
  };
  openModal(popupDeleteWindow);
}

popupDeleteForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!cardForDelete.cardElement) return;

  removeCard(cardForDelete.id)
    .then(() => {
      closeModal(popupDeleteWindow);
      cardForDelete = {};
    })
    .finally(() => {
      loadCards(userId);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ---------------------
// POPUPS END
// ---------------------

// ----------------------------------------------------------------------------------

// ---------------------
// LOADING DATA
// ---------------------

function setLoadingButtonState(enabled, buttonElement) {
  if (!buttonElement) return;

  buttonElement.classList[enabled ? "add" : "remove"]("popup__button-sending");
}

function updateLikeState(cardId, countElement, shouldBeRemoved) {
  if (shouldBeRemoved) {
    removeLike(cardId)
      .then((data) => {
        countElement.textContent = data.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    addLike(cardId)
      .then((data) => {
        countElement.textContent = data.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function loadProfile() {
  return getProfileInfo()
    .then((data) => {
      nameElement.textContent = data.name;
      descriptionElement.textContent = data.about;
      profileImageElement.style.backgroundImage = `url(${data.avatar})`;
      return data;
    })
    .then((data) => {
      userId = data._id;
    });
}

function loadCards(user) {
  return getCards()
    .then((data) => {
      renderCards(data, user);
    })
    .catch((err) => {
      console.log(err);
    });
}

function loadData() {
  Promise.all([
    new Promise((resolve) => {
      loadProfile()
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          resolve();
        });
    }),
  ])
    .then((i) => {
      loadCards(userId);
    })
    .catch((err) => {
      console.log(err);
    });
}

enableValidation(defaultFormClasses);

setContainers(cardTemplate, cardsContainer);

// initial loadup
loadData();

// ----------------------------------------------------------------------------------
