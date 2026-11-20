var forgotForm = document.getElementById("forgotForm");
var emailInput = document.getElementById("email");
var emailField = document.getElementById("emailField");
var emailError = document.getElementById("emailError");
var messageBox = document.getElementById("messageBox");
var sendBtn = document.getElementById("sendBtn");

function showError(message) {
  emailError.textContent = message;
  emailField.classList.add("field-error");
}

function clearError() {
  emailError.textContent = "";
  emailField.classList.remove("field-error");
}

function validateEmail() {
  var email = emailInput.value.trim();

  if (email === "") {
    showError("Email is required.");
    return false;
  }

  if (email.length > 100) {
    showError("Email is too long.");
    return false;
  }

  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) {
    showError("Please enter a valid email address.");
    return false;
  }

  return true;
}

emailInput.addEventListener("input", function () {
  clearError();
});

forgotForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearError();
  messageBox.classList.add("hidden");

  if (!validateEmail()) {
    return;
  }

  messageBox.textContent = "If an account exists for this email, a password reset link has been sent. Please check your inbox.";
  messageBox.classList.remove("hidden");

  sendBtn.disabled = true;
  setTimeout(function () {
    sendBtn.disabled = false;
  }, 5000);
});
