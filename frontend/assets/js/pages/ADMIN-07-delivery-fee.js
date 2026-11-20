document.addEventListener("DOMContentLoaded", function () {
    const feeForm = document.getElementById("feeForm");
    const newFeeInput = document.getElementById("newFee");
    const currentFeeText = document.getElementById("currentFee");
    const feeError = document.getElementById("feeError");
    const feeMessage = document.getElementById("feeMessage");
    const updateFeeButton = document.getElementById("updateFeeButton");
    const accessMessage = document.getElementById("accessMessage");

    let currentFee = 60;
    const userRole = document.body.dataset.userRole;

    function showCurrentFee() {
        currentFeeText.textContent = "৳ " + currentFee.toFixed(2).replace(/\.00$/, "");
    }

    function clearError() {
        feeError.textContent = "";
        newFeeInput.classList.remove("fee-invalid");
        newFeeInput.removeAttribute("aria-invalid");
    }

    function showError(message) {
        feeError.textContent = message;
        newFeeInput.classList.add("fee-invalid");
        newFeeInput.setAttribute("aria-invalid", "true");
        newFeeInput.focus();
    }

    function validateFee(value) {
        if (value === "") {
            return "Please enter the delivery fee.";
        }

        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            return "Enter a valid amount with up to 2 decimal places.";
        }

        if (Number(value) > 10000) {
            return "The delivery fee cannot exceed ৳10,000.";
        }

        return "";
    }

    feeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        clearError();
        feeMessage.textContent = "";

        if (userRole !== "admin") {
            feeMessage.textContent = "Only administrators can update the fee.";
            return;
        }

        const enteredValue = newFeeInput.value.trim();
        const error = validateFee(enteredValue);

        if (error !== "") {
            showError(error);
            return;
        }

        const newFee = Number(enteredValue);

        if (newFee === currentFee) {
            showError("This is already the current delivery fee.");
            return;
        }

        currentFee = newFee;
        showCurrentFee();
        newFeeInput.value = "";
        feeMessage.textContent = "Delivery fee updated successfully for this preview.";
    });

    newFeeInput.addEventListener("input", function () {
        clearError();
        feeMessage.textContent = "";
    });

    if (userRole !== "admin") {
        newFeeInput.disabled = true;
        updateFeeButton.disabled = true;
        accessMessage.hidden = false;
    }

    showCurrentFee();
});
