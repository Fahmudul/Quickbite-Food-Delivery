document.addEventListener("DOMContentLoaded", function () {
    const delivery = {
        orderId: "QB-1048",
        status: "Picked Up",
        assignedRiderId: "RIDER-204",
        issueReported: false,
        issueType: "",
        issueDetails: ""
    };

    const currentRiderId = "RIDER-204";
    const currentRole = document.body.dataset.userRole;
    const form = document.getElementById("deliveryProblemForm");
    const formArea = document.getElementById("reportFormArea");
    const submittedPanel = document.getElementById("reportSubmitted");
    const accessMessage = document.getElementById("riderAccessMessage");
    const typeInput = document.getElementById("problemType");
    const detailsInput = document.getElementById("problemDetails");
    const typeError = document.getElementById("problemTypeError");
    const detailsError = document.getElementById("problemDetailsError");
    const feedback = document.getElementById("riderFeedback");
    const submitButton = document.getElementById("submitProblemButton");

    function canReportProblem() {
        return currentRole === "rider"
            && delivery.assignedRiderId === currentRiderId
            && delivery.status === "Picked Up"
            && delivery.issueReported === false;
    }

    function clearErrors() {
        typeError.textContent = "";
        detailsError.textContent = "";
        typeInput.classList.remove("invalid");
        detailsInput.classList.remove("invalid");
        typeInput.removeAttribute("aria-invalid");
        detailsInput.removeAttribute("aria-invalid");
        feedback.textContent = "";
    }

    function showTypeError(message) {
        typeError.textContent = message;
        typeInput.classList.add("invalid");
        typeInput.setAttribute("aria-invalid", "true");
        typeInput.focus();
    }

    function showDetailsError(message) {
        detailsError.textContent = message;
        detailsInput.classList.add("invalid");
        detailsInput.setAttribute("aria-invalid", "true");
        detailsInput.focus();
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();

        if (currentRole !== "rider" || delivery.assignedRiderId !== currentRiderId) {
            accessMessage.textContent = "Only the rider assigned to this active delivery can report a problem.";
            accessMessage.hidden = false;
            return;
        }

        if (delivery.status !== "Picked Up") {
            accessMessage.textContent = "A delivery problem can only be reported for an active delivery after pickup.";
            accessMessage.hidden = false;
            return;
        }

        if (delivery.issueReported) {
            feedback.textContent = "A problem has already been reported for this delivery.";
            return;
        }

        const issueType = typeInput.value;
        const issueDetails = detailsInput.value.trim();

        if (!issueType) {
            showTypeError("Please select an issue category.");
            return;
        }

        if (!issueDetails) {
            showDetailsError("Please describe the delivery problem.");
            return;
        }

        if (issueDetails.length < 10) {
            showDetailsError("Please enter at least 10 characters.");
            return;
        }

        if (issueDetails.length > 500) {
            showDetailsError("The description cannot exceed 500 characters.");
            return;
        }

        const confirmed = window.confirm("Submit this delivery problem report?");
        if (!confirmed) {
            return;
        }

        delivery.issueType = issueType;
        delivery.issueDetails = issueDetails;
        delivery.issueReported = true;

        formArea.hidden = true;
        submittedPanel.hidden = false;
        accessMessage.hidden = true;
    });

    typeInput.addEventListener("change", clearErrors);
    detailsInput.addEventListener("input", clearErrors);

    if (!canReportProblem()) {
        formArea.hidden = true;
        accessMessage.hidden = false;
        accessMessage.textContent = "This delivery is not assigned to your rider account or is no longer eligible for a problem report.";
    }
});
