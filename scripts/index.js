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
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    this._popup.classList.add("popup__opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popup.classList.remove("popup__opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    this._popup.addEventListener("mousedown", (evt) => {
      const clickOnOverlay = evt.target.classList.contains("popup__opened");
      const clickOnClose =
        evt.target.classList.contains("popup__close-button") ||
        evt.target.closest(".popup__close-button") ||
        evt.target.classList.contains("popupImage__close-button");
      if (clickOnOverlay || clickOnClose) {
        this.close();
      }
    });
  }
}

class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._image = this._popup.querySelector(".popupImage__image");
    this._caption = this._popup.querySelector(".popupImage__caption");
  }

  open(name, link) {
    this._image.src = link;
    this._image.alt = name;
    this._caption.textContent = name;
    super.open();
  }
}

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
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

const imagePopup = new PopupWithImage(".popupImage");
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

const profilePopup = new PopupWithForm(".popup", (values) => {
  userInfo.setUserInfo({ name: values.name, job: values.about });
  profilePopup.close();
});
profilePopup.setEventListeners();

const createPopup = new PopupWithForm(".popupCreate", (values) => {
  const element = createCard({ name: values.title, link: values.image });
  section.addItem(element);
  createPopup.close();
});
createPopup.setEventListeners();

document.querySelector(".profile__edit-button").addEventListener("click", () => {
  const current = userInfo.getUserInfo();
  const form = document.querySelector(".popup .popup__form");
  form.name.value = current.name;
  form.about.value = current.job;
  profilePopup.open();
});

document.querySelector(".profile__add-button").addEventListener("click", () => {
  createPopup.open();
});


const profileForm = document.querySelector(".popup .popup__form");
const createForm = document.querySelector(".popupCreate .popup__form");

new FormValidator(validationConfig, profileForm).enableValidation();
new FormValidator(validationConfig, createForm).enableValidation();
