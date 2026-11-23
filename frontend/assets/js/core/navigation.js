/*
 * Shared role-based navigation (QB-DEV-007, SRS 2.1).
 *
 * Based on the link-array and buildSidebar() pattern from QB-DEV-007.
 * During integration it was moved here so every page uses the same links
 * for its role instead of keeping its own copy.
 *
 * Usage in a page:
 *   Customer header: <nav class="customer-nav" data-qb-nav="customer"></nav>
 *   Role sidebar:    <nav class="sidebar-nav" data-qb-nav="admin"></nav>
 *                    (roles: admin, manager, rider)
 *   Then load this script at the end of <body>.
 *
 * All pages live in frontend/pages/<role>/, so links are relative to that folder.
 * A link with `href: null` is a screen that has not been built yet. It is shown
 * as disabled so the menu still matches the Figma design.
 */
var QB_NAV_LINKS = {
  customer: [
    { id: "restaurants", text: "Restaurants", href: "../customer/restaurant-discovery.html",
      pages: ["restaurant-discovery", "restaurant-menu"] },
    { id: "cart", text: "Cart", href: "../customer/active-cart.html",
      pages: ["active-cart", "checkout", "payment-retry", "order-confirmation"] },
    { id: "orders", text: "Orders", href: "../customer/order-history.html",
      pages: ["order-history", "current-order-tracking"] },
    { id: "addresses", text: "Addresses", href: "../customer/saved-addresses.html",
      pages: ["saved-addresses"] },
    { id: "profile", text: "Profile", href: "../auth/profile.html", pages: ["profile"] }
  ],
  manager: [
    { id: "dashboard", text: "Dashboard", href: "../restaurant/manager-dashboard.html", pages: ["manager-dashboard"] },
    { id: "restaurant-profile", text: "Restaurant Profile", href: null },
    { id: "menu", text: "Menu", href: null },
    { id: "inventory", text: "Inventory", href: null },
    { id: "orders", text: "Orders", href: null },
    { id: "operating-status", text: "Operating Status", href: null },
    { id: "analytics", text: "Analytics", href: "../restaurant/manager-analytics-dashboard.html",
      pages: ["manager-analytics-dashboard"] },
    { id: "account-profile", text: "Account Profile", href: "../auth/profile.html", pages: ["profile"] }
  ],
  rider: [
    { id: "dashboard", text: "Dashboard", href: "../rider/rider-dashboard.html", pages: ["rider-dashboard"] },
    { id: "current-delivery", text: "Current Delivery", href: "../rider/rider-current-delivery.html",
      pages: ["rider-current-delivery", "rider-active-delivery", "rider-report-delivery-problem"] },
    { id: "delivery-history", text: "Delivery History", href: null },
    { id: "account-profile", text: "Account Profile", href: "../auth/profile.html", pages: ["profile"] }
  ],
  admin: [
    { id: "dashboard", text: "Dashboard", href: "../admin/admin-dashboard.html", pages: ["admin-dashboard"] },
    { id: "restaurant-applications", text: "Restaurant Applications", href: null },
    { id: "rider-applications", text: "Rider Applications", href: "../admin/admin-rider-applications.html",
      pages: ["admin-rider-applications", "admin-rider-review"] },
    { id: "delivery-zones", text: "Delivery Zones", href: "../admin/admin-delivery-zones.html", pages: ["admin-delivery-zones"] },
    { id: "delivery-fee", text: "Delivery Fee", href: "../admin/admin-delivery-fee.html", pages: ["admin-delivery-fee"] },
    { id: "orders-riders", text: "Orders & Riders", href: "../admin/admin-orders-rider-assignment.html",
      pages: ["admin-orders-rider-assignment", "admin-order-administration"] },
    { id: "delivery-problems", text: "Delivery Problems", href: "../admin/admin-delivery-problem-resolution.html",
      pages: ["admin-delivery-problem-resolution"] },
    { id: "refunds", text: "Refunds", href: "../admin/admin-refunds.html", pages: ["admin-refunds", "admin-refund-review"] },
    { id: "analytics", text: "Analytics", href: "../admin/admin-analytics-dashboard.html", pages: ["admin-analytics-dashboard"] },
    { id: "account-profile", text: "Account Profile", href: "../auth/profile.html", pages: ["profile"] }
  ]
};

var QB_LOGIN_PAGE = "../auth/login.html";

function qbCurrentPageName() {
  var file = window.location.pathname.split("/").pop() || "";
  return decodeURIComponent(file).replace(/\.html$/, "");
}

function qbConfirmLogout(event) {
  var sure = confirm("Are you sure you want to log out?");
  if (!sure) {
    event.preventDefault();
  }
}

function qbBuildNav(nav) {
  var role = nav.getAttribute("data-qb-nav");
  var links = QB_NAV_LINKS[role];
  if (!links) {
    return;
  }

  var isSidebar = nav.classList.contains("sidebar-nav");
  var currentPage = qbCurrentPageName();
  nav.innerHTML = "";

  for (var i = 0; i < links.length; i++) {
    var item = links[i];
    var link;

    if (item.href) {
      link = document.createElement("a");
      link.href = item.href;
      if (item.pages && item.pages.indexOf(currentPage) !== -1) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    } else {
      link = document.createElement("span");
      link.classList.add("is-disabled");
      link.setAttribute("aria-disabled", "true");
      link.title = "This screen has not been built yet";
    }

    if (isSidebar) {
      link.classList.add("sidebar-link");
    }
    link.textContent = item.text;

    // Customer header: keep the cart item badge used by the customer pages (QB-DEV-018).
    if (role === "customer" && item.id === "cart") {
      var badge = document.createElement("span");
      badge.className = "cart-count";
      badge.id = "cartCount";
      link.appendChild(badge);
    }

    nav.appendChild(link);
  }
}

function qbSetupNavigation() {
  var navs = document.querySelectorAll("[data-qb-nav]");
  for (var i = 0; i < navs.length; i++) {
    qbBuildNav(navs[i]);
  }

  var logoutLinks = document.querySelectorAll(".sidebar-logout, [data-qb-logout]");
  for (var j = 0; j < logoutLinks.length; j++) {
    logoutLinks[j].href = QB_LOGIN_PAGE;
    logoutLinks[j].addEventListener("click", qbConfirmLogout);
  }

  // Show the current cart item count in the customer header.
  var badgeEl = document.getElementById("cartCount");
  var cart = JSON.parse(localStorage.getItem("quickbite_cart"));
  if (badgeEl && cart && cart.items && cart.items.length > 0) {
    var total = 0;
    for (var k = 0; k < cart.items.length; k++) {
      total += cart.items[k].qty;
    }
    badgeEl.textContent = total;
  }
}

qbSetupNavigation();
