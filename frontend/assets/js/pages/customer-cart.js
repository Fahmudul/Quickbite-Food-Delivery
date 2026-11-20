const cartItems = document.querySelector("#cart-items");
const subtotal = document.querySelector("#cart-subtotal");
const countdown = document.querySelector("#reservation-countdown");
const checkoutButton = document.querySelector(".checkout-button");

function updateSubtotal() {
  const total = [...cartItems.querySelectorAll(".cart-item")].reduce((sum, item) => {
    const quantity = Number(item.querySelector(".quantity").textContent);
    return sum + Number(item.dataset.price) * quantity;
  }, 0);

  subtotal.textContent = `৳ ${total}`;
  checkoutButton.classList.toggle("is-disabled", total === 0);
  checkoutButton.setAttribute("aria-disabled", String(total === 0));

  if (total === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  }
}

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const item = button.closest(".cart-item");
  const quantityElement = item.querySelector(".quantity");
  const quantity = Number(quantityElement.textContent);

  if (button.dataset.action === "increase") quantityElement.textContent = quantity + 1;
  if (button.dataset.action === "decrease" && quantity > 1) quantityElement.textContent = quantity - 1;
  if (button.dataset.action === "remove") item.remove();

  updateSubtotal();
});

let secondsRemaining = Number(countdown.dataset.seconds);
const timer = window.setInterval(() => {
  secondsRemaining -= 1;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = String(secondsRemaining % 60).padStart(2, "0");
  countdown.textContent = `${minutes}:${seconds} remaining`;

  if (secondsRemaining <= 0) {
    window.clearInterval(timer);
    countdown.textContent = "Reservation expired";
    checkoutButton.href = "./expired-cart.html";
    checkoutButton.textContent = "Review expired cart";
  }
}, 1000);

document.querySelector("#keep-cart").addEventListener("click", () => {
  document.querySelector("#switch-confirmation").hidden = true;
});

document.querySelector("#replace-cart").addEventListener("click", () => {
  window.location.href = "./restaurants.html";
});
