// Sidebar navigation is built by assets/js/core/navigation.js (shared QB-DEV-007 layout).
var restaurantOpen = true;

var quickActions = [
  // Integration: href is null for Restaurant Manager screens that are not built yet.
  { title: "Manage Menu", text: "Add or update food items and prices.", href: null },               // RM-03, QB-DEV-014
  { title: "Update Inventory", text: "Maintain available item quantities.", href: null },           // RM-05, QB-DEV-015
  { title: "Current Orders", text: "Prepare accepted orders and mark them ready.", href: null },    // RM-07, QB-DEV-028
  { title: "Restaurant Profile", text: "Update restaurant details and delivery zones.", href: null } // RM-02, QB-DEV-012
];

var quickActionsBox = document.getElementById("quickActions");
var statusChip = document.getElementById("statusChip");

function makeElement(tag, className, text) {
  var element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
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

    // Integration: screens that are not built yet show a disabled label instead of a dead link.
    if (quickActions[i].href) {
      var link = makeElement("a", "open-link", "Open \u2192");
      link.href = quickActions[i].href;
      card.appendChild(link);
    } else {
      card.appendChild(makeElement("span", "open-link is-disabled", "Not built yet"));
    }

    quickActionsBox.appendChild(card);
  }
}

showStatus();
buildQuickActions();
