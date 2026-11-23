var CURRENT_RESTAURANT = "Burger House";

document.addEventListener("DOMContentLoaded", function () {

  var addButtons = document.querySelectorAll(".btn-add-cart");

  addButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var menuItem = button.closest(".menu-item");
      var itemName = menuItem.getAttribute("data-name");
      var itemPrice = Number(menuItem.getAttribute("data-price"));

      var cart = JSON.parse(localStorage.getItem("quickbite_cart"));

      if (!cart || !cart.items || cart.items.length === 0) {
        addItemToNewCart(itemName, itemPrice);
      } else if (cart.restaurant === CURRENT_RESTAURANT) {
        addItemToExistingCart(cart, itemName, itemPrice);
      } else {
        localStorage.setItem("quickbite_pendingSwitch", JSON.stringify({
          restaurant: CURRENT_RESTAURANT,
          item: { name: itemName, price: itemPrice, qty: 1 }
        }));
        window.location.href = "active-cart.html";
        return;
      }

      showAddedFeedback(button);
      updateCartBadge();
    });
  });

  function addItemToNewCart(itemName, itemPrice) {
    var newCart = {
      restaurant: CURRENT_RESTAURANT,
      items: [{ name: itemName, price: itemPrice, qty: 1 }],
      reservedAt: Date.now() // first item starts the single 15-minute window (FR-14, BR-04)
    };
    localStorage.setItem("quickbite_cart", JSON.stringify(newCart));
  }

  function addItemToExistingCart(cart, itemName, itemPrice) {
    var existingItem = null;
    for (var i = 0; i < cart.items.length; i++) {
      if (cart.items[i].name === itemName) {
        existingItem = cart.items[i];
        break;
      }
    }

    if (existingItem) {
      existingItem.qty = existingItem.qty + 1;
    } else {
      cart.items.push({ name: itemName, price: itemPrice, qty: 1 });
    }

    localStorage.setItem("quickbite_cart", JSON.stringify(cart));
  }

  function showAddedFeedback(button) {
    var originalText = button.textContent;
    button.textContent = "Added!";
    button.disabled = true;

    setTimeout(function () {
      button.textContent = originalText;
      button.disabled = false;
    }, 1000);
  }

  function updateCartBadge() {
    var cartCountBadge = document.getElementById("cartCount");
    if (!cartCountBadge) {
      return;
    }

    var cart = JSON.parse(localStorage.getItem("quickbite_cart"));
    var totalItems = 0;

    if (cart && cart.items) {
      for (var i = 0; i < cart.items.length; i++) {
        totalItems += cart.items[i].qty;
      }
    }

    cartCountBadge.textContent = totalItems > 0 ? totalItems : "";
  }

  updateCartBadge();
});
