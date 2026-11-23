// Sidebar navigation is built by assets/js/core/navigation.js (shared QB-DEV-007 layout).
var applications = [
  { id: 1, name: "Sabbir Hossain", vehicle: "Motorbike", date: "25 Oct 2026", status: "Pending" },
  { id: 2, name: "Tanvir Hasan", vehicle: "Bicycle", date: "25 Oct 2026", status: "Pending" },
  { id: 3, name: "Imran Khan", vehicle: "Motorbike", date: "24 Oct 2026", status: "Approved" }
];

var applicationList = document.getElementById("applicationList");
var emptyMessage = document.getElementById("emptyMessage");

function makeElement(tag, className, text) {
  var element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function getChipClass(status) {
  if (status === "Approved") {
    return "chip chip-green";
  }
  if (status === "Rejected") {
    return "chip chip-red";
  }
  return "chip chip-yellow";
}

function buildRow(application) {
  var row = document.createElement("div");
  row.className = "table-row";

  row.appendChild(makeElement("span", "cell-name", application.name));
  row.appendChild(makeElement("span", "cell-text", application.vehicle));
  row.appendChild(makeElement("span", "cell-text", application.date));

  var statusCell = document.createElement("span");
  statusCell.appendChild(makeElement("span", getChipClass(application.status), application.status));
  row.appendChild(statusCell);

  var reviewLink = makeElement("a", "review-link", "Review");
  reviewLink.href = "admin-rider-review.html?id=" + application.id;
  row.appendChild(reviewLink);

  return row;
}

function showApplications() {
  applicationList.innerHTML = "";

  if (applications.length === 0) {
    applicationList.classList.add("hidden");
    emptyMessage.classList.remove("hidden");
    return;
  }

  for (var i = 0; i < applications.length; i++) {
    applicationList.appendChild(buildRow(applications[i]));
  }
}

showApplications();
