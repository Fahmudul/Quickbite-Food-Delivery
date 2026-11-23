var resetView = document.getElementById("resetView");
var successView = document.getElementById("successView");
var invalidView = document.getElementById("invalidView");
var invalidText = document.getElementById("invalidText");

var resetForm = document.getElementById("resetForm");
var newPasswordInput = document.getElementById("newPassword");
var confirmPasswordInput = document.getElementById("confirmPassword");
var passwordField = document.getElementById("passwordField");
var confirmField = document.getElementById("confirmField");
var passwordError = document.getElementById("passwordError");
var confirmError = document.getElementById("confirmError");

function getToken() {
  var params = new URLSearchParams(window.location.search);
  return params.get("token");
}

function showInvalidLink(message) {
  if (message) {
    invalidText.textContent = message;
  }
  resetView.classList.add("hidden");
  successView.classList.add("hidden");
  invalidView.classList.remove("hidden");
}

function setError(field, errorBox, message) {
  errorBox.textContent = message;
  field.classList.add("field-error");
}

function clearErrors() {
  passwordError.textContent = "";
  confirmError.textContent = "";
  passwordField.classList.remove("field-error");
  confirmField.classList.remove("field-error");
}

function checkPassword(password) {
  if (password === "") {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password.length > 64) {
    return "Password cannot be more than 64 characters.";
  }
  if (password.indexOf(" ") !== -1) {
    return "Password cannot contain spaces.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must have at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must have at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must have at least one number.";
  }
  return "";
}

function validateForm() {
  var valid = true;
  clearErrors();

  var password = newPasswordInput.value;
  var confirm = confirmPasswordInput.value;

  var passwordMessage = checkPassword(password);
  if (passwordMessage !== "") {
    setError(passwordField, passwordError, passwordMessage);
    valid = false;
  }

  if (confirm === "") {
    setError(confirmField, confirmError, "Please confirm your password.");
    valid = false;
  } else if (password !== confirm) {
    setError(confirmField, confirmError, "Passwords do not match.");
    valid = false;
  }

  return valid;
}

newPasswordInput.addEventListener("input", clearErrors);
confirmPasswordInput.addEventListener("input", clearErrors);

resetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  var token = getToken();

  if (token === null || token.trim() === "") {
    showInvalidLink("This password reset link is invalid or has expired. Please request a new one.");
    return;
  }

  newPasswordInput.value = "";
  confirmPasswordInput.value = "";

  resetView.classList.add("hidden");
  successView.classList.remove("hidden");
});
