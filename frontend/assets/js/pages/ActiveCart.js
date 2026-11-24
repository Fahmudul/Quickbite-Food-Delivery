
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
      items: [pending.item]
    };
    saveCart(newCart);
    localStorage.removeItem("quickbite_pendingSwitch");

    cartConflictCard.classList.add("hidden");
    renderCart();
  });

  var checkoutBtn = document.getElementById("checkoutBtn");
  checkoutBtn.addEventListener("click", function () {
    var cart = getCart();
    if (cart.items.length === 0) {
      alert("Your cart is empty. Add an item before checking out.");
      return;
    }

    var totalItems = 0;
    var totalPrice = 0;
    for (var i = 0; i < cart.items.length; i++) {
      totalItems += cart.items[i].qty;
      totalPrice += cart.items[i].price * cart.items[i].qty;
    }

    var orders = JSON.parse(localStorage.getItem("quickbite_orders")) || [];

    var newOrder = {
      id: "QB-" + Math.floor(1000 + Math.random() * 9000),
      restaurant: cart.restaurant,
      items: totalItems,
      payment: "COD",
      total: totalPrice,
      address: "House 12, Road 5, Dhanmondi, Dhaka",
      status: "accepted"
    };

    orders.unshift(newOrder);
    localStorage.setItem("quickbite_orders", JSON.stringify(orders));

    saveCart({ restaurant: "", items: [] });

    window.location.href = "Current Order Tracking.html?id=" + encodeURIComponent(newOrder.id);
  });

  renderCart();
  checkPendingSwitch();
});
