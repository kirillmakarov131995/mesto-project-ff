// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardsContainer = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(cardData, deleteCardFunction) {
    const newCard = cardTemplate.querySelector(".card").cloneNode(true);

    if(!newCard)
        return;

    const newCardImage = newCard.querySelector(".card__image");
    const newCardTitle = newCard.querySelector(".card__title");
    const newCardDeleteButton = newCard.querySelector(".card__delete-button");

    newCardImage.src = cardData.link;
    newCardTitle.textContent = cardData.name;

    newCardDeleteButton.addEventListener("click", deleteCardFunction);

    return newCard;
}

// @todo: Функция удаления карточки
function deleteCard(event) {
    if(!event)
        return;

    const element = event.target;
    const cardContainer = element.closest(".places__item");
    const cardTitle = cardContainer.querySelector(".card__title");

    const foundCard = initialCards.find((item)=>{
        return item.name === cardTitle.textContent;
    });

    const cardIndex = initialCards.indexOf(foundCard);
    initialCards.splice(cardIndex, 1);

    renderCards();
}

// @todo: Вывести карточки на страницу
function renderCards() {
    if(!cardsContainer)
        return;

    const cardsNodes = Array.from(cardsContainer.children);
    
    // delete all existing cards
    cardsNodes.forEach((item) => {
        item.remove();
    });

    // load all cards from array
    initialCards.forEach((item) => {
        cardsContainer.append(createCard(item, deleteCard));
    });
}

renderCards();
