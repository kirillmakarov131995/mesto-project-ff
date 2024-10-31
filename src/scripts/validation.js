function isValid(defaultClasses, formElement, inputElement) {
  if (inputElement.validity.patternMismatch) {
    if (inputElement.dataset.errorMessage) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
      inputElement.setCustomValidity("Какой-то символ или буква не подходит");
    }
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(
      defaultClasses,
      formElement,
      inputElement,
      inputElement.validationMessage
    );
  } else {
    hideInputError(defaultClasses, formElement, inputElement);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function toggleButtonState(defaultClasses, inputList, buttonElement) {
  // console.log(inputList)

  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(defaultClasses.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(defaultClasses.inactiveButtonClass);
  }
}

function showInputError(
  defaultClasses,
  formElement,
  inputElement,
  errorMessage
) {
  // console.log(inputElement.name)
  const errorElement = formElement.querySelector(
    `.${inputElement.name}-input-error`
  );
  inputElement.classList.add(defaultClasses.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(defaultClasses.errorClass);
}

function hideInputError(defaultClasses, formElement, inputElement) {
  const errorElement = formElement.querySelector(
    `.${inputElement.name}-input-error`
  );
  inputElement.classList.remove(defaultClasses.inputErrorClass);
  errorElement.classList.remove(defaultClasses.errorClass);
  errorElement.textContent = "";
}

function selectFormInputs(defaultClasses, formElement) {
  const inputList = Array.from(
    formElement.querySelectorAll(defaultClasses.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    defaultClasses.submitButtonSelector
  );

  return { inputList, buttonElement };
}

function clearValidation(validationConfig, formElement) {
  const { inputList, buttonElement } = selectFormInputs(
    validationConfig,
    formElement
  );

  formElement.reset();

  inputList.forEach((item) => {
    const errorElement = formElement.querySelector(`.${item.name}-input-error`);
    errorElement.classList.remove(validationConfig.errorClass);
    item.classList.remove(validationConfig.inputErrorClass);
  });

  toggleButtonState(validationConfig, inputList, buttonElement);
}

function setEventListeners(defaultClasses, formElement) {
  const { inputList, buttonElement } = selectFormInputs(
    defaultClasses,
    formElement
  );

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isValid(defaultClasses, formElement, inputElement);
      toggleButtonState(defaultClasses, inputList, buttonElement);
    });
  });

  toggleButtonState(defaultClasses, inputList, buttonElement);
}

function enableValidation(defaultClasses) {
  const formList = Array.from(
    document.querySelectorAll(defaultClasses.formSelector)
  );

  formList.forEach((formElement) => {
    setEventListeners(defaultClasses, formElement);
  });
}

export { enableValidation, clearValidation };
