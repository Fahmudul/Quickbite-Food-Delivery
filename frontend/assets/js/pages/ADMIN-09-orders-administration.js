document.addEventListener("DOMContentLoaded", function () {
    const order = {
        id: "QB-1048",
        status: "Preparing",
        riderId: "R-102"
    };

    const riders = [
        { id: "R-101", name: "Sabbir Ahmed", approved: true, online: true, activeOrderId: null },
        { id: "R-102", name: "Kamal Hossain", approved: true, online: true, activeOrderId: "QB-1048" },
        { id: "R-103", name: "Rafiq Hasan", approved: true, online: true, activeOrderId: null },
        { id: "R-104", name: "Hasan Ali", approved: true, online: false, activeOrderId: null },
        { id: "R-105", name: "Jamil Uddin", approved: false, online: true, activeOrderId: null }
    ];

    const currentRole = document.body.dataset.userRole;
    const form = document.getElementById("adminRiderForm");
    const riderSelect = document.getElementById("adminRiderSelect");
    const riderError = document.getElementById("adminRiderError");
    const feedback = document.getElementById("adminRiderFeedback");
    const assignedRiderName = document.getElementById("assignedRiderName");
    const statusBadge = document.getElementById("adminOrderStatus");
    const assignButton = document.getElementById("adminAssignButton");
    const unassignButton = document.getElementById("adminUnassignButton");
    const allowedStatuses = ["Accepted", "Preparing", "Ready for Pickup"];

    function isAdmin() {
        return currentRole === "admin";
    }

    function getRider(riderId) {
        return riders.find(function (rider) {
            return rider.id === riderId;
        });
    }

    function renderOrder() {
        statusBadge.textContent = order.status;
        statusBadge.className = "admin-status";

        if (order.status === "Accepted") {
            statusBadge.classList.add("status-accepted");
        } else if (order.status === "Preparing") {
            statusBadge.classList.add("status-preparing");
        } else if (order.status === "Ready for Pickup") {
            statusBadge.classList.add("status-ready");
        } else {
            statusBadge.classList.add("status-picked-up");
        }

        const assignedRider = getRider(order.riderId);
        assignedRiderName.textContent = assignedRider ? assignedRider.name : "Not assigned";

        const canManage = isAdmin() && allowedStatuses.includes(order.status);
        riderSelect.disabled = !canManage;
        assignButton.disabled = !canManage;
        unassignButton.disabled = !canManage || order.riderId === null;

        if (order.status === "Picked Up") {
            feedback.textContent = "This order has been picked up. Rider assignment can no longer be changed.";
        } else if (!canManage) {
            feedback.textContent = "Rider assignment is not available for this order status.";
        }
    }

    function getAvailableRiders() {
        return riders.filter(function (rider) {
            return rider.approved
                && rider.online
                && rider.activeOrderId === null
                && rider.id !== order.riderId;
        });
    }

    function renderRiderOptions() {
        riderSelect.replaceChildren();

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Choose an available rider";
        riderSelect.appendChild(placeholder);

        getAvailableRiders().forEach(function (rider) {
            const option = document.createElement("option");
            option.value = rider.id;
            option.textContent = rider.name;
            riderSelect.appendChild(option);
        });

        if (riderSelect.options.length === 1) {
            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = "No eligible riders available";
            emptyOption.disabled = true;
            riderSelect.appendChild(emptyOption);
        }

        assignButton.textContent = order.riderId ? "Reassign Rider" : "Assign Rider";
        assignButton.disabled = !isAdmin()
            || !allowedStatuses.includes(order.status)
            || getAvailableRiders().length === 0;
    }

    function clearFeedback() {
        riderError.textContent = "";
        riderSelect.classList.remove("invalid");
        riderSelect.removeAttribute("aria-invalid");
        feedback.textContent = "";
    }

    function showError(message) {
        riderError.textContent = message;
        riderSelect.classList.add("invalid");
        riderSelect.setAttribute("aria-invalid", "true");
        riderSelect.focus();
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearFeedback();

        if (!isAdmin()) {
            feedback.textContent = "Only administrators can manage rider assignments.";
            return;
        }

        if (!allowedStatuses.includes(order.status)) {
            feedback.textContent = "Rider assignment cannot be changed after pickup.";
            renderOrder();
            return;
        }

        const riderId = riderSelect.value;
        if (!riderId) {
            showError("Please select an available rider.");
            return;
        }

        const newRider = getRider(riderId);
        if (!newRider || !newRider.approved || !newRider.online) {
            showError("Only approved and online riders can be assigned.");
            return;
        }

        if (newRider.activeOrderId !== null) {
            showError("This rider is already handling an active delivery.");
            return;
        }

        if (newRider.id === order.riderId) {
            showError("This rider is already assigned to this order.");
            return;
        }

        const oldRider = getRider(order.riderId);
        if (oldRider) {
            oldRider.activeOrderId = null;
        }

        newRider.activeOrderId = order.id;
        order.riderId = newRider.id;

        feedback.textContent = oldRider
            ? "Rider assignment updated successfully."
            : "Rider assigned successfully.";

        renderRiderOptions();
        renderOrder();
    });

    unassignButton.addEventListener("click", function () {
        clearFeedback();

        if (!isAdmin()) {
            feedback.textContent = "Only administrators can unassign riders.";
            return;
        }

        if (!allowedStatuses.includes(order.status)) {
            feedback.textContent = "Rider assignment cannot be changed after pickup.";
            renderOrder();
            return;
        }

        if (!order.riderId) {
            feedback.textContent = "There is no rider assigned to this order.";
            return;
        }

        const rider = getRider(order.riderId);
        if (rider) {
            rider.activeOrderId = null;
        }

        order.riderId = null;
        feedback.textContent = "Rider unassigned successfully. The rider is now available.";

        renderRiderOptions();
        renderOrder();
    });

    riderSelect.addEventListener("change", clearFeedback);

    if (!isAdmin()) {
        riderSelect.disabled = true;
        assignButton.disabled = true;
        unassignButton.disabled = true;
        feedback.textContent = "Only administrators can manage rider assignments.";
    }

    renderRiderOptions();
    renderOrder();
});
