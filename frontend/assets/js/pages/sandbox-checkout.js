const form = document.querySelector("#online-checkout-form");
const error = document.querySelector("#payment-error");
const submitButton = document.querySelector(".payment-submit");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const method = new FormData(form).get("payment-method");
  if (!method) {
    error.textContent = "Choose a payment method before placing the order.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Redirecting…";
  window.location.href = method === "online"
    ? "./sandbox-payment-return.html?status=failed"
    : "./order-confirmation.html";
});
