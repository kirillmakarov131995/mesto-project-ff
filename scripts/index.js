// const cardsListClassName = ".places__list";
// const cardTitleClassName = ".card__title";
// const cardImageClassName = ".card__image";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardsContainer = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(cardData, deleteCardFunction) {
    const newCard = cardTemplate.querySelector(".card").cloneNode(true);

    if (!newCard)
        return;

    const newCardImage = newCard.querySelector(".card__image");
    const newCardTitle = newCard.querySelector(".card__title");
    const newCardDeleteButton = newCard.querySelector(".card__delete-button");

    newCardImage.src = cardData.link;
    newCardImage.alt = "место карточки";
    newCardTitle.textContent = cardData.name;

    newCardDeleteButton.addEventListener("click", () => deleteCardFunction(newCard));

    return newCard;
}

// @todo: Функция удаления карточки
function deleteCard(card) {
    card.remove();
}

// @todo: Вывести карточки на страницу
function renderCards() {
    if (!cardsContainer)
        return;

    // delete all existing cards
    // const cardsNodes = Array.from(cardsContainer.children);
    // cardsNodes.forEach(item => item.remove());

    // load all cards from array
    initialCards.forEach(item => cardsContainer.append(createCard(item, deleteCard)));
}

renderCards();
