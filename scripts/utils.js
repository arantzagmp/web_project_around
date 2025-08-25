export function openPopup(popupElement) {
  popupElement.classList.add("popup__opened");
}

export function closePopup(popupElement) {
  popupElement.classList.remove("popup__opened");
  popupElement.classList.remove("popupCreate__opened");
  popupElement.classList.remove("popupImage__opened");
}

export function openPopupCreate(popupElement) {
  popupElement.classList.add("popupCreate__opened");
}

export function closePopupCreate(popupElement) {
  popupElement.classList.remove("popupCreate__opened");
}

export function enableOverlayClose(popupElement) {
  popupElement.addEventListener("mousedown", (event) => {
    if (event.target === popupElement) {
      closePopup(popupElement);
    }
  });
}

export function enableEscClose(popups) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      popups.forEach((popup) => {
        if (
          popup.classList.contains("popup__opened") ||
          popup.classList.contains("popupCreate__opened") ||
          popup.classList.contains("popupImage__opened")
        ) {
          closePopup(popup);
        }
      });
    }
  });
}
