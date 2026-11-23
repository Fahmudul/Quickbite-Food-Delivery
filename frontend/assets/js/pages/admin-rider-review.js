// Sidebar navigation is built by assets/js/core/navigation.js (shared QB-DEV-007 layout).
var applications = [
  { id: 1, name: "Sabbir Hossain", email: "sabbir@gmail.com", phone: "01812345678", vehicle: "Motorbike", status: "Pending" },
  { id: 2, name: "Tanvir Hasan", email: "tanvir@gmail.com", phone: "01712345678", vehicle: "Bicycle", status: "Pending" },
  { id: 3, name: "Imran Khan", email: "imran@gmail.com", phone: "01912345678", vehicle: "Motorbike", status: "Approved" }
];

var MAX_REASON_LENGTH = 300;

var reviewLayout = document.getElementById("reviewLayout");
var notFound = document.getElementById("notFound");

var riderName = document.getElementById("riderName");
var statusChip = document.getElementById("statusChip");
var riderEmail = document.getElementById("riderEmail");
var riderPhone = document.getElementById("riderPhone");
var riderVehicle = document.getElementById("riderVehicle");

var reasonField = document.getElementById("reasonField");
var reasonInput = document.getElementById("rejectionReason");
var reasonError = document.getElementById("reasonError");
var approveBtn = document.getElementById("approveBtn");
var rejectBtn = document.getElementById("rejectBtn");
var messageBox = document.getElementById("messageBox");
var backLink = document.getElementById("backLink");

var rider = null;

function findRider() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");

  if (id === null) {
    id = "1";
  }

  for (var i = 0; i < applications.length; i++) {
    if (String(applications[i].id) === id) {
      return applications[i];
    }
  }
  return null;
}

function showStatus() {
  statusChip.textContent = rider.status;

  if (rider.status === "Approved") {
    statusChip.className = "chip chip-green";
  } else if (rider.status === "Rejected") {
    statusChip.className = "chip chip-red";
  } else {
    statusChip.className = "chip chip-yellow";
  }
}

function showRider() {
  riderName.textContent = rider.name;
  riderEmail.textContent = rider.email;
  riderPhone.textContent = rider.phone;
  riderVehicle.textContent = rider.vehicle;
  showStatus();
}

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message-box " + type;
  backLink.classList.remove("hidden");
}

function lockReview() {
  approveBtn.disabled = true;
  rejectBtn.disabled = true;
  reasonInput.disabled = true;
}

function clearReasonError() {
  reasonError.textContent = "";
  reasonField.classList.remove("field-error");
}

function setReasonError(message) {
  reasonError.textContent = message;
  reasonField.classList.add("field-error");
}

reasonInput.addEventListener("input", clearReasonError);

approveBtn.addEventListener("click", function () {
  clearReasonError();

  var sure = confirm("Approve this rider application?");
  if (!sure) {
    return;
  }

  rider.status = "Approved";
  reasonInput.value = "";
  showStatus();
  lockReview();
  showMessage("Application approved. This rider can now go Online and receive assignments.", "message-approved");
});

rejectBtn.addEventListener("click", function () {
  clearReasonError();

  var reason = reasonInput.value.trim();

  if (reason === "") {
    setReasonError("A rejection reason is required.");
    return;
  }

  if (reason.length > MAX_REASON_LENGTH) {
    setReasonError("Reason cannot be more than " + MAX_REASON_LENGTH + " characters.");
    return;
  }

  var sure = confirm("Reject this rider application?");
  if (!sure) {
    return;
  }

  rider.status = "Rejected";
  showStatus();
  lockReview();
  showMessage("Application rejected. This rider cannot receive deliveries.", "message-rejected");
});

rider = findRider();

if (rider === null) {
  reviewLayout.classList.add("hidden");
  notFound.classList.remove("hidden");
} else {
  showRider();

  if (rider.status !== "Pending") {
    lockReview();

    var messageType = "message-approved";
    if (rider.status === "Rejected") {
      messageType = "message-rejected";
    }
    showMessage("This application has already been " + rider.status.toLowerCase() + ".", messageType);
  }
}
