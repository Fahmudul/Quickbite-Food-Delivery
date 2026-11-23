document.addEventListener("DOMContentLoaded", function () {
    const currentRole = document.body.dataset.userRole;

    const platformData = {
        ordersByStatus: [
            { status: "Accepted", count: 64 },
            { status: "Preparing", count: 58 },
            { status: "Ready", count: 42 },
            { status: "Delivered", count: 1036 },
            { status: "Failed", count: 48 }
        ],
        deliveryFees: 486000,
        restaurants: 24,
        riders: 38,
        operationalItems: [
            { label: "Pending restaurant applications", count: 3 },
            { label: "Pending rider approvals", count: 5 },
            { label: "Orders needing review", count: 4 },
            { label: "Active delivery problems", count: 2 },
            { label: "Prepaid refunds to review", count: 1 }
        ]
    };

    const totalOrders = platformData.ordersByStatus.reduce(function (total, item) {
        return total + item.count;
    }, 0);

    const completedOrders = platformData.ordersByStatus.find(function (item) {
        return item.status === "Delivered";
    }).count;

    function formatNumber(value) {
        return value.toLocaleString("en-US");
    }

    function renderStatistics() {
        document.getElementById("totalOrders").textContent = formatNumber(totalOrders);
        document.getElementById("completedOrders").textContent = formatNumber(completedOrders);
        document.getElementById("deliveryFees").textContent = "৳" + Math.round(platformData.deliveryFees / 1000) + "K";
        document.getElementById("restaurantCount").textContent = platformData.restaurants;
        document.getElementById("riderCount").textContent = platformData.riders;
    }

    function renderStatusChart() {
        const chart = document.getElementById("statusChart");
        const highestCount = Math.max.apply(null, platformData.ordersByStatus.map(function (item) {
            return item.count;
        }));

        chart.replaceChildren();

        platformData.ordersByStatus.forEach(function (item) {
            const column = document.createElement("div");
            column.className = "chart-column";

            const value = document.createElement("span");
            value.className = "chart-value";
            value.textContent = formatNumber(item.count);

            const barArea = document.createElement("div");
            barArea.className = "chart-bar-area";

            const bar = document.createElement("div");
            bar.className = "chart-bar";
            bar.style.height = Math.max(5, item.count / highestCount * 100) + "px";
            bar.setAttribute("role", "img");
            bar.setAttribute("aria-label", item.status + ": " + item.count + " orders");

            const label = document.createElement("span");
            label.className = "chart-label";
            label.textContent = item.status;

            barArea.appendChild(bar);
            column.append(value, barArea, label);
            chart.appendChild(column);
        });
    }

    function renderOperationalSnapshot() {
        const list = document.getElementById("operationalSnapshot");
        list.replaceChildren();

        platformData.operationalItems.forEach(function (item) {
            const row = document.createElement("div");
            row.className = "snapshot-row";

            const label = document.createElement("span");
            label.textContent = item.label;

            const count = document.createElement("strong");
            count.textContent = item.count;

            row.append(label, count);
            list.appendChild(row);
        });
    }

    if (currentRole !== "admin") {
        document.querySelector(".main-content").textContent = "This dashboard is available to administrators only.";
        return;
    }

    renderStatistics();
    renderStatusChart();
    renderOperationalSnapshot();
});
