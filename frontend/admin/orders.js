// ==================================================
// QUICK BITES - ADMIN ORDERS
// ==================================================

const API_BASE_URL = "http://127.0.0.1:8080";

let orders = [];
let orderItems = [];
let riders = [];


// ==================================================
// ELEMENTS
// ==================================================

const ordersList =
    document.querySelector("#orders-list");

const searchInput =
    document.querySelector("#order-search");

const statusFilter =
    document.querySelector("#status-filter");

const orderCount =
    document.querySelector("#order-count");

const orderModal =
    document.querySelector("#order-modal");

const orderDetailsContent =
    document.querySelector("#order-details-content");

const modalOrderId =
    document.querySelector("#modal-order-id");

const closeModal =
    document.querySelector("#close-modal");

const closeModalBtn =
    document.querySelector("#close-modal-btn");


// ==================================================
// LOAD ORDERS
// ==================================================

async function loadOrders() {

    try {

        // ------------------------------------------
        // Check logged-in user
        // ------------------------------------------

        const userResponse =
            await fetch(
                `${API_BASE_URL}/api/auth/me`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        console.log(
            "Admin auth status:",
            userResponse.status
        );


        if (!userResponse.ok) {

            throw new Error(
                `Authentication check failed: ${userResponse.status}`
            );

        }


        const currentUser =
            await userResponse.json();


        console.log(
            "Current logged-in user:",
            currentUser
        );


        // ------------------------------------------
        // Load orders
        // ------------------------------------------

        const ordersResponse =
            await fetch(
                `${API_BASE_URL}/api/orders`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        console.log(
            "Orders response status:",
            ordersResponse.status
        );


        if (!ordersResponse.ok) {

            throw new Error(
                `Failed to load orders: ${ordersResponse.status}`
            );

        }


        orders =
            await ordersResponse.json();


        console.log(
            "Orders loaded:",
            orders
        );


        // ------------------------------------------
        // Load order items
        // ------------------------------------------

        const itemsResponse =
            await fetch(
                `${API_BASE_URL}/api/order-items`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        console.log(
            "Order items response status:",
            itemsResponse.status
        );


        if (!itemsResponse.ok) {

            throw new Error(
                `Failed to load order items: ${itemsResponse.status}`
            );

        }


        orderItems =
            await itemsResponse.json();


        console.log(
            "Order items loaded:",
            orderItems
        );


        // ------------------------------------------
        // Load riders
        // ------------------------------------------

        await loadRiders();


        // ------------------------------------------
        // Display orders
        // ------------------------------------------

        displayOrders();


    } catch (error) {

        console.error(
            "Could not load orders:",
            error
        );


        if (ordersList) {

            ordersList.innerHTML = `

                <div class="empty-orders">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <h3>
                        Could Not Load Orders
                    </h3>

                    <p>
                        ${escapeHTML(error.message)}
                    </p>

                </div>

            `;

        }

    }

}


// ==================================================
// LOAD RIDERS
// ==================================================

async function loadRiders() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users/riders`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        console.log(
            "Riders response status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Failed to load riders: ${response.status}`
            );

        }


        riders =
            await response.json();


        console.log(
            "Riders loaded for order assignment:",
            riders
        );


    } catch (error) {

        console.error(
            "Could not load riders:",
            error
        );


        riders = [];

    }

}


// ==================================================
// GET FILTERED ORDERS
// ==================================================

