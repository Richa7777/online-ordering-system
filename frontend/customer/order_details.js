// ========================================
// GET ORDER ID
// ========================================

const urlParams = new URLSearchParams(
    window.location.search
);

const orderId = urlParams.get("id");


// ========================================
// DUMMY ORDERS FOR FRONTEND TESTING
// ========================================

const dummyOrders = {
    QB1001: {
        id: "QB1001",
        date: "7 September 2026",
        status: "Delivered",
        customerName: "Susmita Tamang",
        phone: "Not available",
        address: "Kathmandu, Nepal",
        city: "",
        paymentMethod: "Cash on Delivery",
        items: [
            {
                name: "Classic Burger",
                quantity: 2,
                price: 450,
                image: "../public/images/burger.png"
            }
        ]
    },

    QB1002: {
        id: "QB1002",
        date: "5 September 2026",
        status: "Preparing",
        customerName: "Susmita Tamang",
        phone: "Not available",
        address: "Kathmandu, Nepal",
        city: "",
        paymentMethod: "Cash on Delivery",
        items: [
            {
                name: "Cheese Pizza",
                quantity: 1,
                price: 750,
                image: "../public/images/pizza.png"
            }
        ]
    },

    QB1003: {
        id: "QB1003",
        date: "1 September 2026",
        status: "Cancelled",
        customerName: "Susmita Tamang",
        phone: "Not available",
        address: "Kathmandu, Nepal",
        city: "",
        paymentMethod: "Cash on Delivery",
        items: [
            {
                name: "Fried Chicken",
                quantity: 1,
                price: 500,
                image: "../public/images/fried-chicken.png"
            }
        ]
    }
};


// ========================================
// FIND ORDER
// ========================================

const savedOrders = quickBites.getOrders();

const order =
    savedOrders.find(item => item.id === orderId) ||
    dummyOrders[orderId];


// ========================================
// DISPLAY ORDER
// ========================================

if (order) {
    displayOrder(order);
} else {
    showOrderNotFound();
}


// ========================================
// DISPLAY ORDER
// ========================================

function displayOrder(order) {
    document.querySelector("#order-id").textContent = order.id;
    document.querySelector("#order-date").textContent = order.date;
    document.querySelector("#order-status").textContent =
        order.status || "Unknown";

    document.querySelector("#order-address").textContent =
        quickBites.getAddress(order);

    displayItems(order.items || []);
    displayTotals(order.items || []);

    const paymentElement =
        document.querySelector("#payment-method");

    if (paymentElement) {
        paymentElement.textContent =
            order.paymentMethod || "Not available";
    }
}


// ========================================
// DISPLAY ITEMS
// ========================================

function displayItems(items) {
    const orderItems =
        document.querySelector("#order-items");

    orderItems.innerHTML = "";

    items.forEach(item => {
        const price = quickBites.parsePrice(item.price);
        const itemTotal = price * Number(item.quantity || 0);

        const itemElement = document.createElement("div");
        itemElement.classList.add("order-item");

        itemElement.innerHTML = `
            <div class="order-item-image">
                <img
                    src="${quickBites.getImagePath(item.image)}"
                    alt="${item.name}">
            </div>

            <div class="order-item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: Rs.${price.toFixed(2)}</p>
            </div>

            <div class="order-item-price">
                Rs.${itemTotal.toFixed(2)}
            </div>
        `;

        orderItems.appendChild(itemElement);
    });
}


// ========================================
// DISPLAY TOTALS
// ========================================

function displayTotals(items) {
    const subtotal = items.reduce(
        (total, item) =>
            total +
            quickBites.parsePrice(item.price) *
            Number(item.quantity || 0),
        0
    );

    const deliveryFee = subtotal > 0 ? 50 : 0;
    const total = subtotal + deliveryFee;

    document.querySelector("#subtotal").textContent =
        `Rs.${subtotal.toFixed(2)}`;

    document.querySelector("#delivery-fee").textContent =
        `Rs.${deliveryFee.toFixed(2)}`;

    document.querySelector("#order-total").textContent =
        `Rs.${total.toFixed(2)}`;
}



// ========================================
// ORDER NOT FOUND
// ========================================

function showOrderNotFound() {
    document.querySelector("#order-id").textContent =
        "Not Found";

    document.querySelector("#order-status").textContent =
        "Order Not Found";

    document.querySelector("#order-items").innerHTML = `
        <div class="empty-checkout">
            <i class="fa-solid fa-circle-exclamation"></i>
            <h3>Order Not Found</h3>
            <p>We could not find this order.</p>
        </div>
    `;
}
