// ========================================
// BACKEND API
// ========================================

const API_BASE_URL = "http://127.0.0.1:8080";


// ========================================
// GET ORDER ID
// ========================================

const urlParams = new URLSearchParams(
    window.location.search
);

const orderId = urlParams.get("id");


// ========================================
// LOAD ORDER
// ========================================

async function loadOrder() {

    if (!orderId) {
        showOrderNotFound();
        return;
    }

    try {

        // --------------------------------
        // Load current logged-in user
        // --------------------------------

        const userResponse = await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!userResponse.ok) {
            throw new Error("User is not logged in");
        }

        const currentUser =
            await userResponse.json();


        // --------------------------------
        // Load order
        // --------------------------------

        const orderResponse = await fetch(
            `${API_BASE_URL}/api/orders/${encodeURIComponent(orderId)}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!orderResponse.ok) {
            throw new Error(
                `Failed to load order: ${orderResponse.status}`
            );
        }

        const order =
            await orderResponse.json();


        // --------------------------------
        // Security check
        // Make sure this order belongs
        // to the logged-in customer
        // --------------------------------

        if (
            Number(order.user_id) !==
            Number(currentUser.id)
        ) {
            showOrderNotFound();
            return;
        }


        // --------------------------------
        // Load order items
        // --------------------------------

        const itemsResponse = await fetch(
            `${API_BASE_URL}/api/order-items`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!itemsResponse.ok) {
            throw new Error(
                `Failed to load order items: ${itemsResponse.status}`
            );
        }

        const allItems =
            await itemsResponse.json();


        const orderItems =
            allItems.filter(item =>
                Number(item.order_id) ===
                Number(order.order_id)
            );


        // --------------------------------
        // Load address
        // --------------------------------

        const addressResponse = await fetch(
            `${API_BASE_URL}/api/addresses/${order.address_id}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        let address = null;

        if (addressResponse.ok) {
            address =
                await addressResponse.json();
        }


        // --------------------------------
        // Display everything
        // --------------------------------

        displayOrder(
            order,
            orderItems,
            address
        );

    } catch (error) {

        console.error(
            "Order details loading error:",
            error
        );

        showOrderError(error.message);
    }
}


// ========================================
// DISPLAY ORDER
// ========================================

function displayOrder(
    order,
    items,
    address
) {

    const orderIdElement =
        document.querySelector("#order-id");

    const orderDateElement =
        document.querySelector("#order-date");

    const orderStatusElement =
        document.querySelector("#order-status");

    const orderAddressElement =
        document.querySelector("#order-address");


    if (orderIdElement) {
        orderIdElement.textContent =
            order.order_id;
    }


    if (orderDateElement) {
        orderDateElement.textContent =
            formatDate(order.order_date);
    }


    if (orderStatusElement) {

        orderStatusElement.textContent =
            formatStatus(order.order_status);

        orderStatusElement.className =
            `order-status ${getStatusClass(
                order.order_status
            )}`;
    }


    if (orderAddressElement) {

        orderAddressElement.textContent =
            formatAddress(address);
    }


    displayItems(items);

    displayTotals(order);
}


// ========================================
// DISPLAY ITEMS
// ========================================

function displayItems(items) {

    const orderItemsContainer =
        document.querySelector("#order-items");

    if (!orderItemsContainer) {
        return;
    }


    orderItemsContainer.innerHTML = "";


    if (!items || items.length === 0) {

        orderItemsContainer.innerHTML = `
            <div class="empty-checkout">

                <i class="fa-solid fa-box-open"></i>

                <h3>No Items Found</h3>

                <p>
                    No items were found for this order.
                </p>

            </div>
        `;

        return;
    }


    items.forEach(item => {

        const price =
            Number(item.price || 0);

        const quantity =
            Number(item.quantity || 0);

        const itemTotal =
            Number(item.subtotal || price * quantity);


        const itemElement =
            document.createElement("div");

        itemElement.classList.add(
            "order-item"
        );


        itemElement.innerHTML = `

            <div class="order-item-image">

                <div class="order-item-placeholder">
                    <i class="fa-solid fa-utensils"></i>
                </div>

            </div>


            <div class="order-item-info">

                <h4>
                    ${escapeHtml(
                        item.food_name || "Food Item"
                    )}
                </h4>

                <p>
                    Quantity: ${quantity}
                </p>

                <p>
                    Price: Rs.${price.toFixed(2)}
                </p>

            </div>


            <div class="order-item-price">

                Rs.${itemTotal.toFixed(2)}

            </div>

        `;


        orderItemsContainer.appendChild(
            itemElement
        );

    });
}