function getFilteredOrders() {

    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "All";


    return [...orders]

        .sort((a, b) => {

            return new Date(b.order_date) -
                   new Date(a.order_date);

        })

        .filter(order => {

            const orderId =
                String(order.order_id || "")
                    .toLowerCase();


            const userId =
                String(order.user_id || "")
                    .toLowerCase();


            const status =
                String(order.order_status || "")
                    .trim()
                    .toLowerCase();


            const matchesSearch =
                searchTerm === "" ||
                orderId.includes(searchTerm) ||
                userId.includes(searchTerm);


            const normalizedSelectedStatus =
                String(selectedStatus)
                    .trim()
                    .toLowerCase()
                    .replace(/-/g, "_")
                    .replace(/ /g, "_");


            const matchesStatus =
                normalizedSelectedStatus === "all" ||
                status === normalizedSelectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

}


// ==================================================
// DISPLAY ORDERS
// ==================================================

function displayOrders() {

    if (!ordersList) {

        return;

    }


    ordersList.innerHTML = "";


    const filteredOrders =
        getFilteredOrders();


    if (orderCount) {

        orderCount.textContent =
            `${filteredOrders.length} ${
                filteredOrders.length === 1
                    ? "order"
                    : "orders"
            }`;

    }


    if (filteredOrders.length === 0) {

        ordersList.innerHTML = `

            <div class="empty-orders">

                <i class="fa-solid fa-receipt"></i>

                <h3>
                    No Orders Found
                </h3>

                <p>
                    There are no orders matching your search.
                </p>

            </div>

        `;

        return;

    }


    filteredOrders.forEach(order => {

        const items =
            getOrderItems(order.order_id);


        const total =
            Number(order.total_amount || 0);


        const status =
            formatStatus(order.order_status);


        const card =
            document.createElement("article");


        card.className =
            "admin-order-card";


        card.innerHTML = `

            <div class="order-card-top">

                <div class="order-main-info">

                    <span class="order-id">

                        #${escapeHTML(
                            order.order_id
                        )}

                    </span>


                    <span class="order-customer">

                        Customer #${escapeHTML(
                            order.user_id
                        )}

                    </span>


                    <span class="order-date">

                        <i class="fa-regular fa-calendar"></i>

                        ${escapeHTML(
                            formatDate(
                                order.order_date
                            )
                        )}

                    </span>

                </div>


                <span
                    class="order-status ${getStatusClass(
                        order.order_status
                    )}"
                >

                    ${escapeHTML(status)}

                </span>

            </div>


            <div class="order-card-content">

                <div class="order-items">

                    <div class="order-items-title">

                        Ordered Items

                    </div>


                    <div class="order-items-list">

                        ${escapeHTML(
                            getItemNames(items)
                        )}

                    </div>

                </div>


                <div class="order-total-area">

                    <span class="order-total-label">

                        Total

                    </span>


                    <span class="order-total">

                        Rs.${total.toFixed(2)}

                    </span>

                </div>

            </div>


            <div class="order-card-bottom">

                <select
                    class="order-status-select"
                    data-id="${escapeHTML(
                        order.order_id
                    )}"
                >

                    <option value="PLACED"
                        ${order.order_status === "PLACED"
                            ? "selected"
                            : ""}>
                        Placed
                    </option>

                    <option value="CONFIRMED"
                        ${order.order_status === "CONFIRMED"
                            ? "selected"
                            : ""}>
                        Confirmed
                    </option>

                    <option value="PREPARING"
                        ${order.order_status === "PREPARING"
                            ? "selected"
                            : ""}>
                        Preparing
                    </option>

                    <option value="READY"
                        ${order.order_status === "READY"
                            ? "selected"
                            : ""}>
                        Ready
                    </option>

                    <option value="OUT_FOR_DELIVERY"
                        ${order.order_status === "OUT_FOR_DELIVERY"
                            ? "selected"
                            : ""}>
                        Out for Delivery
                    </option>

                    <option value="DELIVERED"
                        ${order.order_status === "DELIVERED"
                            ? "selected"
                            : ""}>
                        Delivered
                    </option>

                    <option value="CANCELLED"
                        ${order.order_status === "CANCELLED"
                            ? "selected"
                            : ""}>
                        Cancelled
                    </option>

                </select>


                ${createRiderAssignmentHTML(order)}

            </div>

        `;


        ordersList.appendChild(card);

    });


    attachOrderEvents();

}


// ==================================================
// CREATE RIDER ASSIGNMENT HTML
// ==================================================

function createRiderAssignmentHTML(order) {

    const orderStatus =
        String(order.order_status || "")
            .toUpperCase();


    // ------------------------------------------
    // Don't assign cancelled/delivered orders
    // ------------------------------------------

    if (
        orderStatus === "CANCELLED" ||
        orderStatus === "DELIVERED"
    ) {

        return `

            <div class="rider-assignment">

                <span class="assignment-disabled">

                    Rider assignment unavailable

                </span>

            </div>

        `;

    }


    // ------------------------------------------
    // No riders
    // ------------------------------------------

    if (riders.length === 0) {

        return `

            <div class="rider-assignment">

                <span class="assignment-disabled">

                    No riders available

                </span>

            </div>

        `;

    }


    // ------------------------------------------
    // Rider dropdown
    // ------------------------------------------

    let options = `

        <option value="">

            Select Rider

        </option>

    `;


    riders.forEach(rider => {

        options += `

            <option value="${escapeHTML(rider.id)}">

                ${escapeHTML(
                    rider.name || "Unnamed Rider"
                )}

                ${
                    rider.email
                        ? ` - ${escapeHTML(rider.email)}`
                        : ""
                }

            </option>

        `;

    });


    return `

        <div class="rider-assignment">

            <select
                class="rider-select"
                data-order-id="${escapeHTML(
                    order.order_id
                )}"
            >

                ${options}

            </select>


            <button
                type="button"
                class="assign-rider-btn"
                data-order-id="${escapeHTML(
                    order.order_id
                )}"
            >

                <i class="fa-solid fa-motorcycle"></i>

                Assign Rider

            </button>

        </div>

    `;

}


// ==================================================
// GET ORDER ITEMS
// ==================================================

function getOrderItems(orderId) {

    return orderItems.filter(item =>
        Number(item.order_id) ===
        Number(orderId)
    );

}


// ==================================================
// GET ITEM NAMES
// ==================================================

function getItemNames(items) {

    if (
        !items ||
        items.length === 0
    ) {

        return "No items available";

    }


    return items
        .map(item => {

            const quantity =
                Number(item.quantity || 0);


            return `${item.food_name} × ${quantity}`;

        })
        .join(" · ");

}


// ==================================================
// ATTACH EVENTS
// ==================================================

function attachOrderEvents() {

    // ------------------------------------------
    // Order status
    // ------------------------------------------

    document
        .querySelectorAll(".order-status-select")
        .forEach(select => {

            select.addEventListener(
                "change",
                function () {

                    updateOrderStatus(
                        this.dataset.id,
                        this.value
                    );

                }
            );

        });


    // ------------------------------------------
    // View order buttons
    // ------------------------------------------

    document
        .querySelectorAll(".view-order-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    showOrderDetails(
                        this.dataset.id
                    );

                }
            );

        });


    // ------------------------------------------
    // Assign rider
    // ------------------------------------------

    document
        .querySelectorAll(".assign-rider-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    assignRiderToOrder(
                        this.dataset.orderId,
                        this
                    );

                }
            );

        });

}


