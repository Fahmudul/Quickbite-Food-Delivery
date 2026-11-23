var formView = document.getElementById("formView");
var successView = document.getElementById("successView");
var applicationForm = document.getElementById("applicationForm");

var fullNameInput = document.getElementById("fullName");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");
var vehicleSelect = document.getElementById("vehicle");
var passwordInput = document.getElementById("password");

var fieldIds = ["name", "email", "phone", "vehicle", "password"];

function setError(name, message) {
  document.getElementById(name + "Error").textContent = message;
  document.getElementById(name + "Field").classList.add("field-error");
}

function clearErrors() {
  for (var i = 0; i < fieldIds.length; i++) {
    document.getElementById(fieldIds[i] + "Error").textContent = "";
    document.getElementById(fieldIds[i] + "Field").classList.remove("field-error");
  }
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

  var name = fullNameInput.value.trim();
  var email = emailInput.value.trim();
  var phone = phoneInput.value.trim();
  var vehicle = vehicleSelect.value;
  var password = passwordInput.value;

  if (name === "") {
    setError("name", "Full name is required.");
    valid = false;
  } else if (name.length < 3 || name.length > 50) {
    setError("name", "Name must be between 3 and 50 characters.");
    valid = false;
  } else if (!/^[A-Za-z .'-]+$/.test(name)) {
    setError("name", "Name can only contain letters and spaces.");
    valid = false;
  }

  if (email === "") {
    setError("email", "Email is required.");
    valid = false;
  } else if (email.length > 100) {
    setError("email", "Email is too long.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email", "Please enter a valid email address.");
    valid = false;
  }

  if (phone === "") {
    setError("phone", "Phone number is required.");
    valid = false;
  } else if (!/^(\+88)?01[3-9][0-9]{8}$/.test(phone)) {
    setError("phone", "Enter a valid phone number, e.g. 01712345678.");
    valid = false;
  }

  if (vehicle === "") {
    setError("vehicle", "Please select your vehicle type.");
    valid = false;
  }

  var passwordMessage = checkPassword(password);
  if (passwordMessage !== "") {
    setError("password", passwordMessage);
    valid = false;
  }

  return valid;
}

fullNameInput.addEventListener("input", clearErrors);
emailInput.addEventListener("input", clearErrors);
phoneInput.addEventListener("input", clearErrors);
vehicleSelect.addEventListener("change", clearErrors);
passwordInput.addEventListener("input", clearErrors);

applicationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  passwordInput.value = "";
  formView.classList.add("hidden");
  successView.classList.remove("hidden");
});
