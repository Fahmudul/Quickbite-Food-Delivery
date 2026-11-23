document.addEventListener("DOMContentLoaded", function () {

  var zoneSelect = document.getElementById("deliveryArea");
  var restaurantCards = document.querySelectorAll(".restaurant-card");
  var noResultsMessage = document.getElementById("noResultsMessage");

  function filterByZone() {
    var selectedZone = zoneSelect.value;
    var visibleCount = 0;

    restaurantCards.forEach(function (card) {
      if (card.getAttribute("data-zone") === selectedZone) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    if (visibleCount === 0) {
      noResultsMessage.classList.remove("hidden");
    } else {
      noResultsMessage.classList.add("hidden");
    }
  }

  zoneSelect.addEventListener("change", filterByZone);

  filterByZone();

  restaurantCards.forEach(function (card) {
    if (card.classList.contains("is-closed")) {
      card.addEventListener("click", function (event) {
        event.preventDefault();
        alert("This restaurant is closed right now and is not accepting orders.");
      });
    }
  });

  var cartCountBadge = document.getElementById("cartCount");
  var cartData = JSON.parse(localStorage.getItem("quickbite_cart"));

  if (cartCountBadge && cartData && cartData.items && cartData.items.length > 0) {
    var totalItems = 0;
    for (var i = 0; i < cartData.items.length; i++) {
      totalItems += cartData.items[i].qty;
    }
    cartCountBadge.textContent = totalItems;
  }
});
