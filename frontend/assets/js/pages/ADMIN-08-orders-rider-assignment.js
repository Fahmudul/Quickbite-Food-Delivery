document.addEventListener("DOMContentLoaded", function () {
    const orders = [
        { id: "QB-1048", customer: "Rahim Ahmed", status: "Accepted", riderId: null },
        { id: "QB-1050", customer: "Nabila Rahman", status: "Preparing", riderId: "R-102" },
        { id: "QB-1046", customer: "Omar Faruk", status: "Ready for Pickup", riderId: "R-105" }
    ];

    const riders = [
        { id: "R-101", name: "Sabbir Ahmed", approved: true, online: true, activeOrderId: null },
        { id: "R-102", name: "Kamal Hossain", approved: true, online: true, activeOrderId: "QB-1050" },
        { id: "R-103", name: "Rafiq Hasan", approved: true, online: true, activeOrderId: null },
        { id: "R-104", name: "Hasan Ali", approved: true, online: false, activeOrderId: null },
        { id: "R-105", name: "Jamil Uddin", approved: true, online: true, activeOrderId: "QB-1046" },
        { id: "R-106", name: "Tanim Ahmed", approved: false, online: true, activeOrderId: null }
    ];

    const currentRole = document.body.dataset.userRole;
    const tableBody = document.getElementById("assignmentTableBody");
    const panel = document.getElementById("assignmentPanel");
    const panelTitle = document.getElementById("assignmentPanelTitle");
    const panelDescription = document.getElementById("assignmentPanelDescription");
    const selectedOrderId = document.getElementById("selectedOrderId");
    const selectedOrderStatus = document.getElementById("selectedOrderStatus");
    const riderSelect = document.getElementById("riderSelect");
    const riderSelectError = document.getElementById("riderSelectError");
    const feedback = document.getElementById("assignmentFeedback");
    const assignButton = document.getElementById("assignRiderButton");
    const unassignButton = document.getElementById("unassignRiderButton");
    const assignmentForm = document.getElementById("assignmentForm");
    const closePanelButton = document.getElementById("closeAssignmentPanel");
    let selectedOrder = null;

    const allowedStatuses = ["Accepted", "Preparing", "Ready for Pickup"];

    function isAdmin() {
        return currentRole === "admin";
    }

    function getRiderName(riderId) {
        const rider = riders.find(function (item) {
            return item.id === riderId;
        });
        return rider ? rider.name : "Not assigned";
    }

    function getStatusClass(status) {
        if (status === "Accepted") return "status-accepted";
        if (status === "Preparing") return "status-preparing";
        if (status === "Ready for Pickup") return "status-ready";
        if (status === "Picked Up") return "status-picked-up";
        return "status-cancelled";
    }

    function renderOrders() {
        tableBody.replaceChildren();

        orders.forEach(function (order) {
            const row = document.createElement("tr");
            const orderCell = document.createElement("td");
            orderCell.className = "assignment-order-id";
            orderCell.textContent = order.id;

            const customerCell = document.createElement("td");
            customerCell.textContent = order.customer;

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");
            statusBadge.className = "assignment-status " + getStatusClass(order.status);
            statusBadge.textContent = order.status;
            statusCell.appendChild(statusBadge);

            const riderCell = document.createElement("td");
            riderCell.className = "rider-cell";
            riderCell.textContent = getRiderName(order.riderId);

            const actionCell = document.createElement("td");
            const actionButton = document.createElement("button");
            actionButton.type = "button";
            actionButton.className = "assignment-action";
            actionButton.dataset.orderId = order.id;
            actionButton.textContent = order.riderId ? "Manage" : "Assign Rider";
            actionButton.disabled = !allowedStatuses.includes(order.status) || !isAdmin();
            actionCell.appendChild(actionButton);

            row.append(orderCell, customerCell, statusCell, riderCell, actionCell);
            tableBody.appendChild(row);
        });

        document.getElementById("orderCount").textContent = orders.length + " orders";
    }

    function getEligibleRiders(order) {
        return riders.filter(function (rider) {
            return rider.approved
                && rider.online
                && (rider.activeOrderId === null || rider.activeOrderId === order.id)
                && rider.id !== order.riderId;
        });
    }

    function renderRiderOptions(order) {
        riderSelect.replaceChildren();

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Choose an available rider";
        riderSelect.appendChild(placeholder);

        getEligibleRiders(order).forEach(function (rider) {
            const option = document.createElement("option");
            option.value = rider.id;
            option.textContent = rider.name;
            riderSelect.appendChild(option);
        });

        if (riderSelect.options.length === 1) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No eligible riders available";
            option.disabled = true;
            riderSelect.appendChild(option);
        }
    }

    function clearMessage() {
        riderSelectError.textContent = "";
        feedback.textContent = "";
        riderSelect.classList.remove("invalid");
        riderSelect.removeAttribute("aria-invalid");
    }

    function openAssignmentPanel(order) {
        if (!isAdmin() || !allowedStatuses.includes(order.status)) {
            return;
        }

        selectedOrder = order;
        clearMessage();
        selectedOrderId.textContent = order.id;
        selectedOrderStatus.textContent = order.status;
        renderRiderOptions(order);

        const assigned = order.riderId !== null;
        panelTitle.textContent = assigned ? "Manage rider assignment" : "Assign a rider";
        panelDescription.textContent = assigned
            ? "Choose another available rider or remove the current assignment."
            : "Choose an approved rider who is online and available.";
        assignButton.textContent = assigned ? "Reassign Rider" : "Assign Rider";
        unassignButton.hidden = !assigned;
        assignButton.disabled = getEligibleRiders(order).length === 0;

        panel.hidden = false;
        panel.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function showSelectError(message) {
        riderSelectError.textContent = message;
        riderSelect.classList.add("invalid");
        riderSelect.setAttribute("aria-invalid", "true");
        riderSelect.focus();
    }

    assignmentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        clearMessage();

        if (!isAdmin()) {
            feedback.textContent = "Only administrators can assign riders.";
            return;
        }

        if (!selectedOrder || !allowedStatuses.includes(selectedOrder.status)) {
            feedback.textContent = "Rider assignment is not available after pickup.";
            return;
        }

        const riderId = riderSelect.value;
        if (!riderId) {
            showSelectError("Please select an available rider.");
            return;
        }

        const rider = riders.find(function (item) {
            return item.id === riderId;
        });

        if (!rider || !rider.approved || !rider.online) {
            showSelectError("This rider is not approved and available for assignment.");
            return;
        }

        if (rider.activeOrderId !== null) {
            showSelectError("This rider is already handling an active delivery.");
            return;
        }

        if (selectedOrder.riderId === rider.id) {
            showSelectError("This rider is already assigned to this order.");
            return;
        }

        const oldRider = riders.find(function (item) {
            return item.id === selectedOrder.riderId;
        });

        if (oldRider) {
            oldRider.activeOrderId = null;
        }

        rider.activeOrderId = selectedOrder.id;
        selectedOrder.riderId = rider.id;

        feedback.textContent = oldRider
            ? "Rider assignment updated successfully."
            : "Rider assigned successfully.";

        renderOrders();
        renderRiderOptions(selectedOrder);
        unassignButton.hidden = false;
        assignButton.textContent = "Reassign Rider";
        assignButton.disabled = getEligibleRiders(selectedOrder).length === 0;
    });

    unassignButton.addEventListener("click", function () {
        clearMessage();

        if (!isAdmin() || !selectedOrder || !allowedStatuses.includes(selectedOrder.status)) {
            feedback.textContent = "This order cannot be unassigned after pickup.";
            return;
        }

        if (!selectedOrder.riderId) {
            feedback.textContent = "There is no rider assigned to this order.";
            return;
        }

        const rider = riders.find(function (item) {
            return item.id === selectedOrder.riderId;
        });

        if (rider) {
            rider.activeOrderId = null;
        }

        selectedOrder.riderId = null;
        feedback.textContent = "Rider has been unassigned. The rider is now available.";
        renderOrders();
        renderRiderOptions(selectedOrder);
        panelTitle.textContent = "Assign a rider";
        panelDescription.textContent = "Choose an approved rider who is online and available.";
        assignButton.textContent = "Assign Rider";
        assignButton.disabled = getEligibleRiders(selectedOrder).length === 0;
        unassignButton.hidden = true;
    });

    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-order-id]");
        if (!button) return;

        const order = orders.find(function (item) {
            return item.id === button.dataset.orderId;
        });

        if (order) {
            openAssignmentPanel(order);
        }
    });

    closePanelButton.addEventListener("click", function () {
        panel.hidden = true;
        selectedOrder = null;
    });

    riderSelect.addEventListener("change", clearMessage);

    if (!isAdmin()) {
        panel.hidden = true;
    }

    renderOrders();
});
