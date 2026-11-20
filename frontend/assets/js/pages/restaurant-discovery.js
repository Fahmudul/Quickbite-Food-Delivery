var currentPage = "restaurants";

var navLinks = [
  { id: "restaurants", text: "Restaurants", href: "restaurant-discovery.html" },
  { id: "cart", text: "Cart", href: "cart.html" },
  { id: "orders", text: "Orders", href: "orders.html" },
  { id: "addresses", text: "Addresses", href: "addresses.html" },
  { id: "profile", text: "Profile", href: "profile.html" }
];

var zones = ["Uttara", "Dhanmondi", "Gulshan"];

var restaurants = [
  { name: "Burger House", cuisine: "Burgers \u2022 Fast food", zone: "Uttara", open: true },
  { name: "Spice Kitchen", cuisine: "Indian \u2022 Curry", zone: "Uttara", open: true },
  { name: "Pizza Corner", cuisine: "Pizza \u2022 Italian", zone: "Uttara", open: false },
  { name: "Noodle Bar", cuisine: "Chinese \u2022 Noodles", zone: "Dhanmondi", open: true },
  { name: "Kebab Palace", cuisine: "Grill \u2022 Kebab", zone: "Dhanmondi", open: false },
  { name: "Cafe Aroma", cuisine: "Cafe \u2022 Desserts", zone: "Gulshan", open: true }
];

var headerNav = document.getElementById("headerNav");
var zoneSelect = document.getElementById("zoneSelect");
var restaurantGrid = document.getElementById("restaurantGrid");
var emptyMessage = document.getElementById("emptyMessage");

function makeElement(tag, className, text) {
  var element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function buildHeader() {
  for (var i = 0; i < navLinks.length; i++) {
    var link = document.createElement("a");
    link.href = navLinks[i].href;
    link.textContent = navLinks[i].text;

    if (navLinks[i].id === currentPage) {
      link.classList.add("active");
    }

    headerNav.appendChild(link);
  }
}

function buildZoneList() {
  for (var i = 0; i < zones.length; i++) {
    var option = document.createElement("option");
    option.value = zones[i];
    option.textContent = zones[i];
    zoneSelect.appendChild(option);
  }
}

function makeCard(restaurant) {
  var card = document.createElement("div");
  card.className = "restaurant-card";

  card.appendChild(makeElement("div", "restaurant-image", "Restaurant image"));
  card.appendChild(makeElement("h3", "restaurant-name", restaurant.name));
  card.appendChild(makeElement("p", "restaurant-cuisine", restaurant.cuisine));

  if (restaurant.open) {
    card.appendChild(makeElement("span", "status-chip status-open", "Accepting Orders"));
  } else {
    card.appendChild(makeElement("span", "status-chip status-closed", "Closed"));
  }

  return card;
}

function showRestaurants() {
  var selectedZone = zoneSelect.value;
  var count = 0;

  restaurantGrid.innerHTML = "";

  for (var i = 0; i < restaurants.length; i++) {
    if (restaurants[i].zone === selectedZone) {
      restaurantGrid.appendChild(makeCard(restaurants[i]));
      count++;
    }
  }

  if (count === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
  }
}

zoneSelect.addEventListener("change", showRestaurants);

buildHeader();
buildZoneList();
showRestaurants();
