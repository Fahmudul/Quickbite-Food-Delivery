document.addEventListener("DOMContentLoaded", function () {

  var orderList = document.getElementById("orderList");
  var noOrdersMessage = document.getElementById("noOrdersMessage");

  function getSeedOrders() {
    return [
      {
        id: "QB-1048",
        restaurant: "Burger House",
        items: 3,
        payment: "COD",
        total: 430,
        address: "House 12, Road 5, Dhanmondi, Dhaka",
        status: "accepted"
      },
      {
        id: "QB-1034",
        restaurant: "Spice Kitchen",
        items: 4,
        payment: "COD",
        total: 740,
        address: "House 12, Road 5, Dhanmondi, Dhaka",
        status: "delivered"
      },
      {
        id: "QB-1015",
        restaurant: "Pizza Corner",
        items: 2,
        payment: "COD",
        total: 310,
        address: "House 12, Road 5, Dhanmondi, Dhaka",
        status: "cancelled"
      }
    ];
  }

  function getOrders() {
    var orders = JSON.parse(localStorage.getItem("quickbite_orders"));
    if (!orders) {
      orders = getSeedOrders();
      localStorage.setItem("quickbite_orders", JSON.stringify(orders));
    }
    return orders;
  }

  function statusLabel(status) {
    var labels = {
      accepted: "Accepted",
      preparing: "Preparing",
      ready: "Ready for Pickup",
      pickedup: "Picked Up",
      delivered: "Delivered",
      cancelled: "Cancelled"
    };
    return labels[status] || status;
  }

  function buildOrderRow(order) {
    var row = document.createElement("div");
    row.className = "order-row";

    var left = document.createElement("div");

    var title = document.createElement("h2");
    title.className = "order-row-title";
    title.textContent = "#" + order.id + " • " + order.restaurant;

    var price = document.createElement("p");
    price.className = "order-row-price";
    price.textContent = "৳" + order.total;

    left.appendChild(title);
    left.appendChild(price);

    var right = document.createElement("div");
    right.className = "order-row-right";

    var badge = document.createElement("span");
    badge.className = "status-badge";
    if (order.status === "cancelled") {
      badge.classList.add("status-badge-cancelled");
    }
    badge.textContent = statusLabel(order.status);

    var viewLink = document.createElement("a");
    viewLink.href = "Current Order Tracking.html?id=" + encodeURIComponent(order.id);
    viewLink.className = "view-details-link";
    viewLink.textContent = "View details";

    right.appendChild(badge);
    right.appendChild(viewLink);

    row.appendChild(left);
    row.appendChild(right);

    return row;
  }

  function renderOrders() {
    var orders = getOrders();

    orderList.innerHTML = "";

    if (orders.length === 0) {
      noOrdersMessage.classList.remove("hidden");
      return;
    }

    noOrdersMessage.classList.add("hidden");
    orders.forEach(function (order) {
      orderList.appendChild(buildOrderRow(order));
    });
  }

  renderOrders();
  
  var cartCountBadge = document.getElementById("cartCount");
  var cartData = JSON.parse(localStorage.getItem("quickbite_cart"));
  if (cartCountBadge && cartData && cartData.items && cartData.items.length > 0) {
    var totalItems = 0;
    for (var i = 0; i < cartData.items.length; i++) {
      totalItems += cartData.items[i].qty;
    }
    cartCountBadge.textContent = totalItems;
  }
});
