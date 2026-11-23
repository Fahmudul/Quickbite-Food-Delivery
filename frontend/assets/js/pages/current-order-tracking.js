var STATUS_STEPS = ["accepted", "preparing", "ready", "pickedup", "delivered"];
var POLL_INTERVAL_MS = 12000;

var pollTimer = null;

document.addEventListener("DOMContentLoaded", function () {

  var orderIdHeading = document.getElementById("orderIdHeading");
  var orderStatusBadge = document.getElementById("orderStatusBadge");
  var trackingSubtitle = document.getElementById("trackingSubtitle");
  var retryNotice = document.getElementById("retryNotice");
  var cancelOrderBtn = document.getElementById("cancelOrderBtn");
  var cancelNote = document.getElementById("cancelNote");

  var detailRestaurant = document.getElementById("detailRestaurant");
  var detailItems = document.getElementById("detailItems");
  var detailPayment = document.getElementById("detailPayment");
  var detailTotal = document.getElementById("detailTotal");
  var detailNote = document.getElementById("detailNote");

  var currentOrderId = getOrderIdFromUrl();

  function getOrders() {
    var orders = JSON.parse(localStorage.getItem("quickbite_orders"));
    if (!orders) {
      orders = getSeedOrders();
      localStorage.setItem("quickbite_orders", JSON.stringify(orders));
    }
    return orders;
  }

  function saveOrders(orders) {
    localStorage.setItem("quickbite_orders", JSON.stringify(orders));
  }

  function getOrderIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function findOrder(orders, id) {
    if (id) {
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
          return orders[i];
        }
      }
    }

    return orders[0];
  }

  function renderOrder(order) {
    orderIdHeading.textContent = "Order #" + order.id;

    orderStatusBadge.textContent = statusLabel(order.status);
    orderStatusBadge.className = "status-badge";
    if (order.status === "cancelled") {
      orderStatusBadge.classList.add("status-badge-cancelled");
    }

    detailRestaurant.textContent = order.restaurant;
    detailItems.textContent = order.items + (order.items === 1 ? " item" : " items");
    detailPayment.textContent = order.payment;
    detailTotal.textContent = "৳" + order.total;
    detailNote.textContent = "Delivered to " + order.address + ".";

    renderSteps(order.status);

    if (order.status === "cancelled") {
      trackingSubtitle.textContent = "This order was cancelled.";
      cancelOrderBtn.disabled = true;
      cancelNote.textContent = "This order has already been cancelled.";
    } else if (order.status === "delivered") {
      trackingSubtitle.textContent = "This order has been delivered.";
      cancelOrderBtn.disabled = true;
      cancelNote.textContent = "Delivered orders can no longer be cancelled.";
    } else {
      trackingSubtitle.textContent = "Status updates automatically while this page is open.";
      // Integration: QB-DEV-027 rule - customers may cancel only while Accepted (FR-24, BR-10).
      var canCancel = canCustomerCancel(order);
      cancelOrderBtn.disabled = !canCancel;
      cancelNote.textContent = canCancel
        ? "You can cancel this order only while it's still Accepted."
        : "The restaurant has started preparing this order, so it can no longer be cancelled.";
    }
  }

  function statusLabel(status) {
    if (status === "cancelled") {
      return "Cancelled";
    }
    var index = STATUS_STEPS.indexOf(status);
    var step = document.querySelector('.status-step[data-status="' + status + '"] .step-title');
    return step ? step.textContent : status;
  }


  function renderSteps(status) {
    var stepElements = document.querySelectorAll(".status-step");
    var currentIndex = STATUS_STEPS.indexOf(status);

    stepElements.forEach(function (stepEl) {
      var stepStatus = stepEl.getAttribute("data-status");
      var stepIndex = STATUS_STEPS.indexOf(stepStatus);

      stepEl.classList.remove("step-active", "step-complete", "step-cancelled");

      if (status === "cancelled") {
        stepEl.classList.add("step-cancelled");
      } else if (stepIndex < currentIndex) {
        stepEl.classList.add("step-complete");
      } else if (stepIndex === currentIndex) {
        stepEl.classList.add("step-active");
      }
    });
  }

  cancelOrderBtn.addEventListener("click", function () {
    var confirmed = confirm("Cancel this order?");
    if (!confirmed) {
      return;
    }

    var orders = getOrders();
    var order = findOrder(orders, currentOrderId);

    // The status may have changed since the page was rendered.
    if (!canCustomerCancel(order)) {
      renderOrder(order);
      return;
    }

    var message = cancelCustomerOrder(order);
    saveOrders(orders);

    renderOrder(order);
    cancelNote.textContent = message;
    stopPolling();
  });

  function pollOrderStatus() {
    var orders = getOrders();
    var order = findOrder(orders, currentOrderId);

    var simulatedNetworkFailure = Math.random() < 0.15;

    if (simulatedNetworkFailure) {
      retryNotice.classList.remove("hidden");
      return;
    }

    retryNotice.classList.add("hidden");

    var currentIndex = STATUS_STEPS.indexOf(order.status);
    if (order.status !== "cancelled" && currentIndex > -1 && currentIndex < STATUS_STEPS.length - 1) {
      order.status = STATUS_STEPS[currentIndex + 1];
      saveOrders(orders);
    }

    renderOrder(order);

    if (order.status === "delivered" || order.status === "cancelled") {
      stopPolling();
    }
  }

  function startPolling() {
    if (pollTimer) {
      return;
    }
    pollTimer = setInterval(pollOrderStatus, POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

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

  var orders = getOrders();
  var currentOrder = findOrder(orders, currentOrderId);
  renderOrder(currentOrder);

  if (currentOrder.status !== "delivered" && currentOrder.status !== "cancelled") {
    startPolling();
  }

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
