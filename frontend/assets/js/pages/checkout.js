document.addEventListener("DOMContentLoaded", function () {
    const addressOptions = document.getElementById("addressOptions");
    const changeAddress = document.getElementById("changeAddress");
    const addressError = document.getElementById("addressError");
    const paymentError = document.getElementById("paymentError");
    const checkoutError = document.getElementById("checkoutError");
    const checkoutFeedback = document.getElementById("checkoutFeedback");
    const reservationStatus = document.getElementById("reservationStatus");
    const placeOrderButton = document.getElementById("placeOrderButton");

    // Integration: reserved items and the reservation window now come from the
    // customer's real cart (Active Cart, QB-DEV-018/019) instead of sample data.
    const cart = qbGetCart();

    const checkout = {
        customerId: 1,
        restaurantActive: true,
        restaurantZones: ["Dhanmondi", "Mirpur"],
        reservationExpiresAt: Date.now() + getReservationSecondsLeft(cart) * 1000,
        reservedItems: cart.items.map(function (item) {
            return { name: item.name, quantity: item.qty, lockedPrice: item.price };
        }),
        deliveryFee: QB_DELIVERY_FEE
    };

    const savedAddresses = [
        { id: "address-1", customerId: 1, zone: "Dhanmondi", active: true, text: "House 12, Road 5, Dhanmondi, Dhaka" },
        { id: "address-2", customerId: 1, zone: "Banani", active: true, text: "Road 11, Banani, Dhaka" }
    ];

    function money(amount) {
        return "৳ " + amount.toFixed(2).replace(/\.00$/, "");
    }

    function calculateTotal() {
        let subtotal = 0;

        const summaryItems = document.getElementById("summaryItems");
        summaryItems.replaceChildren();

        checkout.reservedItems.forEach(function (item) {
            subtotal += item.quantity * item.lockedPrice;

            const row = document.createElement("div");
            row.className = "summary-row";
            const name = document.createElement("span");
            name.textContent = item.name + " × " + item.quantity;
            const price = document.createElement("span");
            price.textContent = money(item.quantity * item.lockedPrice);
            row.append(name, price);
            summaryItems.appendChild(row);
        });
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

    // Integration: after validation, continue into the COD / sandbox payment
    // flow from QB-DEV-022 and QB-DEV-023.
    placeOrderButton.addEventListener("click", function () {
        if (!validateCheckout()) return;

        const address = selectedAddress();
        placeOrderButton.disabled = true;

        if (selectedPayment() === "cod") {
            placeOrderButton.textContent = "Placing order…";
            const order = qbCreateOrder(cart, "COD", address.text);
            window.location.href = "./order-confirmation.html?id=" + encodeURIComponent(order.id);
            return;
        }

        // Online payment: freeze this checkout snapshot while payment is unresolved (FR-21).
        localStorage.setItem("quickbite_pendingCheckout", JSON.stringify({
            cart: cart,
            address: address.text,
            total: cart.items.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0) + checkout.deliveryFee
        }));
        document.querySelectorAll('input[name="address"], input[name="payment"]').forEach(function (input) {
            input.disabled = true;
        });
        placeOrderButton.textContent = "Redirecting to sandbox payment…";
        window.location.href = "./sandbox-payment-return.html?status=failed";
    });

    calculateTotal();
    showReservationTime();
    setInterval(showReservationTime, 1000);
});
