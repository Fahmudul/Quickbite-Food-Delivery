// Sidebar navigation is built by assets/js/core/navigation.js (shared QB-DEV-007 layout).
var assignment = {
  orderId: "QB-1044",
  status: "Ready for Pickup",
  restaurantName: "Burger House",
  restaurantAddress: "Sector 7, Uttara, Dhaka",
  customerName: "Hasan",
  customerAddress: "House 12, Road 7, Uttara",
  itemCount: 2,
  payment: "COD",
  total: 520
};

var PICKUP_NOTE = "Pickup is allowed only after the restaurant marks the order Ready for Pickup.";

var deliveryLayout = document.getElementById("deliveryLayout");
var noAssignment = document.getElementById("noAssignment");

var orderTitle = document.getElementById("orderTitle");
var statusChip = document.getElementById("statusChip");
var restaurantName = document.getElementById("restaurantName");
var restaurantAddress = document.getElementById("restaurantAddress");
var customerName = document.getElementById("customerName");
var customerAddress = document.getElementById("customerAddress");
var pickupBtn = document.getElementById("pickupBtn");
var pickupNote = document.getElementById("pickupNote");
var messageBox = document.getElementById("messageBox");

var itemsText = document.getElementById("itemsText");
var paymentText = document.getElementById("paymentText");
var totalText = document.getElementById("totalText");

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message-box " + type;
}

function hideMessage() {
  messageBox.className = "message-box hidden";
}

function showStatus() {
  statusChip.textContent = assignment.status;

  if (assignment.status === "Ready for Pickup") {
    statusChip.className = "chip chip-green";
    pickupBtn.disabled = false;
    pickupBtn.textContent = "Confirm Pickup";
    pickupNote.textContent = PICKUP_NOTE;
  } else if (assignment.status === "Picked Up") {
    statusChip.className = "chip chip-yellow";
    pickupBtn.disabled = true;
    pickupBtn.textContent = "Pickup confirmed";
    pickupNote.textContent = "You have picked up this order.";
  } else {
    statusChip.className = "chip chip-yellow";
    pickupBtn.disabled = true;
    pickupBtn.textContent = "Confirm Pickup";
    pickupNote.textContent = PICKUP_NOTE;
  }
}

function showDelivery() {
  orderTitle.textContent = "Order #" + assignment.orderId;
  restaurantName.textContent = assignment.restaurantName;
  restaurantAddress.textContent = assignment.restaurantAddress;
  customerName.textContent = assignment.customerName;
  customerAddress.textContent = assignment.customerAddress;

  var itemWord = (assignment.itemCount === 1) ? " item" : " items";
  itemsText.textContent = assignment.itemCount + itemWord;
  paymentText.textContent = assignment.payment;
  totalText.textContent = "\u09F3 " + assignment.total;

  showStatus();
}

pickupBtn.addEventListener("click", function () {
  hideMessage();

  if (assignment.status === "Picked Up") {
    showMessage("This order has already been picked up.", "message-error");
    return;
  }

  if (assignment.status !== "Ready for Pickup") {
    showMessage("You cannot pick up this order yet. The restaurant has not marked it Ready for Pickup.", "message-error");
    return;
  }

  var sure = confirm("Confirm that you have picked up this order from " + assignment.restaurantName + "?");
  if (!sure) {
    return;
  }

  assignment.status = "Picked Up";
  showStatus();
  showMessage("Pickup confirmed. The order is now Picked Up.", "message-success");
});

function restaurantMarksReady() {
  if (assignment !== null && assignment.status === "Preparing") {
    assignment.status = "Ready for Pickup";
    hideMessage();
    showStatus();
  }
}


if (assignment === null) {
  deliveryLayout.classList.add("hidden");
  noAssignment.classList.remove("hidden");
} else {
  showDelivery();
}
