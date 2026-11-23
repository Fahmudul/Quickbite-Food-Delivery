
document.addEventListener("DOMContentLoaded", function () {

  var cartItemsContainer = document.getElementById("cartItemsContainer");
  var emptyCartMessage = document.getElementById("emptyCartMessage");
  var cartPageTitle = document.getElementById("cartPageTitle");
  var orderSummaryValue = document.getElementById("orderSummaryValue");

  var cartConflictCard = document.getElementById("cartConflictCard");
  var conflictText = document.getElementById("conflictText");
  var keepCartBtn = document.getElementById("keepCartBtn");
  var replaceCartBtn = document.getElementById("replaceCartBtn");


  function getCart() {
    return JSON.parse(localStorage.getItem("quickbite_cart")) || { restaurant: "", items: [] };
  }

  function saveCart(cart) {
    localStorage.setItem("quickbite_cart", JSON.stringify(cart));
  }


  function buildCartItemElement(item, index) {
    var card = document.createElement("div");
    card.className = "cart-item";

    var info = document.createElement("div");
    info.className = "cart-item-info";

    var name = document.createElement("h3");
    name.className = "cart-item-name";
    name.textContent = item.name;

    var price = document.createElement("p");
    price.className = "cart-item-price";
    price.textContent = "৳" + item.price;

    var desc = document.createElement("p");
    desc.className = "cart-item-desc";
    desc.textContent = "Special instructions: None";

    info.appendChild(name);
    info.appendChild(price);
    info.appendChild(desc);

    var actions = document.createElement("div");
    actions.className = "cart-item-actions";

    var stepper = document.createElement("div");
    stepper.className = "qty-stepper";

    var minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "qty-btn";
    minusBtn.textContent = "−";
    minusBtn.addEventListener("click", function () {
      changeQuantity(index, -1);
    });

    var qtyValue = document.createElement("span");
    qtyValue.className = "qty-value";
    qtyValue.textContent = item.qty;

    var plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "qty-btn";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", function () {
      changeQuantity(index, 1);
    });

    stepper.appendChild(minusBtn);
    stepper.appendChild(qtyValue);
    stepper.appendChild(plusBtn);

    var removeLink = document.createElement("a");
    removeLink.href = "#";
    removeLink.className = "remove-link";
    removeLink.textContent = "Remove";
    removeLink.addEventListener("click", function (event) {
      event.preventDefault();
      removeItem(index);
    });

    actions.appendChild(stepper);
    actions.appendChild(removeLink);

    card.appendChild(info);
    card.appendChild(actions);

    return card;
  }

  function renderCart() {
    var cart = getCart();

    cartPageTitle.textContent = cart.restaurant
      ? "Your cart — " + cart.restaurant
      : "Your cart";

    cartItemsContainer.innerHTML = "";

    if (cart.items.length === 0) {
      emptyCartMessage.classList.remove("hidden");
    } else {
      emptyCartMessage.classList.add("hidden");
      cart.items.forEach(function (item, index) {
        cartItemsContainer.appendChild(buildCartItemElement(item, index));
      });
    }

    updateOrderSummary(cart);
    updateCartBadge(cart);
  }

  function updateOrderSummary(cart) {
    var total = 0;
    for (var i = 0; i < cart.items.length; i++) {
      total += cart.items[i].price * cart.items[i].qty;
    }
    orderSummaryValue.textContent = "৳" + total;
  }

  function updateCartBadge(cart) {
    var cartCountBadge = document.getElementById("cartCount");
    if (!cartCountBadge) {
      return;
    }
    var totalItems = 0;
    for (var i = 0; i < cart.items.length; i++) {
      totalItems += cart.items[i].qty;
    }
    cartCountBadge.textContent = totalItems > 0 ? totalItems : "";
  }

  function changeQuantity(index, amount) {
    var cart = getCart();
    cart.items[index].qty += amount;

    if (cart.items[index].qty < 1) {
      cart.items[index].qty = 1;
    }

    saveCart(cart);
    renderCart();
  }

  function removeItem(index) {
    var cart = getCart();
    cart.items.splice(index, 1);

    if (cart.items.length === 0) {
      cart.restaurant = "";
      delete cart.reservedAt; // removing every item releases the reservation (FR-16)
    }

    saveCart(cart);
    renderCart();
  }

  function checkPendingSwitch() {
    var pending = JSON.parse(localStorage.getItem("quickbite_pendingSwitch"));

    if (!pending) {
      cartConflictCard.classList.add("hidden");
      return;
    }

    conflictText.textContent = "Your cart currently has items from " + getCart().restaurant +
      ". Adding " + pending.item.name + " from " + pending.restaurant +
      " will clear your current cart and start a new one.";
    cartConflictCard.classList.remove("hidden");
  }

  keepCartBtn.addEventListener("click", function () {
    localStorage.removeItem("quickbite_pendingSwitch");
    cartConflictCard.classList.add("hidden");
  });

  replaceCartBtn.addEventListener("click", function () {
    var pending = JSON.parse(localStorage.getItem("quickbite_pendingSwitch"));
    if (!pending) {
      return;
    }

    var newCart = {
      restaurant: pending.restaurant,
      items: [pending.item],
      reservedAt: Date.now() // a replaced cart starts a new 15-minute window
    };
    saveCart(newCart);
    localStorage.removeItem("quickbite_pendingSwitch");

    cartConflictCard.classList.add("hidden");
    renderCart();
  });

  var checkoutBtn = document.getElementById("checkoutBtn");
  var reservationExpired = false;

  checkoutBtn.addEventListener("click", function () {
    var cart = getCart();
    if (cart.items.length === 0) {
      alert("Your cart is empty. Add an item before checking out.");
      return;
    }

    if (reservationExpired) {
      alert("Your cart reservation has expired. Please reserve the items again before checkout.");
      return;
    }

    // Integration: the order is now created on the Checkout page (CUST-06),
    // after address and payment validation, instead of directly from the cart.
    window.location.href = "checkout.html";
  });

  // Integration: live 15-minute countdown from QB-DEV-019 (features/cart/reservation-timer.js).
  startReservationCountdown(document.getElementById("reservationCountdown"), function () {
    reservationExpired = true;
    checkoutBtn.disabled = true;
  });

  renderCart();
  checkPendingSwitch();
});
