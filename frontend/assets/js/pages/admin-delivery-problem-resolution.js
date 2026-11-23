document.addEventListener("DOMContentLoaded", function () {
    const issue = {
        orderId: "QB-1019",
        orderStatus: "Picked Up",
        reportStatus: "Issue reported",
        riderId: "RIDER-205",
        paymentMethod: "Prepaid",
        paymentStatus: "Paid",
        issueType: "Customer unavailable",
        issueDetails: "The customer did not answer the phone and nobody was available at the delivery address.",
        inventoryRestored: false,
        outcome: "",
        resolutionReason: "",
        refundStatus: "Not required"
    };

    const currentRole = document.body.dataset.userRole;
    const form = document.getElementById("resolutionForm");
    const outcomeInput = document.getElementById("resolutionOutcome");
    const reasonInput = document.getElementById("resolutionReason");
    const outcomeError = document.getElementById("outcomeError");
    const reasonError = document.getElementById("reasonError");
    const feedback = document.getElementById("resolutionFeedback");
    const statusBadge = document.getElementById("reportStatus");
    const orderStatus = document.getElementById("orderStatus");
    const paymentStatus = document.getElementById("paymentStatus");
    const paymentNotice = document.getElementById("paymentNotice");
    const resolveButton = document.getElementById("resolveProblemButton");
    const completedPanel = document.getElementById("resolutionComplete");
    const resultText = document.getElementById("resolutionResultText");

    function isAdmin() {
        return currentRole === "admin";
    }

    function clearErrors() {
        outcomeError.textContent = "";
        reasonError.textContent = "";
        outcomeInput.classList.remove("invalid");
        reasonInput.classList.remove("invalid");
        outcomeInput.removeAttribute("aria-invalid");
        reasonInput.removeAttribute("aria-invalid");
        feedback.textContent = "";
    }

    function showOutcomeError(message) {
        outcomeError.textContent = message;
        outcomeInput.classList.add("invalid");
        outcomeInput.setAttribute("aria-invalid", "true");
        outcomeInput.focus();
    }

    function showReasonError(message) {
        reasonError.textContent = message;
        reasonInput.classList.add("invalid");
        reasonInput.setAttribute("aria-invalid", "true");
        reasonInput.focus();
    }

    function renderIssue() {
        statusBadge.textContent = issue.reportStatus;
        orderStatus.textContent = issue.orderStatus;
        paymentStatus.textContent = issue.paymentStatus;
        document.getElementById("reportedIssueType").textContent = issue.issueType;
        document.getElementById("reportedIssueDetails").textContent = issue.issueDetails;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();

        if (!isAdmin()) {
            feedback.textContent = "Only an administrator can resolve delivery problems.";
            return;
        }

        if (issue.reportStatus !== "Issue reported") {
            feedback.textContent = "This delivery problem has already been resolved.";
            return;
        }

        if (issue.orderStatus !== "Picked Up") {
            feedback.textContent = "This resolution screen is for post-pickup delivery problems.";
            return;
        }

        const outcome = outcomeInput.value;
        const reason = reasonInput.value.trim();

        if (!outcome) {
            showOutcomeError("Please select a final resolution outcome.");
            return;
        }

        if (!reason) {
            showReasonError("Please enter the resolution note.");
            return;
        }

        if (reason.length < 10) {
            showReasonError("Please enter at least 10 characters.");
            return;
        }

        if (reason.length > 500) {
            showReasonError("The resolution note cannot exceed 500 characters.");
            return;
        }

        const confirmed = window.confirm("Save this final delivery problem resolution?");
        if (!confirmed) {
            return;
        }

        issue.outcome = outcome;
        issue.resolutionReason = reason;
        issue.reportStatus = "Resolved";
        issue.orderStatus = outcome;

        let resultMessage = "Resolution saved for order #" + issue.orderId + ". ";

        if (outcome === "Failed Delivery") {
            issue.inventoryRestored = false;

            if (issue.paymentMethod === "COD") {
                issue.paymentStatus = "Unpaid";
                issue.refundStatus = "Not required for COD";
                resultMessage += "COD remains unpaid. Inventory was not restored.";
            } else {
                issue.refundStatus = "Pending QB-DEV-025 resolution";
                resultMessage += "Prepaid refund handling has been referred to QB-DEV-025. Inventory was not restored.";
            }
        } else {
            issue.paymentStatus = "Paid";
            resultMessage += "The order has been marked as delivered after review. Inventory was not restored by this resolution.";
        }

        statusBadge.textContent = issue.reportStatus;
        statusBadge.classList.add("resolved");
        orderStatus.textContent = issue.orderStatus;
        paymentStatus.textContent = issue.paymentStatus;

        form.hidden = true;
        paymentNotice.hidden = true;
        completedPanel.hidden = false;
        resultText.textContent = resultMessage + " Recorded resolution: " + issue.resolutionReason;
    });

    outcomeInput.addEventListener("change", clearErrors);
    reasonInput.addEventListener("input", clearErrors);

    if (!isAdmin()) {
        form.hidden = true;
        feedback.textContent = "Only administrators can resolve delivery problems.";
        feedback.hidden = false;
    }

    renderIssue();
});
