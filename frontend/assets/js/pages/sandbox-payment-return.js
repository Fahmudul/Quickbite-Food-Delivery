const status = new URLSearchParams(window.location.search).get("status");
const trustedDestinations = {
  success: "./order-confirmation.html",
  failed: "./payment-retry.html",
};

// Integration: only a verified success creates the order (FR-20, FR-23).
// The order is built from the checkout snapshot frozen on the Checkout page.
if (status === "success") {
  const pending = JSON.parse(localStorage.getItem("quickbite_pendingCheckout"));

  if (pending) {
    const order = qbCreateOrder(pending.cart, "Online Payment", pending.address);
    localStorage.removeItem("quickbite_pendingCheckout");
    window.location.replace(`${trustedDestinations.success}?id=${encodeURIComponent(order.id)}`);
  } else {
    // No frozen checkout to pay for: never show an unverified order as placed.
    window.location.replace("./payment-retry.html?state=pending");
  }
} else {
  // Unknown results are not failures: show the "verification pending" state (SRS §9).
  window.location.replace(trustedDestinations[status] || "./payment-retry.html?state=pending");
}
