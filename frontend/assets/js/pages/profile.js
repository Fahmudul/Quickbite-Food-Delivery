var MAX_IMAGE_SIZE = 2 * 1024 * 1024;

var profile = {
  fullName: "",
  email: "",
  phone: "",
  picture: ""
};

var successMessage = document.getElementById("successMessage");

var avatarImg = document.getElementById("avatarImg");
var avatarInitials = document.getElementById("avatarInitials");
var uploadBtn = document.getElementById("uploadBtn");
var removePhotoBtn = document.getElementById("removePhotoBtn");
var photoInput = document.getElementById("photoInput");
var photoError = document.getElementById("photoError");

var profileForm = document.getElementById("profileForm");
var fullNameInput = document.getElementById("fullName");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");

function getInitials(name) {
  var words = name.trim().split(" ");
  var letters = words[0].charAt(0);
  if (words.length > 1) {
    letters = letters + words[words.length - 1].charAt(0);
  }
  return letters.toUpperCase();
}

function showProfile() {
  fullNameInput.value = profile.fullName;
  emailInput.value = profile.email;
  phoneInput.value = profile.phone;

  if (profile.picture) {
    avatarImg.src = profile.picture;
    avatarImg.classList.remove("hidden");
    avatarInitials.classList.add("hidden");
  } else {
    avatarImg.classList.add("hidden");
    avatarInitials.classList.remove("hidden");
    avatarInitials.textContent = getInitials(profile.fullName);
  }
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.remove("hidden");
  setTimeout(function () {
    successMessage.classList.add("hidden");
  }, 3000);
}

function setError(fieldId, errorId, message) {
  document.getElementById(errorId).textContent = message;
  document.getElementById(fieldId).classList.add("field-error");
}

function clearErrors() {
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("nameField").classList.remove("field-error");
  document.getElementById("emailField").classList.remove("field-error");
  document.getElementById("phoneField").classList.remove("field-error");
}

function validateForm() {
  var valid = true;
  clearErrors();

  var name = fullNameInput.value.trim();
  var email = emailInput.value.trim();
  var phone = phoneInput.value.trim();

  if (name === "") {
    setError("nameField", "nameError", "Full name is required.");
    valid = false;
  } else if (name.length < 3 || name.length > 50) {
    setError("nameField", "nameError", "Name must be between 3 and 50 characters.");
    valid = false;
  } else if (!/^[A-Za-z .'-]+$/.test(name)) {
    setError("nameField", "nameError", "Name can only contain letters and spaces.");
    valid = false;
  }

  if (email === "") {
    setError("emailField", "emailError", "Email is required.");
    valid = false;
  } else if (email.indexOf("@") === -1) {
    setError("emailField", "emailError", "Email must contain the @ symbol.");
    valid = false;
  } else if (email.length > 100) {
    setError("emailField", "emailError", "Email is too long.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("emailField", "emailError", "Please enter a valid email address.");
    valid = false;
  }

  if (phone === "") {
    setError("phoneField", "phoneError", "Phone number is required.");
    valid = false;
  } else if (!/^(\+88)?01[3-9][0-9]{8}$/.test(phone)) {
    setError("phoneField", "phoneError", "Enter a valid phone number, e.g. 01712345678.");
    valid = false;
  }

  return valid;
}

fullNameInput.addEventListener("input", clearErrors);
emailInput.addEventListener("input", clearErrors);
phoneInput.addEventListener("input", clearErrors);

profileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  profile.fullName = fullNameInput.value.trim();
  profile.email = emailInput.value.trim();
  profile.phone = phoneInput.value.trim();

  showProfile();
  showSuccess("Profile updated successfully.");
});

uploadBtn.addEventListener("click", function () {
  photoInput.click();
});

photoInput.addEventListener("change", function () {
  photoError.textContent = "";

  var file = photoInput.files[0];
  if (!file) {
    return;
  }

  var fileName = file.name.toLowerCase();
  var goodType = (file.type === "image/jpeg" || file.type === "image/png");
  var goodExtension = fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png");

  if (!goodType || !goodExtension) {
    photoError.textContent = "Only JPG and PNG images are allowed.";
    photoInput.value = "";
    return;
  }

  if (file.size === 0) {
    photoError.textContent = "This file is empty.";
    photoInput.value = "";
    return;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    photoError.textContent = "Image is too large. Maximum size is 2 MB.";
    photoInput.value = "";
    return;
  }

  var reader = new FileReader();

  reader.onload = function (e) {
    var dataUrl = e.target.result;
    var testImage = new Image();

    testImage.onload = function () {
      profile.picture = dataUrl;
      showProfile();
      showSuccess("Profile picture updated.");
      photoInput.value = "";
    };

    testImage.onerror = function () {
      photoError.textContent = "This file is not a valid image.";
      photoInput.value = "";
    };

    testImage.src = dataUrl;
  };

  reader.onerror = function () {
    photoError.textContent = "Could not read the file. Please try again.";
    photoInput.value = "";
  };

  reader.readAsDataURL(file);
});

removePhotoBtn.addEventListener("click", function () {
  photoError.textContent = "";

  if (profile.picture === "") {
    photoError.textContent = "You do not have a profile picture to remove.";
    return;
  }

  var sure = confirm("Remove your profile picture?");
  if (!sure) {
    return;
  }

  profile.picture = "";
  showProfile();
  showSuccess("Profile picture removed.");
});

showProfile();
