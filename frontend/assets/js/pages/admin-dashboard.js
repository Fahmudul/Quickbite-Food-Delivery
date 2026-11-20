var currentPage = "dashboard";

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

var quickActions = [
  { title: "Restaurant Applications", text: "Review pending restaurant registrations.", linkText: "Open", href: "admin-restaurant-applications.html" },
  { title: "Rider Applications", text: "Approve or reject rider applications.", linkText: "Open", href: "admin-rider-applications.html" },
  { title: "Orders & Riders", text: "Assign available riders and manage active orders.", linkText: "Open", href: "admin-orders-riders.html" },
  { title: "Delivery Problems", text: "Resolve rider-reported delivery failures.", linkText: "Open", href: "admin-delivery-problems.html" }
];

var shortcuts = [
  { title: "Delivery zones", text: "Manage the predefined zones used by customers and restaurants.", linkText: "Manage zones", href: "admin-delivery-zones.html" },
  { title: "Fixed delivery fee", text: "Update the one platform-wide delivery fee used for new checkouts.", linkText: "Manage fee", href: "admin-delivery-fee.html" }
];

var sidebarNav = document.getElementById("sidebarNav");
var quickActionsBox = document.getElementById("quickActions");
var shortcutsBox = document.getElementById("shortcuts");

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

function buildCards(list, box) {
  for (var i = 0; i < list.length; i++) {
    var card = document.createElement("div");
    card.className = "card action-card";

    card.appendChild(makeElement("h3", "", list[i].title));
    card.appendChild(makeElement("p", "", list[i].text));

    var link = makeElement("a", "open-link", list[i].linkText + " \u2192");
    link.href = list[i].href;
    card.appendChild(link);

    box.appendChild(card);
  }
}

buildSidebar();
buildCards(quickActions, quickActionsBox);
buildCards(shortcuts, shortcutsBox);