// ==================================================
// ASSIGN RIDER TO ORDER
// ==================================================

async function assignRiderToOrder(
    orderId,
    button
) {

    const riderSelect =
        document.querySelector(
            `.rider-select[data-order-id="${orderId}"]`
        );


    if (!riderSelect) {

        return;

    }


    const riderId =
        riderSelect.value;


    // ------------------------------------------
    // Validate
    // ------------------------------------------

    if (!riderId) {

        alert(
            "Please select a rider first."
        );

        return;

    }


    // ------------------------------------------
    // Find rider
    // ------------------------------------------

    const selectedRider =
        riders.find(
            rider =>
                String(rider.id) ===
                String(riderId)
        );


    if (!selectedRider) {

        alert(
            "Selected rider could not be found."
        );

        return;

    }


    // ------------------------------------------
    // Find order
    // ------------------------------------------

    const order =
        orders.find(
            item =>
                String(item.order_id) ===
                String(orderId)
        );


    if (!order) {

        alert(
            "Order could not be found."
        );

        return;

    }


    // ------------------------------------------
    // Disable button
    // ------------------------------------------

    button.disabled = true;

    button.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Assigning...

    `;


    try {

        // --------------------------------------
        // Create delivery
        // --------------------------------------

        const delivery = {

            order_id:
                Number(order.order_id),

            rider_id:
                Number(selectedRider.id),

            delivery_status:
                "ASSIGNED"

        };


        console.log(
            "Creating delivery:",
            delivery
        );


        const response =
            await fetch(
                `${API_BASE_URL}/api/deliveries`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(delivery)
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                `Failed to assign rider: ${response.status} ${errorText}`
            );

        }


        const savedDelivery =
            await response.json();


        console.log(
            "Delivery created:",
            savedDelivery
        );


        alert(
            `Rider ${selectedRider.name} assigned successfully.`
        );


        // --------------------------------------
        // Reload orders
        // --------------------------------------

        await loadOrders();


    } catch (error) {

        console.error(
            "Rider assignment error:",
            error
        );


        alert(
            `Could not assign rider.\n\n${error.message}`
        );


        button.disabled = false;


        button.innerHTML = `

            <i class="fa-solid fa-motorcycle"></i>

            Assign Rider

        `;

    }

}


// ==================================================
// UPDATE ORDER STATUS
// ==================================================

async function updateOrderStatus(
    orderId,
    newStatus
) {

    const order =
        orders.find(item =>
            String(item.order_id) ===
            String(orderId)
        );


    if (!order) {

        return;

    }


    try {

        const updatedOrder = {

            user_id:
                order.user_id,

            address_id:
                order.address_id,

            order_status:
                newStatus,

            subtotal:
                order.subtotal,

            delivery_fee:
                order.delivery_fee,

            total_amount:
                order.total_amount,

            order_date:
                order.order_date

        };


        const response =
            await fetch(
                `${API_BASE_URL}/api/orders/${orderId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(
                            updatedOrder
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to update order: ${response.status}`
            );

        }


        const savedOrder =
            await response.json();


        const index =
            orders.findIndex(item =>
                String(item.order_id) ===
                String(orderId)
            );


        if (index !== -1) {

            orders[index] =
                savedOrder;

        }


        displayOrders();


    } catch (error) {

        console.error(
            "Order status update error:",
            error
        );


        alert(
            "Could not update the order status."
        );


        displayOrders();

    }

}


// ==================================================
// SHOW ORDER DETAILS
// ==================================================

function showOrderDetails(orderId) {

    const order =
        orders.find(item =>
            String(item.order_id) ===
            String(orderId)
        );


    if (!order) {

        return;

    }


    const items =
        getOrderItems(order.order_id);


    if (modalOrderId) {

        modalOrderId.textContent =
            `#${order.order_id}`;

    }


    let itemsHTML = "";


    if (items.length > 0) {

        itemsHTML =
            items.map(item => {

                const price =
                    Number(item.price || 0);


                const quantity =
                    Number(item.quantity || 0);


                const itemTotal =
                    Number(
                        item.subtotal ||
                        price * quantity
                    );


                return `

                    <div class="modal-item">

                        <div class="modal-item-info">

                            <h4>
                                ${escapeHTML(
                                    item.food_name
                                )}
                            </h4>

                            <p>
                                Rs.${price.toFixed(2)}
                                ×
                                ${quantity}
                            </p>

                        </div>


                        <div class="modal-item-price">

                            Rs.${itemTotal.toFixed(2)}

                        </div>

                    </div>

                `;

            }).join("");

    } else {

        itemsHTML = `
            <p>No items available.</p>
        `;

    }


    if (orderDetailsContent) {

        orderDetailsContent.innerHTML = `

            <div class="detail-row">

                <strong>
                    Customer
                </strong>

                <span>
                    Customer #${escapeHTML(
                        order.user_id
                    )}
                </span>

            </div>


            <div class="detail-row">

                <strong>
                    Date
                </strong>

                <span>
                    ${escapeHTML(
                        formatDate(
                            order.order_date
                        )
                    )}
                </span>

            </div>


            <div class="detail-row">

                <strong>
                    Address ID
                </strong>

                <span>
                    ${escapeHTML(
                        order.address_id
                    )}
                </span>

            </div>


            <div class="detail-row">

                <strong>
                    Status
                </strong>

                <span>
                    ${escapeHTML(
                        formatStatus(
                            order.order_status
                        )
                    )}
                </span>

            </div>


            <div class="modal-items">

                <h3>
                    Ordered Items
                </h3>

                ${itemsHTML}

            </div>


            <div class="detail-row">

                <strong>
                    Subtotal
                </strong>

                <span>
                    Rs.${Number(
                        order.subtotal || 0
                    ).toFixed(2)}
                </span>

            </div>


            <div class="detail-row">

                <strong>
                    Delivery Fee
                </strong>

                <span>
                    Rs.${Number(
                        order.delivery_fee || 0
                    ).toFixed(2)}
                </span>

            </div>


            <div class="detail-row">

                <strong>
                    Total
                </strong>

                <span>
                    Rs.${Number(
                        order.total_amount || 0
                    ).toFixed(2)}
                </span>

            </div>

        `;

    }


    if (orderModal) {

        orderModal.classList.add(
            "modal-active"
        );

    }

}


// ==================================================
// CLOSE MODAL
// ==================================================

function closeOrderModal() {

    if (orderModal) {

        orderModal.classList.remove(
            "modal-active"
        );

    }

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeOrderModal
    );

}


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeOrderModal
    );

}


if (orderModal) {

    orderModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === orderModal
            ) {

                closeOrderModal();

            }

        }
    );

}


// ==================================================
// SEARCH / FILTER
// ==================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayOrders
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        displayOrders
    );

}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "Date unavailable";

    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {

        return "Date unavailable";

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


// ==================================================
// FORMAT STATUS
// ==================================================

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


// ==================================================
// STATUS CLASS
// ==================================================

function getStatusClass(status) {

    switch (
        String(status || "").toLowerCase()
    ) {

        case "preparing":
        case "confirmed":
        case "ready":
        case "placed":

            return "status-preparing";


        case "out_for_delivery":

            return "status-delivery";


        case "delivered":

            return "status-delivered";


        case "cancelled":

            return "status-cancelled";


        default:

            return "";

    }

}


// ==================================================
// ESCAPE HTML
// ==================================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==================================================
// START
// ==================================================

loadOrders();