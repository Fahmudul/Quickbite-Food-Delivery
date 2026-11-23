
document.addEventListener("DOMContentLoaded", function () {

  var loginForm = document.getElementById("loginForm");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");

  var emailError = document.getElementById("emailError");
  var passwordError = document.getElementById("passwordError");
  var formError = document.getElementById("formError");


  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    emailError.textContent = "";
    passwordError.textContent = "";
    formError.textContent = "";

    var isValid = true;
    var email = emailInput.value.trim();
    var password = passwordInput.value;


    if (email === "") {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      emailError.textContent = "Enter a valid email address.";
      isValid = false;
    }

    if (password === "") {
      passwordError.textContent = "Password is required.";
      isValid = false;
    }


    if (!isValid) {
      return;
    }


    var users = JSON.parse(localStorage.getItem("quickbite_users")) || [];

    var matchedUser = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === email.toLowerCase() && users[i].password === password) {
        matchedUser = users[i];
        break;
      }
    }

    if (!matchedUser) {
      formError.textContent = "Invalid email or password.";
      return;
    }

    localStorage.setItem("quickbite_loggedInUser", email);

    window.location.href = "../customer/restaurant-discovery.html";
  });
});
