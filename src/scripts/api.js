const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-26",
  headers: {
    authorization: "6d8d06ac-9d5a-4406-b800-f2cb20d8ad79",
    "Content-Type": "application/json",
  },
};

function responseConforming(res) {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}

function updateUserProfileAvatar(data) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: data.avatar,
    }),
  }).then(responseConforming);
}

function updateUserProfile(data) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: data.name,
      about: data.about,
    }),
  }).then(responseConforming);
}

function getCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(responseConforming);
}

function getProfileInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(responseConforming);
}

function addNewCard(newCard) {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: newCard.name,
      link: newCard.link,
    }),
  }).then(responseConforming);
}

function removeCard(id) {
  if (!id) return;

  return fetch(`${config.baseUrl}/cards/${id}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(responseConforming);
}

function addLike(cardId) {
  if (!cardId) return;

  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then(responseConforming);
}

function removeLike(cardId) {
  if (!cardId) return;

  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(responseConforming);
}

export {
  updateUserProfile,
  getCards,
  getProfileInfo,
  addNewCard,
  removeCard,
  addLike,
  removeLike,
  updateUserProfileAvatar,
};
