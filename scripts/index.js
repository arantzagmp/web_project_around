//alert('JS cargado');
let popup = document.querySelector('.popup');
let formElement = document.querySelector('.popup__container form');
let closeButton = document.querySelector('.popup__close-button');
let profileName = document.querySelector('.profile__name');
let profileJob = document.querySelector('.profile__subtitle');

function openPopup() {
  formElement.name.value = profileName.textContent;
  formElement.about.value = profileJob.textContent;

  popup.classList.add('popup__opened');
}

function closePopup() {
  popup.classList.remove('popup__opened');
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  let nameValue = formElement.name.value;
  let aboutValue = formElement.about.value;

  profileName.textContent = nameValue;
  profileJob.textContent = aboutValue;

  closePopup();
}

formElement.addEventListener('submit', handleProfileFormSubmit);
closeButton.addEventListener('click', closePopup);



