import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import { validationConfig } from "./utils.js";
class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  _handleResponse(res) {
  if (!res.ok) return Promise.reject(`Error: ${res.status}`);
  if (res.status === 204) return Promise.resolve({});
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : Promise.resolve({});
 }


  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {  method: "GET", headers: this.headers, cache: "no-store"})
      .then((res) => this._handleResponse(res));
  }
  getCards() {
  return fetch(`${this.baseUrl}/cards`, { method: "GET", headers: this.headers, cache: "no-store" })
    .then(res => res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
}

  updateUserInfo({ name, about }) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name, about })
    }).then((res) => this._handleResponse(res));
  }
likeCard(cardId) {
  return fetch(`${this.baseUrl}/cards/${cardId}/likes`, { method: "PUT", headers: this.headers })
    .then(res => this._handleResponse(res));
}
unlikeCard(cardId) {
  return fetch(`${this.baseUrl}/cards/${cardId}/likes`, { method: "DELETE", headers: this.headers })
    .then(res => this._handleResponse(res));
}

  addCard({ name, link }) {
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name, link })
    }).then((res) => this._handleResponse(res));
  }
  deleteCard(cardId) {
  return fetch(`${this.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: this.headers
  }).then((res) => this._handleResponse(res));
}

updateAvatar({ avatar }) {
  return fetch(`${this.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: { ...this.headers, "Content-Type": "application/json" },
    body: JSON.stringify({ avatar })
  }).then((res) => {
     if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (res.status === 204) return {};
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : {};
  });
}

}

const api = new Api({
  baseUrl: "https://around-api.es.tripleten-services.com/v1",
  headers: { authorization: "937ce67a-bb25-4ecd-8635-136a0a5cf439" }
});


class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }
  renderItems(items = this._items) {  
    items.forEach((item) => {
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
    this._submitBtn = this._form ? this._form.querySelector(".popup__submit-button") : null;
    this._defaultText = this._submitBtn?.textContent || "Guardar";
  }

  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => (values[input.name] = input.value));
    return values;
  }

  _setSaving(isSaving, text = "Guardando...") {
    if (!this._submitBtn) return;
    this._submitBtn.disabled = !!isSaving;
    this._submitBtn.textContent = isSaving ? text : this._defaultText;
  }

  setEventListeners() {
    super.setEventListeners();
    if (!this._form) return;

    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const values = this._getInputValues();
      this._setSaving(true, "Guardando...");
      Promise.resolve(this._handleFormSubmit(values))
        .catch((err) => console.error("Error en submit del popup:", err))
        .finally(() => this._setSaving(false));
    });
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

class PopupWithConfirmation extends Popup {
  constructor(popupSelector, { openedClass, closeSelector, submitSelector }) {
    super(popupSelector, { openedClass, closeSelector });
    this._submitButton = this._popup.querySelector(submitSelector);
    this._defaultSubmitText = this._submitButton?.textContent ?? "Sí";
    this._onConfirm = null;
  }

  open({ onConfirm }) {
    this._onConfirm = onConfirm;
    super.open();
  }

  setEventListeners() {
    super.setEventListeners();

    if (this._submitButton) {
      this._submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (!this._onConfirm) return;

        this._submitButton.disabled = true;
        this._submitButton.textContent = "Eliminando...";

        Promise.resolve(this._onConfirm())
          .then(() => {
            this.close();
          })
          .catch((err) => {
            console.error("No se pudo eliminar la tarjeta:", err);
          })
          .finally(() => {
            this._submitButton.disabled = false;
            this._submitButton.textContent = this._defaultSubmitText;
            this._onConfirm = null;
          });
      });
    }
  }
}
const confirmPopup = new PopupWithConfirmation(".PopupWithConfirmation", {
  openedClass: "popup__opened",
  closeSelector: ".PopupWithConfirmation__close-button",
  submitSelector: ".PopupWithConfirmation__submit-button",
});
confirmPopup.setEventListeners()

const imagePopup = new PopupWithImage(".popupImage", {
  openedClass: "popupImage__opened",
  closeSelector: ".popupImage__close-button",
});
imagePopup.setEventListeners();

class PopupWithFormAvatar extends Popup {
  constructor(popupSelector, { openedClass, closeSelector }, handleSubmit) {
    super(popupSelector, { openedClass, closeSelector });
    this._form = this._popup.querySelector("form");
    this._submitBtn = this._popup.querySelector(".popup__submit-button");
    this._handleSubmit = handleSubmit;
    this._defaultText = this._submitBtn?.textContent || "Guardar";
  }

