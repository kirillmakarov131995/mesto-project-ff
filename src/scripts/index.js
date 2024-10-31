import "../pages/index.css"; // добавьте импорт главного файла стилей
// import initialCards from "./cards.js";
import { openModal, closeModal } from "./modal.js";
import { createCard, setContainers, updateLikes } from "./card.js";
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

function renderCard(item, options, userProfileId, method = "prepend") {
  // создаем карточку, передавая обработчики в виде объекта `callbacks`
  const cardElement = createCard(item, options, userProfileId);

  // вставляем карточку, используя метод (вставится `prepend` или `append`)
  cardsContainer[method](cardElement);
}

function renderCards(data, userProfileId) {
  if (!cardsContainer) return;

  cardsContainer.textContent = "";

  // load all cards from array

  data.forEach((item) => {
    cardsContainer.append(
      createCard(
        item,
        {
          deleteCardFunction: setCardToRemove,
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
  popupImage.alt = event.target.alt;

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
    .then(() => {
      closeModal(popupEditWindow);
    })
    .finally(() => {
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
    .then((item) => {
      // loadCards(userId);
      // console.log(item)
      renderCard(
        item,
        {
          deleteCardFunction: setCardToRemove,
          previewImageFunction: previewImage,
          likeCardFunction: updateLikeState,
        },
        userId,
        "prepend"
      );
    })
    .then(() => {
      closeModal(popupNewCardWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoadingButtonState(false, event.target.elements["submit-button"]);
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
    .then((data) => {
      profileImageElement.style.backgroundImage = `url(${data.avatar})`;
      closeModal(popupEditProfileImageWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoadingButtonState(false, event.target.elements["submit-button"]);
    });
});

// delete card confirm popup
let cardForDelete = {};

function setCardToRemove(cardId, cardElement) {
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
    // .then((data) => {
    //   console.log(data);
    // })
    .then(() => {
      cardForDelete.cardElement.remove();
      closeModal(popupDeleteWindow);
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

function updateLikeState(event, cardElement, countElement, isLiked) {
  if (!cardElement.id || !cardElement || !countElement) return;

  if (isLiked) {
    removeLike(cardElement.id)
      .then((data) => {
        updateLikes(data, event.target, countElement, false);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    addLike(cardElement.id)
      .then((data) => {
        updateLikes(data, event.target, countElement, true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function loadProfile() {
  return getProfileInfo()
    .then((profile) => {
      return profile;
    })
    .catch((err) => {
      console.log(err);
    });
}

function loadCards() {
  return getCards()
    .then((cards) => {
      return cards;
    })
    .catch((err) => {
      console.log(err);
    });
}

function loadData() {
  Promise.all([loadProfile(), loadCards()])
    .then(([profile, cards]) => {
      nameElement.textContent = profile.name;
      descriptionElement.textContent = profile.about;
      profileImageElement.style.backgroundImage = `url(${profile.avatar})`;
      userId = profile._id;

      renderCards(cards, profile._id);
    })
    .catch((err) => {
      console.log(err);
    });
}

enableValidation(defaultFormClasses);

setContainers(cardTemplate);

// initial loadup
loadData();

// ----------------------------------------------------------------------------------
