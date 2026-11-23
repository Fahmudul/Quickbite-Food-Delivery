document.addEventListener("DOMContentLoaded", function () {

  var addressList = document.getElementById("addressList");
  var addAddressForm = document.getElementById("addAddressForm");
  var addAddressTitle = document.getElementById("addAddressTitle");
  var saveAddressBtn = document.getElementById("saveAddressBtn");

  var addressLabelInput = document.getElementById("addressLabel");
  var fullAddressInput = document.getElementById("fullAddress");
  var deliveryNoteInput = document.getElementById("deliveryNote");

  var addressLabelError = document.getElementById("addressLabelError");
  var fullAddressError = document.getElementById("fullAddressError");
  var addressFormError = document.getElementById("addressFormError");

  var cardBeingEdited = null;

  function buildAddressCard(labelText, addressText, isDefault) {
    var card = document.createElement("div");
    card.className = "address-card";
    card.setAttribute("data-default", isDefault ? "true" : "false");

    var label = document.createElement("h2");
    label.className = "address-label";
    label.textContent = labelText;

    var text = document.createElement("p");
    text.className = "address-text";
    text.textContent = addressText;

    card.appendChild(label);
    card.appendChild(text);

    if (isDefault) {
      var defaultTag = document.createElement("p");
      defaultTag.className = "address-default";
      defaultTag.textContent = "Default address";
      card.appendChild(defaultTag);
    } else {
      var setDefaultLink = document.createElement("a");
      setDefaultLink.href = "#";
      setDefaultLink.className = "address-set-default";
      setDefaultLink.textContent = "Set as default";
      setDefaultLink.addEventListener("click", function (event) {
        event.preventDefault();
        makeDefault(card);
      });
      card.appendChild(setDefaultLink);
    }

    var actions = document.createElement("div");
    actions.className = "address-actions";

    var editLink = document.createElement("a");
    editLink.href = "#";
    editLink.className = "edit-link";
    editLink.textContent = "Edit";
    editLink.addEventListener("click", function (event) {
      event.preventDefault();
      startEditing(card);
    });

    var deleteLink = document.createElement("a");
    deleteLink.href = "#";
    deleteLink.className = "delete-link";
    deleteLink.textContent = "Delete";
    deleteLink.addEventListener("click", function (event) {
      event.preventDefault();
      deleteCard(card);
    });

    actions.appendChild(editLink);
    actions.appendChild(deleteLink);
    card.appendChild(actions);

    return card;
  }

  function attachHandlersToExistingCards() {
    var existingCards = addressList.querySelectorAll(".address-card");

    existingCards.forEach(function (card) {
      var setDefaultLink = card.querySelector(".address-set-default");
      if (setDefaultLink) {
        setDefaultLink.addEventListener("click", function (event) {
          event.preventDefault();
          makeDefault(card);
        });
      }

      var editLink = card.querySelector(".edit-link");
      editLink.addEventListener("click", function (event) {
        event.preventDefault();
        startEditing(card);
      });

      var deleteLink = card.querySelector(".delete-link");
      deleteLink.addEventListener("click", function (event) {
        event.preventDefault();
        deleteCard(card);
      });
    });
  }

  function makeDefault(card) {
    var allCards = addressList.querySelectorAll(".address-card");

    allCards.forEach(function (otherCard) {
      otherCard.setAttribute("data-default", "false");

      var oldDefaultTag = otherCard.querySelector(".address-default");
      if (oldDefaultTag) {
        oldDefaultTag.remove();
      }

      if (otherCard !== card && !otherCard.querySelector(".address-set-default")) {
        var setDefaultLink = document.createElement("a");
        setDefaultLink.href = "#";
        setDefaultLink.className = "address-set-default";
        setDefaultLink.textContent = "Set as default";
        setDefaultLink.addEventListener("click", function (event) {
          event.preventDefault();
          makeDefault(otherCard);
        });
        otherCard.insertBefore(setDefaultLink, otherCard.querySelector(".address-actions"));
      }
    });

    card.setAttribute("data-default", "true");
    var ownSetDefaultLink = card.querySelector(".address-set-default");
    if (ownSetDefaultLink) {
      ownSetDefaultLink.remove();
    }

    var defaultTag = document.createElement("p");
    defaultTag.className = "address-default";
    defaultTag.textContent = "Default address";
    card.insertBefore(defaultTag, card.querySelector(".address-actions"));
  }

  function deleteCard(card) {
    var confirmed = confirm("Delete this address?");
    if (confirmed) {
      card.remove();
    }
  }

  function startEditing(card) {
    cardBeingEdited = card;

    addressLabelInput.value = card.querySelector(".address-label").textContent;
    fullAddressInput.value = card.querySelector(".address-text").textContent;

    addAddressTitle.textContent = "Edit address";
    saveAddressBtn.textContent = "Update Address";

    addressLabelInput.focus();
  }

  function resetForm() {
    addAddressForm.reset();
    cardBeingEdited = null;
    addAddressTitle.textContent = "Add address";
    saveAddressBtn.textContent = "Save Address";
  }

  addAddressForm.addEventListener("submit", function (event) {
    event.preventDefault();

    addressLabelError.textContent = "";
    fullAddressError.textContent = "";
    addressFormError.textContent = "";

    var isValid = true;
    var labelText = addressLabelInput.value.trim();
    var addressText = fullAddressInput.value.trim();

    if (labelText === "") {
      addressLabelError.textContent = "Give this address a short label.";
      isValid = false;
    }

    if (addressText === "") {
      fullAddressError.textContent = "Full address is required.";
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    if (cardBeingEdited) {
      cardBeingEdited.querySelector(".address-label").textContent = labelText;
      cardBeingEdited.querySelector(".address-text").textContent = addressText;
    } else {
      var isFirstAddress = addressList.querySelectorAll(".address-card").length === 0;
      var newCard = buildAddressCard(labelText, addressText, isFirstAddress);
      addressList.appendChild(newCard);
    }

    resetForm();
  });

  attachHandlersToExistingCards();

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
