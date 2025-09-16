// Card.js
export default class Card {
  constructor(data, templateSelector, handleImageClick, handleLikeClick, handleDeleteClick) {
    this._name = data.name;
    this._link = data.link;
    this._id   = data._id || data.id; 
    this._isLiked = data.isLiked ?? false;
    this._templateSelector = templateSelector;
    this._handleImageClick = handleImageClick;
    this._handleLikeClick = handleLikeClick;
   this._handleDeleteClick = handleDeleteClick;
  }

  _getTemplate() {
    const tpl = document.querySelector(this._templateSelector);
    if (!tpl) throw new Error(`No se encontró ${this._templateSelector} en el DOM`);

    const root = tpl.content.querySelector(".element") || tpl.content.firstElementChild;
    if (!root) throw new Error("El template no tiene un nodo raíz .element");

    return root.cloneNode(true);
  }

  getCard() {
    this._element = this._getTemplate();
    this._imageElement = this._element.querySelector(".element__image");
    this._titleElement = this._element.querySelector(".element__name");
    this._likeButton   = this._element.querySelector(".element__like");
    this._deleteButton = this._element.querySelector(".icon__trash");
this._toggleLikeUI();
    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
   this._titleElement.textContent = this._name;

  if (this._isLiked) {
     this._likeButton.classList.add("element__like_active");
   }
this._toggleLikeUI();

    this._setEventListeners();
    return this._element;
  }

  _setEventListeners() {
   this._likeButton.addEventListener("click", () => {
  if (!this._id) {
    console.warn("La tarjeta no tiene _id; no puedo hacer like.");
    return;
  }

this._handleLikeClick(this._id, this._isLiked)
  .then((updatedCard) => {
    const me = window.currentUserId;
    const likes = Array.isArray(updatedCard.likes) ? updatedCard.likes : [];
    const likedFromArray = likes.some((u) => {
      const uid = (u && (u._id || u.id)) ?? u;
      return uid === me;
    });

    this._isLiked =
      typeof updatedCard.isLiked === "boolean" ? updatedCard.isLiked : likedFromArray;

    this._toggleLikeUI();
  })
  .catch((err) => console.error("Error al alternar like:", err));
});

    this._imageElement.addEventListener("click", () => {
      this._handleImageClick(this._name, this._link);
    });

    this._deleteButton?.addEventListener("click", () => {
  if (!this._id) return;
  this._handleDeleteClick?.(this._id, this._element);
});
  }
_renderLikeState() {
  if (!this._likeButton) return;
  this._likeButton.src = this._isLiked ? "images/heart_active.svg" : "images/heart.svg";
}
_toggleLikeUI() {
  this._likeButton.classList.toggle("element__like_active", this._isLiked);
  this._renderLikeState();
}
  
}
