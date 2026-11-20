const form = document.querySelector("#checkout-form");
const error = document.querySelector("#payment-error");
const submitButton = document.querySelector(".place-order-button");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  error.textContent = "";

  const paymentMethod = new FormData(form).get("payment-method");
  if (!paymentMethod) {
    error.textContent = "Choose a payment method before placing the order.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Placing order…";

  if (paymentMethod === "cod") {
    window.location.href = "./order-confirmation.html";
    return;
  }

  window.location.href = "./sandbox-payment.html";
});
