import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import { initialCards, validationConfig } from "./utils.js";

class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }
  renderItems() {
    this._items.forEach((item) => {
      const element = this._renderer(item);
      this.addItem(element);
    });
  }
  addItem(element) {
    this._container.prepend(element);
  }
}

class Popup {
  constructor(popupSelector, { openedClass, closeSelector }) {
    this._popup = document.querySelector(popupSelector);
    this._openedClass = openedClass;
    this._closeSelector = closeSelector;
    this._handleEscClose = this._handleEscClose.bind(this);
    this._handleOverlayClose = this._handleOverlayClose.bind(this);
  }
  open() {
    if (!this._popup) return;
    this._popup.classList.add(this._openedClass);
    document.addEventListener("keydown", this._handleEscClose);
    this._popup.addEventListener("mousedown", this._handleOverlayClose);
  }
  close() {
    if (!this._popup) return;
    this._popup.classList.remove(this._openedClass);
    document.removeEventListener("keydown", this._handleEscClose);
    this._popup.removeEventListener("mousedown", this._handleOverlayClose);
  }
  _handleEscClose(evt) {
    if (evt.key === "Escape") this.close();
  }
  _handleOverlayClose(evt) {
    const isOverlay = evt.target === this._popup;
    const isCloseBtn = evt.target.closest(this._closeSelector);
    if (isOverlay || isCloseBtn) this.close();
  }
  setEventListeners() {
    const closeBtn = this._popup?.querySelector(this._closeSelector);
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }
  }
}

class PopupWithImage extends Popup {
  constructor(popupSelector, options) {
    super(popupSelector, options);
    this._image = this._popup.querySelector(".popupImage__image");
    this._caption = this._popup.querySelector(".popupImage__caption");
  }
  open(name, link) {
    if (this._image) this._image.src = link;
    if (this._image) this._image.alt = name;
    if (this._caption) this._caption.textContent = name;
    super.open();
  }
}

class PopupWithForm extends Popup {
  constructor(popupSelector, options, handleFormSubmit) {
    super(popupSelector, options);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".popup__form");
    this._inputList = this._form ? this._form.querySelectorAll(".popup__input") : [];
  }
  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => {
      values[input.name] = input.value;
    });
    return values;
  }
  setEventListeners() {
    super.setEventListeners();
    if (this._form) {
      this._form.addEventListener("submit", (evt) => {
        evt.preventDefault();
        this._handleFormSubmit(this._getInputValues());
      });
    }
  }
  close() {
    super.close();
    this._form?.reset();
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

const imagePopup = new PopupWithImage(".popupImage", {
  openedClass: "popupImage__opened",
  closeSelector: ".popupImage__close-button",
});
imagePopup.setEventListeners();

function createCard(data) {
  const card = new Card(data, "#card-template", (name, link) => {
    imagePopup.open(name, link);
  });
  return card.getCard();
}

const section = new Section(
  { items: initialCards, renderer: createCard },
  ".elements"
);
section.renderItems();

const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__subtitle",
});

const profilePopup = new PopupWithForm(
  ".popup",
  { openedClass: "popup__opened", closeSelector: ".popup__close-button" },
  (values) => {
    userInfo.setUserInfo({ name: values.name, job: values.about });
    profilePopup.close();
  }
);
profilePopup.setEventListeners();

const createPopup = new PopupWithForm(
  ".popupCreate",
  { openedClass: "popupCreate__opened", closeSelector: ".popup__close-button" },
  (values) => {
    const element = createCard({ name: values.title, link: values.image });
    section.addItem(element);
    createPopup.close();
  }
);
createPopup.setEventListeners();

document.querySelector(".profile__edit-button").addEventListener("click", () => {
  const current = userInfo.getUserInfo();
  const form = document.querySelector(".popup .popup__form");
  if (form) {
    form.name.value = current.name;
    form.about.value = current.job;
  }
  profilePopup.open();
});

document.querySelector(".profile__add-button").addEventListener("click", () => {
  createPopup.open();
});

const profileForm = document.querySelector(".popup .popup__form");
const createForm = document.querySelector(".popupCreate .popup__form");

new FormValidator(validationConfig, profileForm).enableValidation();
new FormValidator(validationConfig, createForm).enableValidation();
