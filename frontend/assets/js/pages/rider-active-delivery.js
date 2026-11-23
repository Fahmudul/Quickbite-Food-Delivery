// Sidebar navigation is built by assets/js/core/navigation.js (shared QB-DEV-007 layout).
var assignment = {
  orderId: "QB-1044",
  status: "Picked Up",
  restaurantName: "Burger House",
  customerName: "Hasan",
  customerAddress: "House 12, Road 7, Uttara",
  payment: "COD",
  total: 520
};

var deliveryLayout = document.getElementById("deliveryLayout");
var noAssignment = document.getElementById("noAssignment");

var orderTitle = document.getElementById("orderTitle");
var statusChip = document.getElementById("statusChip");
var customerName = document.getElementById("customerName");
var customerAddress = document.getElementById("customerAddress");

var codBox = document.getElementById("codBox");
var codText = document.getElementById("codText");
var cashCollected = document.getElementById("cashCollected");
var cashError = document.getElementById("cashError");

var completeBtn = document.getElementById("completeBtn");
var reportLink = document.getElementById("reportLink");
var statusNote = document.getElementById("statusNote");
var messageBox = document.getElementById("messageBox");

var restaurantText = document.getElementById("restaurantText");
var paymentText = document.getElementById("paymentText");
var amountText = document.getElementById("amountText");

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message-box " + type;
}

function hideMessage() {
  messageBox.className = "message-box hidden";
}

function setCashError(text) {
  cashError.textContent = text;
}

function showStatus() {
  statusChip.textContent = assignment.status;
  statusNote.classList.add("hidden");

  if (assignment.status === "Picked Up") {
    statusChip.className = "chip chip-yellow";
    completeBtn.disabled = false;
  } else if (assignment.status === "Delivered") {
    statusChip.className = "chip chip-green";
    completeBtn.disabled = true;
    cashCollected.disabled = true;
    reportLink.classList.add("hidden");
  } else {
    statusChip.className = "chip chip-green";
    completeBtn.disabled = true;
    statusNote.textContent = "You can complete this delivery only after the order is Picked Up.";
    statusNote.classList.remove("hidden");
  }
}

function showDelivery() {
  orderTitle.textContent = "Order #" + assignment.orderId;
  customerName.textContent = assignment.customerName;
  customerAddress.textContent = assignment.customerAddress;

  restaurantText.textContent = assignment.restaurantName;
  amountText.textContent = "\u09F3 " + assignment.total;

  if (assignment.payment === "COD") {
    paymentText.textContent = "COD";
    codText.textContent = "Confirm that \u09F3 " + assignment.total + " has been collected from the customer before completing this COD order.";
    codBox.classList.remove("hidden");
  } else {
    paymentText.textContent = "Paid online";
    codBox.classList.add("hidden");
  }

  showStatus();
}

cashCollected.addEventListener("change", function () {
  setCashError("");
});

completeBtn.addEventListener("click", function () {
  hideMessage();
  setCashError("");

  if (assignment.status === "Delivered") {
    showMessage("This delivery has already been completed.", "message-error");
    return;
  }

  if (assignment.status !== "Picked Up") {
    showMessage("This order must be Picked Up before it can be completed.", "message-error");
    return;
  }

  if (assignment.payment === "COD" && !cashCollected.checked) {
    setCashError("Please confirm that the cash has been collected.");
    return;
  }

  var sure = confirm("Complete this delivery?");
  if (!sure) {
    return;
  }

  assignment.status = "Delivered";
  showStatus();
  showMessage("Delivery completed. The order is now Delivered and this assignment is closed.", "message-success");
});


if (assignment === null) {
  deliveryLayout.classList.add("hidden");
  noAssignment.classList.remove("hidden");
} else {
  showDelivery();
}
