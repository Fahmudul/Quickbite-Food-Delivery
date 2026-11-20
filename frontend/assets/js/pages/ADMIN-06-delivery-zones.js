document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("zoneTableBody");
    const zoneForm = document.getElementById("zoneForm");
    const zoneNameInput = document.getElementById("zoneName");
    const zoneNameError = document.getElementById("zoneNameError");
    const formMessage = document.getElementById("formMessage");
    const formHeading = document.getElementById("formHeading");
    const formDescription = document.getElementById("formDescription");
    const saveZoneButton = document.getElementById("saveZoneButton");
    const cancelEditButton = document.getElementById("cancelEditButton");
    const addZoneButton = document.getElementById("addZoneButton");
    const zoneCount = document.getElementById("zoneCount");
    const roleNotice = document.getElementById("roleNotice");

    const userRole = document.body.dataset.userRole;
    let editingZoneId = null;

    let zones = [
        { id: 1, name: "Uttara", active: true },
        { id: 2, name: "Banani", active: true },
        { id: 3, name: "Dhanmondi", active: true },
        { id: 4, name: "Mirpur", active: false }
    ];

    function isAdmin() {
        return userRole === "admin";
    }

    function makeCell(className, value) {
        const cell = document.createElement("td");
        cell.className = className;
        cell.textContent = value;
        return cell;
    }

    function makeActionButton(label, action, zoneId, extraClass) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dz-small-button " + extraClass;
        button.textContent = label;
        button.dataset.action = action;
        button.dataset.zoneId = zoneId;
        button.disabled = !isAdmin();
        return button;
    }

    function showZones() {
        tableBody.replaceChildren();

        zones.forEach(function (zone) {
            const row = document.createElement("tr");
            const nameCell = makeCell("dz-zone-name", zone.name);
            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className = zone.active
                ? "dz-status dz-status-active"
                : "dz-status dz-status-inactive";
            statusBadge.textContent = zone.active ? "Active" : "Inactive";
            statusCell.appendChild(statusBadge);

            const availabilityText = zone.active
                ? "Available for new selections"
                : "Not available for new selections";
            const availabilityCell = makeCell("dz-availability", availabilityText);

            const actionCell = document.createElement("td");
            const actionGroup = document.createElement("div");
            actionCell.className = "dz-action-cell";
            actionGroup.className = "dz-actions";

            actionGroup.appendChild(
                makeActionButton("Edit", "edit", zone.id, "")
            );

            const toggleButton = makeActionButton(
                zone.active ? "Deactivate" : "Activate",
                "toggle",
                zone.id,
                zone.active ? "dz-disable-button" : "dz-enable-button"
            );

            actionGroup.appendChild(toggleButton);
            actionCell.appendChild(actionGroup);
            row.append(nameCell, statusCell, availabilityCell, actionCell);
            tableBody.appendChild(row);
        });

        zoneCount.textContent = zones.length + (zones.length === 1 ? " zone" : " zones");
    }

    function clearMessages() {
        zoneNameError.textContent = "";
        formMessage.textContent = "";
        zoneNameInput.classList.remove("dz-invalid");
        zoneNameInput.removeAttribute("aria-invalid");
    }

    function showError(message) {
        zoneNameError.textContent = message;
        zoneNameInput.classList.add("dz-invalid");
        zoneNameInput.setAttribute("aria-invalid", "true");
        zoneNameInput.focus();
    }

    function resetForm() {
        editingZoneId = null;
        zoneForm.reset();
        clearMessages();
        formHeading.textContent = "Add a Delivery Zone";
        formDescription.textContent = "Enter the name of the delivery area.";
        saveZoneButton.textContent = "Save Zone";
        cancelEditButton.hidden = true;
    }

    function editZone(zoneId) {
        const zone = zones.find(function (item) {
            return item.id === zoneId;
        });

        if (!zone || !isAdmin()) {
            return;
        }

        editingZoneId = zone.id;
        zoneNameInput.value = zone.name;
        clearMessages();
        formHeading.textContent = "Edit Delivery Zone";
        formDescription.textContent = "Update the name of this delivery area.";
        saveZoneButton.textContent = "Update Zone";
        cancelEditButton.hidden = false;

        document.getElementById("zoneFormSection").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        zoneNameInput.focus();
    }

    function validateZoneName(name) {
        if (name.length < 2) {
            return "Zone name must contain at least 2 characters.";
        }

        if (name.length > 40) {
            return "Zone name cannot be longer than 40 characters.";
        }

        if (!/^[A-Za-z0-9][A-Za-z0-9\s'-]*$/.test(name)) {
            return "Use letters, numbers, spaces, hyphens or apostrophes only.";
        }

        const duplicate = zones.some(function (zone) {
            return zone.name.toLowerCase() === name.toLowerCase()
                && zone.id !== editingZoneId;
        });

        if (duplicate) {
            return "This delivery zone already exists.";
        }

        return "";
    }

    zoneForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!isAdmin()) {
            formMessage.textContent = "Only administrators can manage delivery zones.";
            return;
        }

        const zoneName = zoneNameInput.value.trim().replace(/\s+/g, " ");
        clearMessages();

        if (zoneName === "") {
            showError("Please enter a zone name.");
            return;
        }

        const errorMessage = validateZoneName(zoneName);

        if (errorMessage !== "") {
            showError(errorMessage);
            return;
        }

        const successMessage = editingZoneId === null
            ? "Delivery zone added successfully."
            : "Delivery zone updated successfully.";

        if (editingZoneId === null) {
            zones.push({
                id: Date.now(),
                name: zoneName,
                active: true
            });
        } else {
            const zone = zones.find(function (item) {
                return item.id === editingZoneId;
            });

            if (zone) {
                zone.name = zoneName;
            }
        }

        showZones();
        resetForm();
        formMessage.textContent = successMessage;
    });

    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button || !isAdmin()) {
            return;
        }

        const zoneId = Number(button.dataset.zoneId);
        const zone = zones.find(function (item) {
            return item.id === zoneId;
        });

        if (!zone) {
            return;
        }

        if (button.dataset.action === "edit") {
            editZone(zoneId);
        }

        if (button.dataset.action === "toggle") {
            zone.active = !zone.active;
            showZones();
        }
    });

    zoneNameInput.addEventListener("input", function () {
        if (zoneNameError.textContent !== "") {
            clearMessages();
        }
    });

    addZoneButton.addEventListener("click", function () {
        resetForm();
        document.getElementById("zoneFormSection").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        zoneNameInput.focus();
    });

    cancelEditButton.addEventListener("click", resetForm);

    if (!isAdmin()) {
        roleNotice.hidden = false;
        addZoneButton.disabled = true;
        saveZoneButton.disabled = true;
        zoneNameInput.disabled = true;
    }

    showZones();
});
