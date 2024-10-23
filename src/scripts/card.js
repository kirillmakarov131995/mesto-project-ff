let cardTemplate = null;
let cardsContainer = null;

function setContainers(newCardTemplate, newCardsContainer) {
  cardTemplate = newCardTemplate;
  cardsContainer = newCardsContainer;
}

// @todo: Функция создания карточки
// function createCard(cardData, deleteCardFunction, previewImageFunction, likeCardFunction) {
function createCard(cardData, options = {}) {
  const newCard = cardTemplate.querySelector(".card").cloneNode(true);

  if (!newCard) return;

  const newCardImage = newCard.querySelector(".card__image");
  const newCardTitle = newCard.querySelector(".card__title");
  const newCardDeleteButton = newCard.querySelector(".card__delete-button");
  const newCardLikeButton = newCard.querySelector(".card__like-button");

  newCardImage.src = cardData.link;
  newCardImage.alt = cardData.name;
  newCardTitle.textContent = cardData.name;

  newCardDeleteButton.addEventListener(
    "click",
    options.deleteCardFunction
      ? (event) => options.deleteCardFunction(newCard)
      : (event) => deleteCard(newCard)
  );
  newCardImage.addEventListener(
    "click",
    options.previewImageFunction
      ? (event) => options.previewImageFunction(event)
      : (event) => {}
  );
  newCardLikeButton.addEventListener(
    "click",
    options.likeCardFunction
      ? (event) => options.likeCardFunction(event)
      : (event) => likeCard(event)
  );

  return newCard;
}

// @todo: Функция удаления карточки
function deleteCard(card) {
  card.remove();
}

function likeCard(event) {
  event.target.classList.toggle("card__like-button_is-active");
}

export { createCard, deleteCard, setContainers };
