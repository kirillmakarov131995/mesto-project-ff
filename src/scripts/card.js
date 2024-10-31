let cardTemplate = null;
let cardsContainer = null;

function setContainers(newCardTemplate, newCardsContainer) {
  cardTemplate = newCardTemplate;
  cardsContainer = newCardsContainer;
}

// @todo: Функция создания карточки
function createCard(cardData, options = {}, ownerId) {
  const newCard = cardTemplate.querySelector(".card").cloneNode(true);

  if (!newCard) return;

  const likes = Array.from(cardData.likes ? cardData.likes : []);

  // console.log(cardData)

  const newCardImage = newCard.querySelector(".card__image");
  const newCardTitle = newCard.querySelector(".card__title");
  const newCardDeleteButton = newCard.querySelector(".card__delete-button");
  const newCardLikeButton = newCard.querySelector(".card__like-button");
  const newCardLikeButtonCountElement = newCard.querySelector(
    ".card__like-button-count"
  );

  newCardImage.src = cardData.link;
  newCardImage.alt = cardData.name;
  newCardTitle.textContent = cardData.name;
  newCardLikeButtonCountElement.textContent = likes.length;
  newCard.id = cardData._id;

  if (cardData.owner._id === ownerId) {
    newCardDeleteButton.classList.remove("card__delete-button_disabled");
    newCardDeleteButton.addEventListener(
      "click",
      options.deleteCardFunction
        ? (event) => options.deleteCardFunction(cardData._id, newCard)
        : (event) => deleteCard(newCard)
    );
  } else {
    newCardDeleteButton.classList.add("card__delete-button_disabled");
  }

  newCardImage.addEventListener(
    "click",
    options.previewImageFunction
      ? (event) => options.previewImageFunction(event)
      : (event) => {}
  );
  newCardLikeButton.addEventListener("click", (event) =>
    likeCard(
      event,
      newCard.id,
      newCardLikeButtonCountElement,
      options.likeCardFunction
    )
  );

  // check likes if there is the owners like
  const hasOwnerLike = cardData.likes.some((item) => {
    return item["_id"] === ownerId;
  });

  if (hasOwnerLike) {
    newCardLikeButton.classList.add("card__like-button_is-active");
    // console.log(cardData.likes.includes(ownerId))
  }

  return newCard;
}

// @todo: Функция удаления карточки
function deleteCard(card) {
  card.remove();
}

function likeCard(event, cardId, likeButtonCountElement, callback) {
  // event.target.classList.toggle("card__like-button_is-active");

  const isLiked = event.target.classList.contains(
    "card__like-button_is-active"
  );

  if (isLiked) {
    event.target.classList.remove("card__like-button_is-active");
  } else {
    event.target.classList.add("card__like-button_is-active");
  }

  if (!callback) return;

  callback(cardId, likeButtonCountElement, isLiked);
}

export { createCard, setContainers };
