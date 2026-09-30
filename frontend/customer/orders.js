// ========================================
// BACKEND API
// ========================================

const API_BASE_URL = "http://127.0.0.1:8080";


// ========================================
// ELEMENTS
// ========================================

const ordersList =
    document.querySelector("#orders-list");


// ========================================
// LOAD CURRENT USER
// ========================================

async function loadCurrentUser() {

    const response = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("User is not logged in");
    }

    return await response.json();
}


// ========================================
// LOAD ORDERS
// ========================================

async function loadOrders() {

    if (!ordersList) {
        return;
    }

    try {

        // --------------------------------
        // Get logged-in user
        // --------------------------------

        const currentUser =
            await loadCurrentUser();


        // --------------------------------
        // Get all orders
        // --------------------------------

        const response =
            await fetch(
                `${API_BASE_URL}/api/orders`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {
            throw new Error(
                `Failed to load orders: ${response.status}`
            );
        }


        const allOrders =
            await response.json();


        // --------------------------------
        // Filter this customer's orders
        // --------------------------------

        const orders =
            allOrders.filter(order =>
                Number(order.user_id) ===
                Number(currentUser.id)
            );


        // --------------------------------
        // Sort newest first
        // --------------------------------

        orders.sort((a, b) => {

            return new Date(b.order_date) -
                   new Date(a.order_date);

        });


        // --------------------------------
        // Display
        // --------------------------------

        displayOrders(orders);


    } catch (error) {

        console.error(
            "Orders loading error:",
            error
        );


        ordersList.innerHTML = `
            <div class="no-orders">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h3>Could Not Load Orders</h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;
    }
}


// ========================================
// DISPLAY ORDERS
// ========================================

function displayOrders(orders) {

    ordersList.innerHTML = "";


    if (orders.length === 0) {

        ordersList.innerHTML = `
            <div class="no-orders">

                <i class="fa-solid fa-receipt"></i>

                <h3>No Orders Yet</h3>

                <p>
                    You have not placed any orders yet.
                </p>

                <a
                    href="index.html"
                    class="btn"
                >
                    Start Shopping
                </a>

            </div>
        `;

        return;
    }


    orders.forEach(order => {

        const subtotal =
            Number(order.subtotal || 0);

        const deliveryFee =
            Number(order.delivery_fee || 0);

        const total =
            Number(order.total_amount || 0);


        const orderCard =
            document.createElement("div");

        orderCard.classList.add(
            "order-card"
        );


        orderCard.innerHTML = `

            <div class="order-top">

                <div>

                    <h3>
                        Order #${order.order_id}
                    </h3>

                    <p>
                        <i class="fa-regular fa-calendar"></i>
                        ${formatDate(order.order_date)}
                    </p>

                </div>


                <span
                    class="order-status ${getStatusClass(order.order_status)}"
                >
                    ${order.order_status || "Unknown"}
                </span>

            </div>


            <div class="order-middle">

                <div>

                    <strong>
                        Subtotal
                    </strong>

                    <p>
                        Rs.${subtotal.toFixed(2)}
                    </p>

                </div>


                <div>

                    <strong>
                        Delivery Fee
                    </strong>

                    <p>
                        Rs.${deliveryFee.toFixed(2)}
                    </p>

                </div>


                <div>

                    <strong>
                        Total
                    </strong>

                    <p>
                        Rs.${total.toFixed(2)}
                    </p>

                </div>

            </div>


            <div class="order-bottom">

                <div>

                    <strong>
                        Order Status
                    </strong>

                    <p>
                        ${order.order_status || "Unknown"}
                    </p>

                </div>


                <a
                    href="order_details.html?id=${encodeURIComponent(order.order_id)}"
                    class="view-details-btn"
                >
                    <i class="fa-solid fa-eye"></i>
                    View Details
                </a>

            </div>

        `;


        ordersList.appendChild(
            orderCard
        );

    });
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
// START
// ========================================

loadOrders();