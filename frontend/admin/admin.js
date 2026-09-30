/* =========================================================
   QUICK BITES ADMIN DASHBOARD
   Backend connected
   ========================================================= */

const API_BASE_URL = "http://127.0.0.1:8080";

let orders = [];
let products = [];
let customers = [];
let orderItems = [];
let riders = [];


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setupMobileMenu();

    setupLogout();

    loadDashboard();

});


/* =========================================================
   LOAD DASHBOARD
   ========================================================= */

async function loadDashboard() {

    try {

        await Promise.all([
            loadProducts(),
            loadOrders(),
            loadCustomers(),
            loadOrderItems(),
            loadRiders()
        ]);


        console.log("Dashboard data loaded successfully.");

        console.log(
            "Products:",
            products.length
        );

        console.log(
            "Orders:",
            orders.length
        );

        console.log(
            "Customers:",
            customers.length
        );

        console.log(
            "Order items:",
            orderItems.length
        );

        console.log(
            "Riders:",
            riders.length
        );


        updateProductCount();

        updateOrderStatistics();

        updateCustomerCount();

        displayRecentOrders();


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

async function loadProducts() {

    const response = await fetch(
        `${API_BASE_URL}/api/food-items`,
        {
            method: "GET",
            credentials: "include"
        }
    );


    if (!response.ok) {

        throw new Error(
            `Failed to load products: ${response.status}`
        );

    }


    products = await response.json();


    if (!Array.isArray(products)) {

        products = [];

        throw new Error(
            "Products response is not an array."
        );

    }

}


/* =========================================================
   LOAD ORDERS
   ========================================================= */

async function loadOrders() {

    const response = await fetch(
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


    orders = await response.json();


    if (!Array.isArray(orders)) {

        orders = [];

        throw new Error(
            "Orders response is not an array."
        );

    }

}


/* =========================================================
   LOAD CUSTOMERS
   ========================================================= */

async function loadCustomers() {

    const response = await fetch(
        `${API_BASE_URL}/api/users/customers`,
        {
            method: "GET",
            credentials: "include"
        }
    );


    if (!response.ok) {

        throw new Error(
            `Failed to load customers: ${response.status}`
        );

    }


    customers = await response.json();


    if (!Array.isArray(customers)) {

        customers = [];

        throw new Error(
            "Customers response is not an array."
        );

    }

}


/* =========================================================
   LOAD RIDERS
   ========================================================= */

async function loadRiders() {

    const response = await fetch(
        `${API_BASE_URL}/api/users/riders`,
        {
            method: "GET",
            credentials: "include"
        }
    );


    if (!response.ok) {

        throw new Error(
            `Failed to load riders: ${response.status}`
        );

    }


    riders = await response.json();


    if (!Array.isArray(riders)) {

        riders = [];

        throw new Error(
            "Riders response is not an array."
        );

    }


    console.log(
        "Dashboard riders:",
        riders
    );


    console.log(
        "Dashboard rider count:",
        riders.length
    );


    const element =
        document.getElementById("total-riders");


    if (element) {

        element.textContent =
            riders.length;

    }

}


/* =========================================================
   LOAD ORDER ITEMS
   ========================================================= */

async function loadOrderItems() {

    const response = await fetch(
        `${API_BASE_URL}/api/order-items`,
        {
            method: "GET",
            credentials: "include"
        }
    );


    if (!response.ok) {

        throw new Error(
            `Failed to load order items: ${response.status}`
        );

    }


    orderItems = await response.json();


    if (!Array.isArray(orderItems)) {

        orderItems = [];

        throw new Error(
            "Order items response is not an array."
        );

    }

}


/* =========================================================
   UPDATE PRODUCT COUNT
   ========================================================= */

function updateProductCount() {

    const element =
        document.getElementById(
            "total-products"
        );


    if (!element) {

        console.warn(
            "Element #total-products was not found."
        );

        return;

    }


    element.textContent =
        products.length;

}


/* =========================================================
   UPDATE CUSTOMER COUNT
   ========================================================= */

function updateCustomerCount() {

    const element =
        document.getElementById(
            "total-customers"
        );


    if (!element) {

        console.warn(
            "Element #total-customers was not found."
        );

        return;

    }


    element.textContent =
        customers.length;

}


/* =========================================================
   UPDATE ORDER STATISTICS
   ========================================================= */

function updateOrderStatistics() {

    const totalOrders =
        document.getElementById(
            "total-orders"
        );


    if (totalOrders) {

        totalOrders.textContent =
            orders.length;

    }


    let pending = 0;

    let preparing = 0;

    let delivery = 0;

    let completed = 0;


    orders.forEach(function (order) {

        const status =
            String(
                order.order_status || ""
            )
            .trim()
            .toLowerCase()
            .replace(/-/g, "_")
            .replace(/ /g, "_");


        if (
            status === "placed" ||
            status === "confirmed"
        ) {

            pending++;

        }


        else if (
            status === "preparing" ||
            status === "ready"
        ) {

            preparing++;

        }


        else if (
            status === "out_for_delivery"
        ) {

            delivery++;

        }


        else if (
            status === "delivered"
        ) {

            completed++;

        }

    });


    setText(
        "pending-orders",
        pending
    );


    setText(
        "preparing-orders",
        preparing
    );


    setText(
        "delivery-orders",
        delivery
    );


    setText(
        "completed-orders",
        completed
    );

}


/* =========================================================
   DISPLAY RECENT ORDERS
   ========================================================= */

function displayRecentOrders() {

    const tableBody =
        document.getElementById(
            "recent-orders"
        );


    const emptyMessage =
        document.getElementById(
            "no-orders"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = "";


    if (orders.length === 0) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }

        return;

    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    /*
     * Sort newest orders first.
     */

    const recentOrders =
        [...orders]
            .sort(function (a, b) {

                const dateA =
                    new Date(
                        a.order_date || 0
                    );


                const dateB =
                    new Date(
                        b.order_date || 0
                    );


                return dateB - dateA;

            })
            .slice(0, 5);


    recentOrders.forEach(function (order) {

        const row =
            document.createElement("tr");


        const orderId =
            order.order_id || "N/A";


        const customer =
            customers.find(function (customer) {

                return Number(customer.id) ===
                    Number(order.user_id);

            });


        const customerName =
            customer
                ? customer.name
                : `Customer #${order.user_id}`;


        const itemCount =
            getOrderItemCount(
                order.order_id
            );


        const total =
            Number(
                order.total_amount || 0
            );


        const status =
            order.order_status ||
            "PLACED";


        row.innerHTML = `

            <td>
                #${escapeHTML(orderId)}
            </td>

            <td>
                ${escapeHTML(customerName)}
            </td>

            <td>
                ${itemCount}
            </td>

            <td>
                Rs. ${total.toFixed(2)}
            </td>

            <td>
                ${createStatusBadge(status)}
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =========================================================
   GET ORDER ITEM COUNT
   ========================================================= */

function getOrderItemCount(orderId) {

    return orderItems
        .filter(function (item) {

            return Number(item.order_id) ===
                Number(orderId);

        })
        .reduce(function (total, item) {

            return total +
                Number(
                    item.quantity || 0
                );

        }, 0);

}


/* =========================================================
   CREATE STATUS BADGE
   ========================================================= */

function createStatusBadge(status) {

    const cleanStatus =
        String(status)
            .trim()
            .toLowerCase()
            .replace(/_/g, " ");


    let className =
        "pending";


    if (
        cleanStatus === "preparing" ||
        cleanStatus === "ready"
    ) {

        className = "preparing";

    }


    else if (
        cleanStatus === "out for delivery"
    ) {

        className = "delivery";

    }


    else if (
        cleanStatus === "delivered"
    ) {

        className = "completed";

    }


    return `

        <span class="order-badge ${className}">

            ${escapeHTML(
                formatStatus(status)
            )}

        </span>

    `;

}


/* =========================================================
   FORMAT STATUS
   ========================================================= */

function formatStatus(status) {

    return String(status)
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, function (letter) {

            return letter.toUpperCase();

        });

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const hamburger =
        document.querySelector(
            ".hamburger"
        );


    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );


    if (
        !hamburger ||
        !mobileMenu
    ) {

        return;

    }


    hamburger.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            mobileMenu.classList.toggle(
                "mobile-menu-active"
            );


            const icon =
                hamburger.querySelector("i");


            if (icon) {

                icon.classList.toggle(
                    "fa-bars"
                );

                icon.classList.toggle(
                    "fa-xmark"
                );

            }

        }
    );


    mobileMenu
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileMenu.classList.remove(
                        "mobile-menu-active"
                    );

                }
            );

        });

}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    const logoutLinks =
        document.querySelectorAll(
            ".admin-logout, .mobile-logout"
        );


    logoutLinks.forEach(
        function (logoutLink) {

            logoutLink.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();


                    const confirmLogout =
                        confirm(
                            "Are you sure you want to logout?"
                        );


                    if (confirmLogout) {

                        try {
                            await fetch(
                                "http://127.0.0.1:8080/api/auth/logout",
                                {
                                    method: "POST",
                                    credentials: "include"
                                }
                            );
                        } catch (error) {
                            console.error("Logout error:", error);
                        }

                        window.location.href =
                            "../public/index.html";

                    }

                }
            );

        }
    );

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}