document.addEventListener("DOMContentLoaded", function () {
    const order = {
        id: "QB-1048",
        customerId: "CUST-1001",
        status: "Accepted",
        paymentMethod: "COD",
        riderAssigned: false,
        inventoryRestored: false,
        cancellationReason: ""
    };

    const currentCustomerId = "CUST-1001";
    const cancelButton = document.getElementById("cancelOrderButton");
    const orderStatus = document.getElementById("orderStatus");
    const trackingIntro = document.getElementById("trackingIntro");
    const trackingMessage = document.getElementById("trackingMessage");
    const timeline = document.getElementById("orderTimeline");

    const steps = [
        "Accepted",
        "Preparing",
        "Ready for Pickup",
        "Picked Up",
        "Delivered"
    ];

    function renderOrder() {
        orderStatus.textContent = order.status;
        orderStatus.className = "order-status";

        if (order.status === "Accepted") {
            orderStatus.classList.add("status-accepted");
            trackingIntro.textContent = "Your order is accepted by the restaurant. You can cancel while it is still in this stage.";
        } else if (order.status === "Cancelled") {
            orderStatus.classList.add("status-cancelled");
            trackingIntro.textContent = "This order has been cancelled.";
        } else {
            orderStatus.classList.add("status-other");
            trackingIntro.textContent = "Your order is being processed. Customer cancellation is no longer available.";
        }

        timeline.replaceChildren();

        if (order.status === "Cancelled") {
            const item = document.createElement("li");
            item.className = "timeline-step cancelled-step";
            const dot = document.createElement("span");
            dot.className = "timeline-dot";
            const content = document.createElement("div");
            const title = document.createElement("strong");
            const description = document.createElement("small");
            title.textContent = "Cancelled";
            description.textContent = "This order was cancelled before preparation started";
            content.append(title, description);
            item.append(dot, content);
            timeline.appendChild(item);
        } else {
            const currentIndex = steps.indexOf(order.status);

            steps.forEach(function (step, index) {
                const item = document.createElement("li");
                item.className = "timeline-step";
                if (index < currentIndex) {
                    item.classList.add("completed");
                }
                if (index === currentIndex) {
                    item.classList.add("completed", "current");
                }

                const dot = document.createElement("span");
                dot.className = "timeline-dot";
                const content = document.createElement("div");
                const title = document.createElement("strong");
                const description = document.createElement("small");
                title.textContent = step;
                description.textContent = step === "Accepted"
                    ? "Your order is accepted"
                    : step === "Preparing"
                    ? "Restaurant is preparing your order"
                    : step === "Ready for Pickup"
                    ? "Your order is ready for the rider"
                    : step === "Picked Up"
                    ? "Rider has collected your order"
                    : "Your order has been delivered";
                content.append(title, description);
                item.append(dot, content);
                timeline.appendChild(item);
            });
        }

        const canCancel = order.customerId === currentCustomerId
            && order.status === "Accepted";

        cancelButton.hidden = !canCancel;
    }

    cancelButton.addEventListener("click", function () {
        if (order.customerId !== currentCustomerId) {
            trackingMessage.textContent = "You can only cancel your own order.";
            return;
        }

        if (order.status !== "Accepted") {
            trackingMessage.textContent = "This order can no longer be cancelled by the customer.";
            renderOrder();
            return;
        }

        const confirmed = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmed) {
            return;
        }

        order.status = "Cancelled";

        if (!order.inventoryRestored) {
            order.inventoryRestored = true;
        }

        if (order.riderAssigned) {
            order.riderAssigned = false;
        }

        if (order.paymentMethod === "Prepaid") {
            trackingMessage.textContent = "Order cancelled. Prepaid refund has been marked for review.";
        } else {
            trackingMessage.textContent = "Order cancelled successfully. No refund is required for COD.";
        }

        renderOrder();
    });

    renderOrder();
});
