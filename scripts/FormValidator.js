export default class FormValidator {
  constructor(config, formElement) {
    this._config = config;
    this._form = formElement;
    if (!this._form) throw new Error("FormValidator: formElement no encontrado");

    this._inputs = Array.from(
      this._form.querySelectorAll(this._config.inputSelector)
    );
    this._submitButton = this._form.querySelector(
      this._config.submitButtonSelector
    );
  }

  enableValidation() {
   
    this._form.addEventListener("submit", (e) => e.preventDefault());

  
    this._inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this._checkInputValidity(input);
        this._toggleButtonState();
      });
    });

    this._toggleButtonState();
  }

  _toggleButtonState() {
    const hasInvalid = this._inputs.some((i) => !i.validity.valid);
    if (!this._submitButton) return;
    if (hasInvalid) {
      this._submitButton.disabled = true;
      this._submitButton.classList.add(this._config.inactiveButtonClass);
    } else {
      this._submitButton.disabled = false;
      this._submitButton.classList.remove(this._config.inactiveButtonClass);
    }
  }

  _checkInputValidity(input) {
    if (input.validity.valid) {
      this._hideInputError(input);
    } else {
      this._showInputError(input, input.validationMessage);
    }
  }

  _hideInputError(input) {
    input.classList.remove(this._config.inputErrorClass);

    if (!input || !input.id || !this._form) return;
    const errorEl = this._form.querySelector(`#${input.id}-error`);
    if (!errorEl) return;

    errorEl.textContent = "";
    errorEl.classList.remove(this._config.errorClass);
  }

  _showInputError(input, message) {
    input.classList.add(this._config.inputErrorClass);

    if (!input || !input.id || !this._form) return;
    const errorEl = this._form.querySelector(`#${input.id}-error`);
    if (!errorEl) return;

    errorEl.textContent = message;
    errorEl.classList.add(this._config.errorClass);
  }
}
