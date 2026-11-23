/*
 * Customer order cancellation rules (SRS FR-24, FR-25, BR-10, BR-11).
 *
 * Rules come from QB-DEV-027 (CUST-09-current-order-tracking.js). They were
 * moved here during integration so the merged Current Order Tracking page
 * (QB-DEV-026/034) uses them.
 *
 * - A customer may cancel only while the order is still Accepted.
 * - Cancelling before preparation restores inventory once.
 * - A pre-pickup rider assignment is released.
 * - Prepaid (online) orders are referred for refund review; COD needs no refund.
 */
function canCustomerCancel(order) {
  return order.status === "accepted";
}

/* Marks the order cancelled and returns the message to show the customer. */
function cancelCustomerOrder(order) {
  order.status = "cancelled";

  if (!order.inventoryRestored) {
    order.inventoryRestored = true;
  }

  if (order.riderAssigned) {
    order.riderAssigned = false;
  }

  if (order.payment === "COD") {
    return "Order cancelled successfully. No refund is required for COD.";
  }

  order.refundStatus = "Pending review";
  return "Order cancelled. Prepaid refund has been marked for review.";
}
