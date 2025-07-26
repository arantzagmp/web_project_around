export function enableValidation(config) {
  const {
    formSelector,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass
  } = config;

  const forms = Array.from(document.querySelectorAll(formSelector));

  forms.forEach((form) => {
    const inputs = Array.from(form.querySelectorAll(inputSelector));
    const button = form.querySelector(submitButtonSelector);

    const showError = (input, errorMessage) => {
      const errorElement = form.querySelector(`.${input.id}-error`);
      input.classList.add(inputErrorClass);
      errorElement.textContent = errorMessage;
      errorElement.classList.add(errorClass);
    };

    const hideError = (input) => {
      const errorElement = form.querySelector(`.${input.id}-error`);
      input.classList.remove(inputErrorClass);
      errorElement.classList.remove(errorClass);
      errorElement.textContent = "";
    };

    const checkInputValidity = (input) => {
      let errorMessage = "";

      if (input.validity.valueMissing) {
        errorMessage = "Este campo es obligatorio.";
      } else if (input.validity.tooShort || input.validity.tooLong) {
        switch (input.name) {
          case "title":
            errorMessage = "El campo 'Título' debe contener entre 2 y 30 caracteres.";
            break;
          case "name":
            errorMessage = "El campo 'Nombre' debe contener entre 2 y 40 caracteres.";
            break;
          case "about":
            errorMessage = "El campo 'Acerca de' debe contener entre 2 y 200 caracteres.";
            break;
        }
      } else if (input.validity.typeMismatch && input.type === "url") {
        if (input.name === "image") {
          errorMessage = "El campo 'URL de la imagen' debe contener una URL válida.";
        }
      }

      if (errorMessage) {
        showError(input, errorMessage);
      } else {
        hideError(input);
      }
    };

    const hasInvalidInput = () => {
      return inputs.some((input) => !input.validity.valid);
    };

    const toggleButtonState = () => {
      if (hasInvalidInput()) {
        button.classList.add(inactiveButtonClass);
        button.disabled = true;
      } else {
        button.classList.remove(inactiveButtonClass);
        button.disabled = false;
      }
    };

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        checkInputValidity(input);
        toggleButtonState();
      });
    });

    toggleButtonState();
  });
}
