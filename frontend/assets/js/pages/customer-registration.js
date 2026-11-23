document.addEventListener("DOMContentLoaded", function () {

  var signupForm = document.getElementById("signupForm");

  var fullNameInput = document.getElementById("fullName");
  var emailInput = document.getElementById("email");
  var phoneInput = document.getElementById("phone");
  var passwordInput = document.getElementById("password");
  var confirmPasswordInput = document.getElementById("confirmPassword");

  var fullNameError = document.getElementById("fullNameError");
  var emailError = document.getElementById("emailError");
  var phoneError = document.getElementById("phoneError");
  var passwordError = document.getElementById("passwordError");
  var confirmPasswordError = document.getElementById("confirmPasswordError");
  var formError = document.getElementById("formError");

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phonePattern = /^01[0-9]{9}$/;

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    fullNameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    formError.textContent = "";

    var isValid = true;

    var fullName = fullNameInput.value.trim();
    var email = emailInput.value.trim();
    var phone = phoneInput.value.trim();
    var password = passwordInput.value;
    var confirmPassword = confirmPasswordInput.value;

    if (fullName === "") {
      fullNameError.textContent = "Full name is required.";
      isValid = false;
    }

    if (email === "") {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      emailError.textContent = "Enter a valid email address.";
      isValid = false;
    }

    if (phone === "") {
      phoneError.textContent = "Phone number is required.";
      isValid = false;
    } else if (!phonePattern.test(phone)) {
      phoneError.textContent = "Enter an 11-digit number starting with 01.";
      isValid = false;
    }

    if (password === "") {
      passwordError.textContent = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (confirmPassword === "") {
      confirmPasswordError.textContent = "Please confirm your password.";
      isValid = false;
    } else if (confirmPassword !== password) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    var users = JSON.parse(localStorage.getItem("quickbite_users")) || [];

    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === email.toLowerCase()) {
        formError.textContent = "An account with this email already exists.";
        return;
      }
    }

    users.push({
      fullName: fullName,
      email: email,
      phone: phone,
      password: password
    });
    localStorage.setItem("quickbite_users", JSON.stringify(users));

    window.location.href = "login.html";
  });
});
