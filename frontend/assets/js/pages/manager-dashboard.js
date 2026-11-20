var currentPage = "dashboard";
var restaurantOpen = true;

var navLinks = [
  { id: "dashboard", text: "Dashboard", href: "manager-dashboard.html" },
  { id: "restaurant-profile", text: "Restaurant Profile", href: "manager-restaurant-profile.html" },
  { id: "menu", text: "Menu", href: "manager-menu.html" },
  { id: "inventory", text: "Inventory", href: "manager-inventory.html" },
  { id: "orders", text: "Orders", href: "manager-orders.html" },
  { id: "operating-status", text: "Operating Status", href: "manager-operating-status.html" },
  { id: "account-profile", text: "Account Profile", href: "profile.html" },
  { id: "logout", text: "Logout", href: "login.html" }
];

var quickActions = [
  { title: "Manage Menu", text: "Add or update food items and prices.", href: "manager-menu.html" },
  { title: "Update Inventory", text: "Maintain available item quantities.", href: "manager-inventory.html" },
  { title: "Current Orders", text: "Prepare accepted orders and mark them ready.", href: "manager-orders.html" },
  { title: "Restaurant Profile", text: "Update restaurant details and delivery zones.", href: "manager-restaurant-profile.html" }
];

var sidebarNav = document.getElementById("sidebarNav");
var quickActionsBox = document.getElementById("quickActions");
var statusChip = document.getElementById("statusChip");

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

function showStatus() {
  if (restaurantOpen) {
    statusChip.textContent = "Accepting Orders";
    statusChip.className = "chip chip-green";
  } else {
    statusChip.textContent = "Closed";
    statusChip.className = "chip chip-red";
  }
}

function buildQuickActions() {
  for (var i = 0; i < quickActions.length; i++) {
    var card = document.createElement("div");
    card.className = "card action-card";

    card.appendChild(makeElement("h3", "", quickActions[i].title));
    card.appendChild(makeElement("p", "", quickActions[i].text));

    var link = makeElement("a", "open-link", "Open \u2192");
    link.href = quickActions[i].href;
    card.appendChild(link);

    quickActionsBox.appendChild(card);
  }
}

buildSidebar();
showStatus();
buildQuickActions();
