/*
 * Order Confirmation (CUST-08) for both COD and sandbox-paid orders.
 * Added during integration: fills the QB-DEV-022 confirmation layout from the
 * order created at checkout (?id=QB-xxxx), replacing the separate
 * online-order-confirmation page from QB-DEV-023.
 */
document.addEventListener("DOMContentLoaded", function () {
  var orderId = new URLSearchParams(window.location.search).get("id");
  var order = orderId ? qbFindOrder(orderId) : null;

  if (!order) {
    return; // keep the sample content when opened directly
  }

  document.getElementById("confirmOrderId").textContent = order.id;
  document.getElementById("confirmRestaurantText").textContent = order.restaurant;
  document.getElementById("confirmRestaurant").textContent = order.restaurant;
  document.getElementById("confirmPayment").textContent =
    order.payment === "COD" ? "Cash on Delivery" : order.payment;
  document.getElementById("confirmTotal").textContent = "৳ " + order.total;
  document.getElementById("trackOrderLink").href =
    "./current-order-tracking.html?id=" + encodeURIComponent(order.id);
});
