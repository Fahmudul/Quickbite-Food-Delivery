document.addEventListener("DOMContentLoaded", function () {
    const order = {
        id: "QB-1048",
        status: "Preparing",
        paymentMethod: "Prepaid",
        riderAssigned: true,
        inventoryRestored: false,
        cancellationReason: "",
        refundStatus: "Not required"
    };

    const currentUserRole = document.body.dataset.userRole;
    const reasonInput = document.getElementById("cancellationReason");
    const reasonError = document.getElementById("reasonError");
    const cancelButton = document.getElementById("cancelAdminOrderButton");
    const statusBadge = document.getElementById("adminOrderStatus");
    const feedback = document.getElementById("adminFeedback");
    // Integration: the merged page shows the rider from the QB-DEV-030 assignment section.
    const riderAssignment = document.getElementById("assignedRiderName");

    const allowedCancellationStates = [
        "Accepted",
        "Preparing",
        "Ready for Pickup"
    ];

    function isAdmin() {
        return currentUserRole === "admin";
    }

    function renderStatus() {
        statusBadge.textContent = order.status;
        statusBadge.className = "admin-status";

        if (order.status === "Accepted") {
            statusBadge.classList.add("status-accepted");
        } else if (order.status === "Preparing") {
            statusBadge.classList.add("status-preparing");
        } else if (order.status === "Ready for Pickup") {
            statusBadge.classList.add("status-ready");
        } else if (order.status === "Picked Up") {
            statusBadge.classList.add("status-picked-up");
        } else if (order.status === "Delivered") {
            statusBadge.classList.add("status-delivered");
        } else {
            statusBadge.classList.add("status-cancelled");
        }

        cancelButton.disabled = !isAdmin()
            || !allowedCancellationStates.includes(order.status);

        if (order.status === "Picked Up") {
            feedback.textContent = "This order has been picked up. Use the failed-delivery flow instead of cancellation.";
        } else if (order.status === "Cancelled") {
            feedback.textContent = "This order has already been cancelled.";
        } else if (order.status === "Delivered") {
            feedback.textContent = "A delivered order cannot be cancelled.";
        }
    }

    function clearReasonError() {
        reasonError.textContent = "";
        reasonInput.classList.remove("invalid");
        reasonInput.removeAttribute("aria-invalid");
    }

    function showReasonError(message) {
        reasonError.textContent = message;
        reasonInput.classList.add("invalid");
        reasonInput.setAttribute("aria-invalid", "true");
        reasonInput.focus();
    }

    function addResultLine(list, message) {
        const item = document.createElement("li");
        item.textContent = message;
        list.appendChild(item);
    }

    cancelButton.addEventListener("click", function () {
        feedback.textContent = "";
        clearReasonError();

        if (!isAdmin()) {
            feedback.textContent = "Only an administrator can cancel this order.";
            return;
        }

        if (!allowedCancellationStates.includes(order.status)) {
            if (order.status === "Picked Up") {
                feedback.textContent = "This order has been picked up. Use the failed-delivery flow.";
            } else {
                feedback.textContent = "This order cannot be cancelled in its current state.";
            }
            renderStatus();
            return;
        }

        const reason = reasonInput.value.trim();

        if (reason === "") {
            showReasonError("Please enter a reason for cancelling this order.");
            return;
        }

        if (reason.length < 5) {
            showReasonError("Please enter a reason with at least 5 characters.");
            return;
        }

        if (reason.length > 300) {
            showReasonError("The reason cannot be longer than 300 characters.");
            return;
        }

        const confirmed = window.confirm("Confirm cancellation of order #" + order.id + "?");
        if (!confirmed) {
            return;
        }

        const previousStatus = order.status;
        order.cancellationReason = reason;
        order.status = "Cancelled";

        const results = [];

        if (previousStatus === "Accepted" && !order.inventoryRestored) {
            order.inventoryRestored = true;
            results.push("Inventory restoration marked for this pre-preparation cancellation.");
        } else {
            results.push("Inventory was not restored because preparation had started.");
        }

        if (order.riderAssigned) {
            order.riderAssigned = false;
            riderAssignment.textContent = "Assignment released";
            results.push("Pre-pickup rider assignment released.");
        } else {
            results.push("No rider assignment needed to be released.");
        }

        if (order.paymentMethod === "Prepaid") {
            order.refundStatus = "Pending QB-DEV-025 resolution";
            results.push("Prepaid refund referred for QB-DEV-025 resolution.");
        } else {
            order.refundStatus = "Not required for COD";
            results.push("No refund required for Cash on Delivery.");
        }

        renderStatus();
        feedback.textContent = "Order cancelled in this frontend demonstration. Recorded reason: " + order.cancellationReason;

        const resultList = document.createElement("ul");
        resultList.className = "admin-result-list";
        feedback.appendChild(resultList);
        while (results.length > 0) {
            addResultLine(resultList, results.shift());
        }

        cancelButton.disabled = true;
        reasonInput.disabled = true;

        // Integration: tell the rider assignment controls (QB-DEV-030) the order is cancelled.
        document.dispatchEvent(new CustomEvent("qb:order-cancelled", { detail: { orderId: order.id } }));
    });

    reasonInput.addEventListener("input", function () {
        clearReasonError();
    });

    if (!isAdmin()) {
        cancelButton.disabled = true;
        reasonInput.disabled = true;
        feedback.textContent = "Only administrators can manage order cancellation.";
    }

    renderStatus();
});
