// Sidebar navigation is built by assets/js/core/navigation.js (shared QB-DEV-007 layout).
var quickActions = [
  { title: "Restaurant Applications", text: "Review pending restaurant registrations.", linkText: "Open", href: null }, // ADMIN-02 not built yet (QB-DEV-009)
  { title: "Rider Applications", text: "Approve or reject rider applications.", linkText: "Open", href: "admin-rider-applications.html" },
  { title: "Orders & Riders", text: "Assign available riders and manage active orders.", linkText: "Open", href: "admin-orders-rider-assignment.html" },
  { title: "Delivery Problems", text: "Resolve rider-reported delivery failures.", linkText: "Open", href: "admin-delivery-problem-resolution.html" }
];

var shortcuts = [
  { title: "Delivery zones", text: "Manage the predefined zones used by customers and restaurants.", linkText: "Manage zones", href: "admin-delivery-zones.html" },
  { title: "Fixed delivery fee", text: "Update the one platform-wide delivery fee used for new checkouts.", linkText: "Manage fee", href: "admin-delivery-fee.html" }
];

var quickActionsBox = document.getElementById("quickActions");
var shortcutsBox = document.getElementById("shortcuts");

function makeElement(tag, className, text) {
  var element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function buildCards(list, box) {
  for (var i = 0; i < list.length; i++) {
    var card = document.createElement("div");
    card.className = "card action-card";

    card.appendChild(makeElement("h3", "", list[i].title));
    card.appendChild(makeElement("p", "", list[i].text));

    // Integration: screens that are not built yet show a disabled label instead of a dead link.
    if (list[i].href) {
      var link = makeElement("a", "open-link", list[i].linkText + " \u2192");
      link.href = list[i].href;
      card.appendChild(link);
    } else {
      card.appendChild(makeElement("span", "open-link is-disabled", "Not built yet"));
    }

    box.appendChild(card);
  }
}

buildCards(quickActions, quickActionsBox);
buildCards(shortcuts, shortcutsBox);