// ========================================
// DISPLAY TOTALS
// ========================================

function displayTotals(order) {

    const subtotal =
        Number(order.subtotal || 0);

    const deliveryFee =
        Number(order.delivery_fee || 0);

    const total =
        Number(order.total_amount || 0);


    const subtotalElement =
        document.querySelector("#subtotal");

    const deliveryFeeElement =
        document.querySelector("#delivery-fee");

    const totalElement =
        document.querySelector("#order-total");


    if (subtotalElement) {

        subtotalElement.textContent =
            `Rs.${subtotal.toFixed(2)}`;
    }


    if (deliveryFeeElement) {

        deliveryFeeElement.textContent =
            `Rs.${deliveryFee.toFixed(2)}`;
    }


    if (totalElement) {

        totalElement.textContent =
            `Rs.${total.toFixed(2)}`;
    }
}


// ========================================
// FORMAT ADDRESS
// ========================================

function formatAddress(address) {

    if (!address) {
        return "Not available";
    }


    const parts = [];


    if (address.addressLine) {
        parts.push(address.addressLine);
    }


    if (address.city) {
        parts.push(address.city);
    }


    if (address.phone) {
        parts.push(`Phone: ${address.phone}`);
    }


    return parts.length > 0
        ? parts.join(", ")
        : "Not available";
}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "Not available";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


// ========================================
// FORMAT STATUS
// ========================================

function formatStatus(status) {

    if (!status) {
        return "Unknown";
    }


    return String(status)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


// ========================================
// STATUS CLASS
// ========================================

function getStatusClass(status) {

    const formattedStatus =
        String(status || "")
            .toLowerCase();


    const statusClasses = {

        delivered:
            "status-delivered",

        preparing:
            "status-preparing",

        cancelled:
            "status-cancelled",

        confirmed:
            "status-preparing",

        ready:
            "status-preparing",

        out_for_delivery:
            "status-preparing",

        placed:
            "status-preparing"
    };


    return statusClasses[
        formattedStatus
    ] || "";
}


// ========================================
// HTML ESCAPE
// ========================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// ORDER NOT FOUND
// ========================================

function showOrderNotFound() {

    const orderIdElement =
        document.querySelector("#order-id");

    const statusElement =
        document.querySelector("#order-status");

    const itemsElement =
        document.querySelector("#order-items");


    if (orderIdElement) {
        orderIdElement.textContent =
            "Not Found";
    }


    if (statusElement) {
        statusElement.textContent =
            "Order Not Found";
    }


    if (itemsElement) {

        itemsElement.innerHTML = `

            <div class="empty-checkout">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h3>Order Not Found</h3>

                <p>
                    We could not find this order.
                </p>

            </div>

        `;
    }
}


// ========================================
// ORDER ERROR
// ========================================

function showOrderError(message) {

    const itemsElement =
        document.querySelector("#order-items");


    if (!itemsElement) {
        return;
    }


    itemsElement.innerHTML = `

        <div class="empty-checkout">

            <i class="fa-solid fa-circle-exclamation"></i>

            <h3>Could Not Load Order</h3>

            <p>
                ${escapeHtml(message)}
            </p>

        </div>

    `;
}


// ========================================
// START
// ========================================

loadOrder();