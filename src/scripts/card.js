import initialCards from "./cards.js";
import { openModal } from "./modal.js";


let cardTemplate = null;
let cardsContainer = null;

function setContainers(newCardTemplate, newCardsContainer) {
	cardTemplate = newCardTemplate;
	cardsContainer = newCardsContainer;
}

// @todo: Функция создания карточки
function createCard(cardData, deleteCardFunction, previewImageFunction, likeCardFunction) {

	const newCard = cardTemplate.querySelector(".card").cloneNode(true);

	if (!newCard)
		return;

	const newCardImage = newCard.querySelector(".card__image");
	const newCardTitle = newCard.querySelector(".card__title");
	const newCardDeleteButton = newCard.querySelector(".card__delete-button");
	const newCardLikeButton = newCard.querySelector(".card__like-button");

	newCardImage.src = cardData.link;
	newCardImage.alt = cardData.name;
	newCardTitle.textContent = cardData.name;

	newCardDeleteButton.addEventListener("click", deleteCardFunction ? (event) => deleteCardFunction(newCard) : (event) => deleteCard(newCard));
	newCardImage.addEventListener("click", previewImageFunction ? (event) => previewImageFunction(event) : (event) => previewImage(event));
	newCardLikeButton.addEventListener("click", likeCardFunction ? (event) => likeCardFunction(event) : (event) => likeCard(event));

	return newCard;
}

// @todo: Функция удаления карточки
function deleteCard(card) {
	card.remove();
}

function likeCard(event) {
	event.target.classList.toggle("card__like-button_is-active")
}

function previewImage(event) {
	const popupImageCard = document.querySelector(".popup_type_image");
	const popupImage = popupImageCard.querySelector(".popup__image");
	const popupTitle = popupImageCard.querySelector(".popup__caption");
	popupImage.src = event.target.src;
	popupTitle.textContent = event.target.alt;

	// to make changing the image without popups
	setTimeout(() => {
		openModal(popupImageCard);
	}, 200);
}


// @todo: Вывести карточки на страницу
function renderCards() {
	if (!cardsContainer)
		return;

	// load all cards from array
	initialCards.forEach(item => cardsContainer.append(createCard(item, deleteCard, previewImage, likeCard)));
}

export { renderCards, createCard, deleteCard, setContainers}