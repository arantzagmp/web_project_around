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

class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items; 
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  
  renderItems() {
    this._items.forEach(item => {
      this._renderer(item); 
    });
  }


  addItem(element) {
    this._container.prepend(element); 
  }
}

class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    this._popup.classList.add("popup_opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popup.classList.remove("popup_opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    this._popup.addEventListener("mousedown", (evt) => {
      if (
        evt.target.classList.contains("popup_opened") ||
        evt.target.classList.contains("popup__close-button")
      ) {
        this.close();
      }
    });
  }
}

class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._popupImage = this._popup.querySelector(".popupImage__image");
    this._popupCaption = this._popup.querySelector(".popupImage__caption");
  }

  open(name, link) {
    this._popupImage.src = link;
    this._popupImage.alt = name;
    this._popupCaption.textContent = name;
    super.open();
  }
}

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".popup__form");
    this._inputList = this._form.querySelectorAll(".popup__input");
  }

  _getInputValues() {
    const formValues = {};
    this._inputList.forEach((input) => {
      formValues[input.name] = input.value;
    });
    return formValues;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}

class UserInfo {
  constructor({ nameSelector, jobSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent,
    };
  }

  setUserInfo({ name, job }) {
    this._nameElement.textContent = name;
    this._jobElement.textContent = job;
  }
}

class Card {
  constructor({ name, link }, templateSelector, handleCardClick) {
    this._name = name;
    this._link = link;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._templateSelector)
      .content.querySelector(".element")
      .cloneNode(true);

    return cardElement;
  }

  _setEventListeners() {
    this._element
      .querySelector(".element__image")
      .addEventListener("click", () => {
        this._handleCardClick(this._name, this._link);
      });
  }

  generateCard() {
    this._element = this._getTemplate();
    this._imageElement = this._element.querySelector(".element__image");
    this._titleElement = this._element.querySelector(".element__title");

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._titleElement.textContent = this._name;

    this._setEventListeners();

    return this._element;
  }
}