  _getInputValues() {
    const fd = new FormData(this._form);
    return Object.fromEntries(fd.entries());
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      const values = this._getInputValues();
      if (this._submitBtn) {
        this._submitBtn.disabled = true;
        this._submitBtn.textContent = "Guardando...";
      }
      Promise.resolve(this._handleSubmit(values))
        .then(() => this.close())
        .catch((err) => console.error("Error al actualizar avatar:", err))
        .finally(() => {
          if (this._submitBtn) {
            this._submitBtn.disabled = false;
            this._submitBtn.textContent = this._defaultText;
          }
        });
    });
  }

  open() {
    this._form.reset();
    super.open();
  }
}
const avatarPopup = new PopupWithFormAvatar(
  ".popupAvatar",
  { openedClass: "popup__opened", closeSelector: ".popup__close-button" },
  (values) => {
    const url = (values.avatar || "").trim();
    return api.updateAvatar({ avatar: url }).then((updatedUser) => {
      const newSrc = (updatedUser && updatedUser.avatar) ? updatedUser.avatar : url;
const img = document.querySelector(".profile__avatar");
      if (img && newSrc) {
        const bust = `${newSrc}${newSrc.includes("?") ? "&" : "?"}v=${Date.now()}`;
        img.src = bust;
      }
    });
  }
);
avatarPopup.setEventListeners();
document
  .querySelector(".profile__avatar-edit-button")
  .addEventListener("click", () => avatarPopup.open());

const avatarForm = document.querySelector(".popupAvatar .popup__form");
if (avatarForm) {
  new FormValidator(validationConfig, avatarForm).enableValidation();
}
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    (name, link) => imagePopup.open(name, link),
    (cardId, isLiked) => (!isLiked ? api.likeCard(cardId) : api.unlikeCard(cardId)),
    (cardId, el) => {
      confirmPopup.open({
        onConfirm: () =>
          api.deleteCard(cardId).then(() => {
            el.remove();
          })
      });
    }
  );
  return card.getCard();
}

const section = new Section({ items: [], renderer: createCard }, ".elements");

const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__subtitle",
});

const profilePopup = new PopupWithForm(
  ".popup",
  { openedClass: "popup__opened", closeSelector: ".popup__close-button" },
  (values) => {
    const submitBtn = document.querySelector('.popup .popup__submit-button');
    const originalText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) submitBtn.textContent = "Guardando...";

    api.updateUserInfo({ name: values.name, about: values.about })
      .then((updatedUser) => {
        document.querySelector(".profile__name").textContent = updatedUser.name;
        document.querySelector(".profile__subtitle").textContent = updatedUser.about;
        document.querySelector(".profile__avatar").src = updatedUser.avatar;

        userInfo.setUserInfo({ name: updatedUser.name, job: updatedUser.about });
        profilePopup.close();
      })
      .catch((err) => {
        console.error("Error al actualizar perfil:", err);
      })
      .finally(() => {
        if (submitBtn && originalText) submitBtn.textContent = originalText;
      });
  }
);
profilePopup.setEventListeners();

const createPopup = new PopupWithForm(
  ".popupCreate",
  { openedClass: "popupCreate__opened", closeSelector: ".popup__close-button" },
  (values) => {
    const submitBtn = document.querySelector('.popupCreate .popup__submit-button');
    const originalText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) submitBtn.textContent = "Creando...";

    api.addCard({ name: values.title, link: values.image })
      .then((newCard) => {
        const element = createCard(newCard);
        section.addItem(element); 
        createPopup.close();
      })
      .catch((err) => {
        console.error("Error al crear tarjeta:", err);
      })
      .finally(() => {
        if (submitBtn && originalText) submitBtn.textContent = originalText;
      });
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

const popupEl = document.querySelector(".popupAvatar");              
const form = popupEl?.querySelector(".popup__form");
const input = form?.querySelector('input[name="avatar"]');             
const submitBtn = form?.querySelector(".popup__submit-button");
const closeBtn = popupEl?.querySelector(".popup__close-button");
const openBtn = document.querySelector(".profile__avatar-edit-button"); 
const avatarImg = document.querySelector(".profile__avatar");


openBtn?.addEventListener("click", () => {
  form?.reset();
  popupEl?.classList.add("popup__opened");  
});


closeBtn?.addEventListener("click", () => {
  popupEl?.classList.remove("popup__opened");
});


form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const url = (input?.value || "").trim();
  if (!url) return; 

  const originalText = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Guardando...";
  }
  api.updateAvatar({ avatar: url })
    .then((updatedUser) => {
      const newSrc = updatedUser?.avatar || url;
      if (avatarImg && newSrc) {
        const bust = `${newSrc}${newSrc.includes("?") ? "&" : "?"}v=${Date.now()}`;
        avatarImg.src = bust;
      }
      popupEl?.classList.remove("popup__opened");
    })
    .catch((err) => {
      console.error("Error al actualizar avatar:", err);
    })
    .finally(() => {
      if (submitBtn && originalText) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
});

(async function init() {
  try {
    const [userData, cards] = await Promise.all([api.getUserInfo(), api.getCards()]);
    document.querySelector(".profile__name").textContent = userData.name;
    document.querySelector(".profile__subtitle").textContent = userData.about;
    document.querySelector(".profile__avatar").src = userData.avatar;
    window.currentUserId = userData._id;

const cardsWithLike = cards.map((c) => {
  const likes = Array.isArray(c.likes) ? c.likes : [];
  const getId = (u) => (u && (u._id || u.id)) ?? u;

  const liked =
    typeof c.isLiked === "boolean"
      ? c.isLiked
      : likes.some((u) => getId(u) === userData._id);

  return { ...c, isLiked: liked };
});

section.renderItems(cardsWithLike.slice().reverse());
  } catch (err) {
    console.error("Falló la carga inicial:", err);
  }
})();
