document.addEventListener("DOMContentLoaded", function () {
    const addressOptions = document.getElementById("addressOptions");
    const changeAddress = document.getElementById("changeAddress");
    const addressError = document.getElementById("addressError");
    const paymentError = document.getElementById("paymentError");
    const checkoutError = document.getElementById("checkoutError");
    const checkoutFeedback = document.getElementById("checkoutFeedback");
    const reservationStatus = document.getElementById("reservationStatus");
    const placeOrderButton = document.getElementById("placeOrderButton");

    const checkout = {
        customerId: 1,
        restaurantActive: true,
        restaurantZones: ["Dhanmondi", "Mirpur"],
        reservationExpiresAt: Date.now() + 15 * 60 * 1000,
        reservedItems: [
            { name: "Chicken Burger", quantity: 2, lockedPrice: 180 },
            { name: "French Fries", quantity: 1, lockedPrice: 120 }
        ],
        deliveryFee: 60
    };

    const savedAddresses = [
        { id: "address-1", customerId: 1, zone: "Dhanmondi", active: true },
        { id: "address-2", customerId: 1, zone: "Banani", active: true }
    ];

    function money(amount) {
        return "৳ " + amount.toFixed(2).replace(/\.00$/, "");
    }

    function calculateTotal() {
        let subtotal = 0;

        checkout.reservedItems.forEach(function (item) {
            subtotal += item.quantity * item.lockedPrice;
        });

        document.getElementById("itemOnePrice").textContent = money(
            checkout.reservedItems[0].quantity * checkout.reservedItems[0].lockedPrice
        );
        document.getElementById("itemTwoPrice").textContent = money(
            checkout.reservedItems[1].quantity * checkout.reservedItems[1].lockedPrice
        );
        document.getElementById("subtotal").textContent = money(subtotal);
        document.getElementById("deliveryFee").textContent = money(checkout.deliveryFee);
        document.getElementById("orderTotal").textContent = money(subtotal + checkout.deliveryFee);
    }

    function selectedAddress() {
        const selected = document.querySelector('input[name="address"]:checked');
        if (!selected) return null;

        return savedAddresses.find(function (address) {
            return address.id === selected.value;
        }) || null;
    }

    function selectedPayment() {
        const selected = document.querySelector('input[name="payment"]:checked');
        return selected ? selected.value : "";
    }

    function showReservationTime() {
        const secondsLeft = Math.max(0, Math.ceil((checkout.reservationExpiresAt - Date.now()) / 1000));
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = String(secondsLeft % 60).padStart(2, "0");

        if (secondsLeft === 0) {
            reservationStatus.textContent = "Cart reservation expired. Return to cart and reserve again.";
            reservationStatus.style.color = "var(--danger)";
            placeOrderButton.disabled = true;
            return;
        }

        reservationStatus.textContent = "Reservation remaining: " + minutes + ":" + seconds;
    }

    function validateCheckout() {
        addressError.textContent = "";
        paymentError.textContent = "";
        checkoutError.textContent = "";
        checkoutFeedback.textContent = "";

        if (Date.now() >= checkout.reservationExpiresAt) {
            checkoutError.textContent = "Your reservation has expired. Please reserve the cart again.";
            return false;
        }

        if (checkout.reservedItems.length === 0) {
            checkoutError.textContent = "Your cart is empty.";
            return false;
        }

        if (!checkout.restaurantActive) {
            checkoutError.textContent = "This restaurant is currently unavailable.";
            return false;
        }

        const address = selectedAddress();
        if (!address) {
            addressError.textContent = "Please select a delivery address.";
            return false;
        }

        if (address.customerId !== checkout.customerId || !address.active) {
            addressError.textContent = "This address is not available for checkout.";
            return false;
        }

        if (!checkout.restaurantZones.includes(address.zone)) {
            addressError.textContent = "This restaurant does not deliver to the selected zone.";
            return false;
        }

        if (selectedPayment() !== "cod" && selectedPayment() !== "online") {
            paymentError.textContent = "Please choose a payment method.";
            return false;
        }

        return true;
    }

    changeAddress.addEventListener("click", function (event) {
        event.preventDefault();
        addressOptions.hidden = !addressOptions.hidden;
        changeAddress.textContent = addressOptions.hidden ? "Change address" : "Hide addresses";
    });

    document.querySelectorAll('input[name="address"], input[name="payment"]').forEach(function (input) {
        input.addEventListener("change", function () {
            addressError.textContent = "";
            paymentError.textContent = "";
            checkoutError.textContent = "";
            checkoutFeedback.textContent = "";
        });
    });

    placeOrderButton.addEventListener("click", function () {
        if (!validateCheckout()) return;

        if (selectedPayment() === "cod") {
            checkoutFeedback.textContent = "Checkout details look valid. The server must confirm and create the COD order.";
        } else {
            checkoutFeedback.textContent = "Checkout details look valid. The server must verify the amount before starting sandbox payment.";
        }
    });

    calculateTotal();
    showReservationTime();
    setInterval(showReservationTime, 1000);
});
