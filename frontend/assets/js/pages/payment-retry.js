const page = document.querySelector(".protected-page");
const failedState = document.querySelector("#failed-state");
const pendingState = document.querySelector("#pending-state");
const countdown = document.querySelector("#payment-countdown");
const retryLink = document.querySelector("#retry-payment");

function setPaymentState(state) {
  const isPending = state === "pending";
  page.dataset.paymentState = state;
  failedState.hidden = isPending;
  pendingState.hidden = !isPending;
}

let secondsRemaining = Number(countdown.dataset.seconds);
const timer = window.setInterval(() => {
  secondsRemaining -= 1;
  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");
  const seconds = String(secondsRemaining % 60).padStart(2, "0");
  countdown.textContent = `${minutes}:${seconds} remaining`;

  if (secondsRemaining <= 0) {
    window.clearInterval(timer);
    countdown.textContent = "Verification required";
    retryLink.hidden = true;
    setPaymentState("pending");
  }
}, 1000);

const requestedState = new URLSearchParams(window.location.search).get("state");
setPaymentState(requestedState === "pending" ? "pending" : "failed");
