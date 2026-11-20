var currentPage = "rider-applications";

var navLinks = [
  { id: "dashboard", text: "Dashboard", href: "admin-dashboard.html" },
  { id: "restaurant-applications", text: "Restaurant Applications", href: "admin-restaurant-applications.html" },
  { id: "rider-applications", text: "Rider Applications", href: "admin-rider-applications.html" },
  { id: "delivery-zones", text: "Delivery Zones", href: "admin-delivery-zones.html" },
  { id: "delivery-fee", text: "Delivery Fee", href: "admin-delivery-fee.html" },
  { id: "orders-riders", text: "Orders & Riders", href: "admin-orders-riders.html" },
  { id: "delivery-problems", text: "Delivery Problems", href: "admin-delivery-problems.html" },
  { id: "refunds", text: "Refunds", href: "admin-refunds.html" },
  { id: "account-profile", text: "Account Profile", href: "profile.html" },
  { id: "logout", text: "Logout", href: "login.html" }
];

var applications = [
  { id: 1, name: "Sabbir Hossain", vehicle: "Motorbike", date: "25 Oct 2026", status: "Pending" },
  { id: 2, name: "Tanvir Hasan", vehicle: "Bicycle", date: "25 Oct 2026", status: "Pending" },
  { id: 3, name: "Imran Khan", vehicle: "Motorbike", date: "24 Oct 2026", status: "Approved" }
];

var sidebarNav = document.getElementById("sidebarNav");
var applicationList = document.getElementById("applicationList");
var emptyMessage = document.getElementById("emptyMessage");

function makeElement(tag, className, text) {
  var element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function confirmLogout(event) {
  var sure = confirm("Are you sure you want to log out?");
  if (!sure) {
    event.preventDefault();
  }
}

function buildSidebar() {
  for (var i = 0; i < navLinks.length; i++) {
    var link = document.createElement("a");
    link.href = navLinks[i].href;
    link.textContent = navLinks[i].text;

    if (navLinks[i].id === currentPage) {
      link.classList.add("active");
    }

    if (navLinks[i].id === "logout") {
      link.classList.add("logout");
      link.addEventListener("click", confirmLogout);
    }

    sidebarNav.appendChild(link);
  }
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

buildSidebar();
showApplications();
