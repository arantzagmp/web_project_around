export default class Card {
  constructor(data, templateSelector, handleCardClick) {
    this._name = data.name;
    this._link = data.link;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._templateSelector)
      .content
      .querySelector(".element")
      .cloneNode(true);

    return cardElement;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._likeButton.classList.toggle("element__like--active");
      this._likeButton.src = this._likeButton.classList.contains("element__like--active")
        ? "images/heart-filled.svg"
        : "images/heart.svg";
    });

    this._deleteButton.addEventListener("click", () => {
      this._element.remove();
    });

    this._imageElement.addEventListener("click", () => {
      this._handleCardClick(this._name, this._link);
    });
  }

  getCard() {
    this._element = this._getTemplate();
    this._imageElement = this._element.querySelector(".element__image");
    this._titleElement = this._element.querySelector(".element__name");
    this._likeButton = this._element.querySelector(".element__like");
    this._deleteButton = this._element.querySelector(".icon__trash");

    this._imageElement.src = this._link;
    this._imageElement.alt = `imagen de ${this._name}`;
    this._titleElement.textContent = this._name;

    this._setEventListeners();

    return this._element;
  }
}
