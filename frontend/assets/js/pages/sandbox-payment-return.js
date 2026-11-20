const status = new URLSearchParams(window.location.search).get("status");
const trustedDestinations = {
  success: "./online-order-confirmation.html",
  failed: "./payment-failed.html",
};

window.location.replace(trustedDestinations[status] || "./payment-failed.html?state=invalid");
