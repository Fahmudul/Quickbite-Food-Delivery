document.addEventListener("DOMContentLoaded", function () {
    const currentRole = document.body.dataset.userRole;
    const currentRiderId = "RIDER-204";

    const riderDeliveries = [
        { riderId: "RIDER-204", status: "Delivered", count: 184 },
        { riderId: "RIDER-204", status: "Failed Delivery", count: 7 }
    ];

    // Integration: duty status is shown by the availability card (QB-DEV-029) on the same dashboard.
    const riderAccount = {
        riderId: "RIDER-204"
    };

    function getDeliveryCount(status) {
        return riderDeliveries
            .filter(function (delivery) {
                return delivery.riderId === currentRiderId && delivery.status === status;
            })
            .reduce(function (total, delivery) {
                return total + delivery.count;
            }, 0);
    }

    function renderRiderStatistics() {
        document.getElementById("riderCompleted").textContent = getDeliveryCount("Delivered").toLocaleString("en-US");
        document.getElementById("riderFailed").textContent = getDeliveryCount("Failed Delivery").toLocaleString("en-US");
    }

    if (currentRole !== "rider" || riderAccount.riderId !== currentRiderId) {
        document.querySelector(".rider-stat-grid").textContent = "These statistics are available to the rider account only.";
        return;
    }

    renderRiderStatistics();
});
