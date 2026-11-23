/*
 * Cart reservation countdown (SRS FR-14, FR-16, BR-04).
 *
 * Countdown logic comes from QB-DEV-019 (customer-cart.js). It was moved here
 * during integration so the Active Cart and Checkout pages share one timer.
 *
 * Rules:
 * - One 15-minute window per cart, starting when the first item is added.
 * - Adding more items does NOT restart the window.
 * - The start time is stored on the cart as `reservedAt` (milliseconds).
 *
 * Until the PHP backend exists, the cart lives in localStorage ("quickbite_cart").
 */
var QB_RESERVATION_MINUTES = 15;

function getReservationSecondsLeft(cart) {
  if (!cart || !cart.items || cart.items.length === 0 || !cart.reservedAt) {
    return 0;
  }

  var expiresAt = cart.reservedAt + QB_RESERVATION_MINUTES * 60 * 1000;
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}

function formatReservationTime(secondsRemaining) {
  var minutes = Math.floor(secondsRemaining / 60);
  var seconds = String(secondsRemaining % 60).padStart(2, "0");
  return minutes + ":" + seconds + " remaining";
}

/*
 * Updates `countdownElement` every second.
 * Calls `onExpire` once when the reservation runs out.
 */
function startReservationCountdown(countdownElement, onExpire) {
  var timer = null;

  function tick() {
    var cart = JSON.parse(localStorage.getItem("quickbite_cart"));

    if (!cart || !cart.items || cart.items.length === 0) {
      countdownElement.textContent = "No active reservation";
      return;
    }

    // Carts saved before the timer existed get their window started now.
    if (!cart.reservedAt) {
      cart.reservedAt = Date.now();
      localStorage.setItem("quickbite_cart", JSON.stringify(cart));
    }

    var secondsRemaining = getReservationSecondsLeft(cart);

    if (secondsRemaining <= 0) {
      window.clearInterval(timer);
      countdownElement.textContent = "Reservation expired";
      if (onExpire) {
        onExpire();
      }
      return;
    }

    countdownElement.textContent = formatReservationTime(secondsRemaining);
  }

  timer = window.setInterval(tick, 1000);
  tick();
}
