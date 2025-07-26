//alert('JS cargado'); esto ya esta bieen
let popup = document.querySelector(".popup");
let formElement = document.querySelector(".popup__container form");
let closeButton = document.querySelector(".popup__close-button");
let profileName = document.querySelector(".profile__name");
let profileJob = document.querySelector(".profile__subtitle");

function openPopup() {
  formElement.name.value = profileName.textContent;
  formElement.about.value = profileJob.textContent;
formElement.reset(); 
  popup.classList.add("popup__opened");
}
const openPopupButton = document.querySelector(".profile__edit-button");
openPopupButton.addEventListener("click", openPopup);

const openCreatePopupButton = document.querySelector(".profile__add-button");
openCreatePopupButton.addEventListener("click", openPopupCreate);


function closePopup(popupElement) {
popupElement.classList.remove("popup__opened");
  popupElement.classList.remove("popupCreate__opened");
  popupElement.classList.remove("popupImage__opened");
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  let nameValue = formElement.name.value;
  let aboutValue = formElement.about.value;

  profileName.textContent = nameValue;
  profileJob.textContent = aboutValue;

  closePopup();
}

formElement.addEventListener("submit", handleProfileFormSubmit);
closeButton.addEventListener("click", () => closePopup(popup));

//empieza popup para crear
const initialCards = [
  {
    name: "Dallas, TX",
    link: "images/dallas.jpg",
  },
  {
    name: "China Town, SF",
    link: "images/chinatownsf.jpg",
  },
  {
    name: "Brooklyn, NYC",
    link: "images/Brooklyn.jpg",
  },
  {
    name: "Chicago, IL",
    link: "images/chicago.jpg",
  },
  {
    name: "New Orleans, LA",
    link: "images/neworleans.jpg",
  },
  {
    name: "Annapolis, MD",
    link: "images/Annapolis.jpg",
  },
];

const popupCreate = document.querySelector(".popupCreate");
const formCreate = document.querySelector(".popupCreate .popup__form");
const closeCreateButton = document.querySelector(
  ".popupCreate .popup__close-button"
);
const imageTitle = document.querySelector(".image-title");
const imageLink = document.querySelector(".image-link");

function openPopupCreate() {
  document.querySelector(".popupCreate").classList.add("popupCreate__opened");
}

function closePopupCreate() {
  popupCreate.classList.remove("popupCreate__opened");
}

const elementsContainer = document.querySelector(".elements");
//prueba
function createCard(name, link) {
  const newElement = document.createElement("div");
  newElement.classList.add("element");

  const newImg = document.createElement("img");
  newImg.src = link;
  newImg.alt = `imagen de ${name}`;
  newImg.classList.add("element__image");

  const trashIcon = document.createElement("button");
  trashIcon.classList.add("icon__trash");
  trashIcon.innerHTML = `<img src="images/Trash.svg" alt="Eliminar">`;
  trashIcon.addEventListener("click", () => {
    newElement.remove();
  });

  const footer = document.createElement("div");
  footer.classList.add("element__footer");

  const title = document.createElement("p");
  title.classList.add("element__name");
  title.textContent = name;

  const likeIcon = document.createElement("img");
  likeIcon.src = "images/heart.svg";
  likeIcon.alt = "corazón";
  likeIcon.classList.add("element__like");
  likeIcon.addEventListener("click", () => {
    const isLiked = likeIcon.classList.toggle("element__like--active");
    likeIcon.src = isLiked ? "images/heart-filled.svg" : "images/heart.svg";
  });

  newImg.addEventListener("click", () => {
    popupImageElement.src = link;
    popupImageElement.alt = `imagen de ${name}`;
    popupImageCaption.textContent = name;
    popupImage.classList.add("popupImage__opened");
  });

  footer.appendChild(title);
  footer.appendChild(likeIcon);

  newElement.appendChild(newImg);
  newElement.appendChild(trashIcon);
  newElement.appendChild(footer);

  return newElement;
}

const popupImage = document.querySelector(".popupImage");
const popupImageElement = document.querySelector(".popupImage__image");
const popupImageCaption = document.querySelector(".popupImage__caption");
const popupImageClose = document.querySelector(".popupImage__close-button");

popupImageClose.addEventListener("click", () => closePopup(popupImage));

initialCards.forEach((card) => {
  const cardElement = createCard(card.name, card.link);
  elementsContainer.appendChild(cardElement);
});

function handleImageCreate(evt) {
  evt.preventDefault();

  const imageTitleValue = formCreate.elements["Título"].value;
  const imageLinkValue = formCreate.elements["Enlace"].value;

  const newCard = createCard(imageTitleValue, imageLinkValue);
  elementsContainer.appendChild(newCard);

  formCreate.reset();
  closePopupCreate();
}

formCreate.addEventListener("submit", handleImageCreate);
closeCreateButton.addEventListener("click", () => closePopup(popupCreate));

import { enableValidation } from "./validate.js";

enableValidation({
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__submit-button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
});

function enableOverlayClose(popupElement) {
  popupElement.addEventListener('mousedown', (event) => {

    if (event.target === popupElement) {
      closePopup(popupElement);
    }
  });
}
enableOverlayClose(popup);
enableOverlayClose(popupCreate);
enableOverlayClose(popupImage);

function enableEscClose() {
  document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
      if (popup.classList.contains("popup__opened")) closePopup(popup);
      if (popupCreate.classList.contains("popupCreate__opened")) closePopup(popupCreate);
      if (popupImage.classList.contains("popupImage__opened")) closePopup(popupImage);
    }
  });
}

enableEscClose();
