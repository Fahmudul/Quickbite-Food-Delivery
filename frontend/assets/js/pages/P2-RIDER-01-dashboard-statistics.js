document.addEventListener("DOMContentLoaded", function () {
    const currentRole = document.body.dataset.userRole;
    const currentRiderId = "RIDER-204";

    const riderDeliveries = [
        { riderId: "RIDER-204", status: "Delivered", count: 184 },
        { riderId: "RIDER-204", status: "Failed Delivery", count: 7 }
    ];

    const riderAccount = {
        riderId: "RIDER-204",
        dutyStatus: "Online"
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
        document.getElementById("riderDutyStatus").textContent = riderAccount.dutyStatus;
    }

    if (currentRole !== "rider" || riderAccount.riderId !== currentRiderId) {
        document.querySelector(".main-content").textContent = "These statistics are available to the rider account only.";
        return;
    }

    renderRiderStatistics();
});
