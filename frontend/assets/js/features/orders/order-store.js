/*
 * Shared order helpers used by Checkout (CUST-06), the sandbox payment return
 * page and Order Confirmation (CUST-08).
 *
 * Added during integration so the separately built pages form one journey:
 * Active Cart -> Checkout -> (COD | sandbox payment) -> Order Confirmation -> Tracking.
 *
 * The order object uses the same shape as QB-DEV-026 (Order History /
 * Current Order Tracking), so those pages show newly placed orders.
 * Until the PHP backend exists, data lives in localStorage.
 */
var QB_DELIVERY_FEE = 60;

function qbGetCart() {
  return JSON.parse(localStorage.getItem("quickbite_cart")) || { restaurant: "", items: [] };
}

function qbGetOrders() {
  return JSON.parse(localStorage.getItem("quickbite_orders")) || [];
}

function qbFindOrder(orderId) {
  var orders = qbGetOrders();
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id === orderId) {
      return orders[i];
    }
  }
  return null;
}

function qbCartSubtotal(cart) {
  var subtotal = 0;
  for (var i = 0; i < cart.items.length; i++) {
    subtotal += cart.items[i].price * cart.items[i].qty;
  }
  return subtotal;
}

/*
 * Creates one Accepted order from a cart snapshot (SRS FR-19, FR-23),
 * saves it and empties the cart. Returns the new order.
 */
function qbCreateOrder(cart, paymentLabel, address) {
  var totalItems = 0;
  for (var i = 0; i < cart.items.length; i++) {
    totalItems += cart.items[i].qty;
  }

  var newOrder = {
    id: "QB-" + Math.floor(1000 + Math.random() * 9000),
    restaurant: cart.restaurant,
    items: totalItems,
    payment: paymentLabel,
    total: qbCartSubtotal(cart) + QB_DELIVERY_FEE,
    address: address,
    status: "accepted"
  };

  var orders = qbGetOrders();
  orders.unshift(newOrder);
  localStorage.setItem("quickbite_orders", JSON.stringify(orders));
  localStorage.setItem("quickbite_cart", JSON.stringify({ restaurant: "", items: [] }));

  return newOrder;
}
