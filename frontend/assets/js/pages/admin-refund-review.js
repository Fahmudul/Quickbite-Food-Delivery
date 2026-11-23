const form = document.querySelector("#refund-form");
const note = document.querySelector("#refund-note");
const error = document.querySelector("#refund-error");
const button = document.querySelector("#process-refund");
const status = document.querySelector("#refund-status");
let processingStarted = false;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  error.textContent = "";

  if (!note.value.trim()) {
    error.textContent = "Enter a refund note before processing this refund.";
    note.focus();
    return;
  }

  if (processingStarted) return;
  processingStarted = true;
  button.disabled = true;
  button.textContent = "Processing…";
  status.textContent = "Refund Processing";

  window.setTimeout(() => {
    status.textContent = "Refunded";
    status.classList.remove("status-pending");
    status.classList.add("status-refunded");
    button.textContent = "Refund Confirmed";
  }, 900);
});

if (new URLSearchParams(window.location.search).get("status") === "refunded") {
  processingStarted = true;
  status.textContent = "Refunded";
  status.classList.remove("status-pending");
  status.classList.add("status-refunded");
  button.disabled = true;
  button.textContent = "Refund Confirmed";
}
