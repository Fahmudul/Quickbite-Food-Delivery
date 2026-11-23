// Sidebar navigation is built by assets/js/core/navigation.js (shared QB-DEV-007 layout).
var isApproved = true;

var selectedOnline = true;

var assignment = {
  orderId: "QB-1044",
  restaurant: "Burger House",
  status: "Ready for Pickup"
};

var availabilityChip = document.getElementById("availabilityChip");
var availabilityNote = document.getElementById("availabilityNote");
var availabilityBtn = document.getElementById("availabilityBtn");
var assignmentDetails = document.getElementById("assignmentDetails");
var noAssignment = document.getElementById("noAssignment");
var orderText = document.getElementById("orderText");
var statusText = document.getElementById("statusText");

function getStatus() {
  if (!isApproved) {
    return "Not approved";
  }
  if (assignment !== null) {
    return "Busy";
  }
  if (selectedOnline) {
    return "Available";
  }
  return "Offline";
}

function showAvailability() {
  var status = getStatus();
  var choice = selectedOnline ? "Online" : "Offline";

  if (status === "Not approved") {
    availabilityChip.textContent = "Not approved";
    availabilityChip.className = "chip chip-grey";
    availabilityNote.textContent = "Your rider application has not been approved yet, so you cannot go Online.";
    availabilityBtn.textContent = "Go Online";
    availabilityBtn.disabled = true;
    return;
  }

  availabilityBtn.disabled = false;
  availabilityBtn.textContent = selectedOnline ? "Go Offline" : "Go Online";

  if (status === "Busy") {
    availabilityChip.textContent = choice + " \u2022 Busy";
    availabilityChip.className = "chip chip-yellow";

    if (selectedOnline) {
      availabilityNote.textContent = "Busy is assigned automatically when you receive a delivery.";
    } else {
      availabilityNote.textContent = "You chose Offline. You will become Offline after you finish this delivery.";
    }
  } else if (status === "Available") {
    availabilityChip.textContent = "Online \u2022 Available";
    availabilityChip.className = "chip chip-green";
    availabilityNote.textContent = "You are available to receive a delivery from the administrator.";
  } else {
    availabilityChip.textContent = "Offline";
    availabilityChip.className = "chip chip-grey";
    availabilityNote.textContent = "You are Offline and will not receive deliveries.";
  }
}

availabilityBtn.addEventListener("click", function () {
  if (!isApproved) {
    return;
  }

  selectedOnline = !selectedOnline;
  showAvailability();
});

function showAssignment() {
  if (assignment !== null) {
    orderText.textContent = "Order #" + assignment.orderId + " \u2022 " + assignment.restaurant;
    statusText.textContent = "Status: " + assignment.status;
    assignmentDetails.classList.remove("hidden");
    noAssignment.classList.add("hidden");
  } else {
    assignmentDetails.classList.add("hidden");
    noAssignment.classList.remove("hidden");
  }
}

function completeDelivery() {
  assignment = null;
  showAvailability();
  showAssignment();
}

showAvailability();
showAssignment();
