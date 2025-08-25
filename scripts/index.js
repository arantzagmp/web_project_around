import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import { 
  openPopup, 
  closePopup, 
  openPopupCreate, 
  closePopupCreate, 
  enableOverlayClose, 
  enableEscClose 
} from "./utils.js";

let popup = document.querySelector(".popup");
let formElement = document.querySelector(".popup__container form");
let closeButton = document.querySelector(".popup__close-button");
let profileName = document.querySelector(".profile__name");
let profileJob = document.querySelector(".profile__subtitle");

function openProfilePopup() {
  formElement.name.value = profileName.textContent;
  formElement.about.value = profileJob.textContent;
  formElement.reset();
  openPopup(popup);
}
const openPopupButton = document.querySelector(".profile__edit-button");
openPopupButton.addEventListener("click", openProfilePopup);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = formElement.name.value;
  profileJob.textContent = formElement.about.value;
  closePopup(popup);
}
formElement.addEventListener("submit", handleProfileFormSubmit);
closeButton.addEventListener("click", () => closePopup(popup));

const initialCards = [
  { name: "Dallas, TX", link: "images/dallas.jpg" },
  { name: "China Town, SF", link: "images/chinatownsf.jpg" },
  { name: "Brooklyn, NYC", link: "images/Brooklyn.jpg" },
  { name: "Chicago, IL", link: "images/chicago.jpg" },
  { name: "New Orleans, LA", link: "images/neworleans.jpg" },
  { name: "Annapolis, MD", link: "images/Annapolis.jpg" },
];

const popupCreate = document.querySelector(".popupCreate");
const formCreate = document.querySelector(".popupCreate .popup__form");
const closeCreateButton = document.querySelector(".popupCreate .popup__close-button");

const openCreatePopupButton = document.querySelector(".profile__add-button");
openCreatePopupButton.addEventListener("click", () => openPopupCreate(popupCreate));
closeCreateButton.addEventListener("click", () => closePopupCreate(popupCreate));

const popupImage = document.querySelector(".popupImage");
const popupImageElement = document.querySelector(".popupImage__image");
const popupImageCaption = document.querySelector(".popupImage__caption");
const popupImageClose = document.querySelector(".popupImage__close-button");

function handleImageClick(name, link) {
  popupImageElement.src = link;
  popupImageElement.alt = `imagen de ${name}`;
  popupImageCaption.textContent = name;
  popupImage.classList.add("popupImage__opened");
}
popupImageClose.addEventListener("click", () => closePopup(popupImage));

const elementsContainer = document.querySelector(".elements");

function renderCard(data) {
  const card = new Card(data, "#card-template", handleImageClick);
  const cardElement = card.getCard();
  elementsContainer.prepend(cardElement);
}
initialCards.forEach(renderCard);

function handleImageCreate(evt) {
  evt.preventDefault();
  const title = formCreate.elements["title"].value;
  const image = formCreate.elements["image"].value;
  renderCard({ name: title, link: image });
  formCreate.reset();
  closePopupCreate(popupCreate);
}
formCreate.addEventListener("submit", handleImageCreate);

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__submit-button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};
const forms = Array.from(document.querySelectorAll(validationConfig.formSelector));
forms.forEach((form) => {
  const validator = new FormValidator(validationConfig, form);
  validator.enableValidation();
});

enableOverlayClose(popup);
enableOverlayClose(popupCreate);
enableOverlayClose(popupImage);
enableEscClose([popup, popupCreate, popupImage]);

