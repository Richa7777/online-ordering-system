// ========================================
// ELEMENTS
// ========================================

const ordersList = document.querySelector("#orders-list");


// ========================================
// LOAD ORDERS
// ========================================

const orders = quickBites.getOrders();


// ========================================
// DISPLAY ORDERS
// ========================================

function displayOrders() {
    if (!ordersList) {
        return;
    }

    ordersList.innerHTML = "";

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders">
                <i class="fa-solid fa-receipt"></i>
                <h3>No Orders Yet</h3>
                <p>You have not placed any orders yet.</p>
                <a href="index.html" class="btn">
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    [...orders].reverse().forEach(order => {
        const subtotal = calculateSubtotal(order.items);
        const deliveryFee = subtotal > 0 ? 50 : 0;
        const total = subtotal + deliveryFee;

        const itemText = getItemText(order.items);
        const address = quickBites.getAddress(order);

        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");

        orderCard.innerHTML = `
            <div class="order-top">
                <div>
                    <h3>Order #${order.id}</h3>
                    <p>
                        <i class="fa-regular fa-calendar"></i>
                        ${order.date}
                    </p>
                </div>

                <span class="order-status ${getStatusClass(order.status)}">
                    ${order.status || "Unknown"}
                </span>
            </div>

            <div class="order-middle">
                <div>
                    <strong>Items</strong>
                    <p>${itemText}</p>
                </div>

                <div>
                    <strong>Total</strong>
                    <p>Rs.${total.toFixed(2)}</p>
                </div>
            </div>

            <div class="order-bottom">
                <div>
                    <strong>Delivery Address</strong>
                    <p>${address}</p>
                </div>

                <a
                    href="order_details.html?id=${encodeURIComponent(order.id)}"
                    class="view-details-btn">
                    <i class="fa-solid fa-eye"></i>
                    View Details
                </a>
            </div>
        `;

        ordersList.appendChild(orderCard);
    });
}


// ========================================
// CALCULATE SUBTOTAL
// ========================================

function calculateSubtotal(items = []) {
    return items.reduce((subtotal, item) => {
        const price = quickBites.parsePrice(item.price);
        return subtotal + price * Number(item.quantity || 0);
    }, 0);
}


// ========================================
// GET ITEM TEXT
// ========================================

function getItemText(items = []) {
    if (items.length === 0) {
        return "No items";
    }

    let text = items[0].name;

    if (items.length > 1) {
        text += ` + ${items.length - 1} more`;
    }

    return text;
}




// ========================================
// ORDER STATUS CLASS
// ========================================

function getStatusClass(status) {
    const formattedStatus =
        String(status || "").toLowerCase();

    const statusClasses = {
        delivered: "status-delivered",
        preparing: "status-preparing",
        cancelled: "status-cancelled"
    };

    return statusClasses[formattedStatus] || "";
}


// ========================================
// START
// ========================================

displayOrders();
