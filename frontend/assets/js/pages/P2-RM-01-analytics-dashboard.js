document.addEventListener("DOMContentLoaded", function () {
    const currentRole = document.body.dataset.userRole;

    const restaurantData = {
        restaurantId: "REST-001",
        restaurantName: "Burger House",
        orders: {
            total: 326,
            completed: 287,
            cancelled: 21,
            active: 18
        },
        totalSales: 118000,
        outOfStockItems: 21,
        menuItems: [
            { name: "Chicken Burger", orders: 128 },
            { name: "Beef Burger", orders: 76 },
            { name: "French Fries", orders: 54 },
            { name: "Chicken Wrap", orders: 32 }
        ]
    };

    const topDish = restaurantData.menuItems.reduce(function (top, item) {
        return item.orders > top.orders ? item : top;
    }, restaurantData.menuItems[0]);

    function formatNumber(value) {
        return value.toLocaleString("en-US");
    }

    function renderStatistics() {
        document.getElementById("managerTotalOrders").textContent = formatNumber(restaurantData.orders.total);
        document.getElementById("managerCompletedOrders").textContent = formatNumber(restaurantData.orders.completed);
        document.getElementById("managerSales").textContent = "৳" + Math.round(restaurantData.totalSales / 1000) + "K";
        document.getElementById("managerOutOfStock").textContent = restaurantData.outOfStockItems;
        document.getElementById("managerTopDish").textContent = topDish.name.replace("Chicken ", "");
    }

    function renderPopularItems() {
        const list = document.getElementById("popularItems");
        list.replaceChildren();

        restaurantData.menuItems.forEach(function (item) {
            const row = document.createElement("div");
            row.className = "popular-item";

            const name = document.createElement("span");
            name.textContent = item.name;

            const count = document.createElement("strong");
            count.textContent = item.orders + " orders";

            row.append(name, count);
            list.appendChild(row);
        });
    }

    function renderOrderOutcomes() {
        const list = document.getElementById("orderOutcomes");
        const outcomes = [
            { label: "Delivered", count: restaurantData.orders.completed },
            { label: "Cancelled", count: restaurantData.orders.cancelled },
            { label: "Currently active", count: restaurantData.orders.active }
        ];

        list.replaceChildren();

        outcomes.forEach(function (item) {
            const row = document.createElement("div");
            row.className = "outcome-item";

            const label = document.createElement("span");
            label.textContent = item.label;

            const count = document.createElement("strong");
            count.textContent = formatNumber(item.count);

            row.append(label, count);
            list.appendChild(row);
        });
    }

    if (currentRole !== "restaurant-manager") {
        document.querySelector(".main-content").textContent = "This dashboard is available to the restaurant manager only.";
        return;
    }

    renderStatistics();
    renderPopularItems();
    renderOrderOutcomes();
});
