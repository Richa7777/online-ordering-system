/* =========================================================
   QUICK BITES ADMIN DASHBOARD
   ========================================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       INITIALIZE PRODUCTS
       ===================================================== */

    initializeProducts();


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    setupMobileMenu();


    /* =====================================================
       LOAD DASHBOARD
       ===================================================== */

    loadDashboard();


    /* =====================================================
       LOGOUT
       ===================================================== */

    setupLogout();

});



/* =========================================================
   INITIALIZE PRODUCTS
   ========================================================= */

async function initializeProducts() {


    /*
        Check whether products have already been
        copied from products.json into localStorage.
    */

    const existingProducts =
        localStorage.getItem("quickBitesProducts");


    /*
        If products already exist, don't overwrite them.
    */

    if (existingProducts) {

        return;

    }


    try {


        const response =
            await fetch("../public/products.json");


        if (!response.ok) {

            throw new Error(
                "Could not load products.json"
            );

        }


        const products =
            await response.json();


        /*
            Save the existing products to localStorage.

            This allows the Admin Products page
            to modify them later.
        */

        localStorage.setItem(
            "quickBitesProducts",
            JSON.stringify(products)
        );


        /*
            Update product count.
        */

        updateProductCount();


    }
    catch (error) {


        console.error(
            "Error loading products:",
            error
        );

    }

}



/* =========================================================
   LOAD DASHBOARD
   ========================================================= */

function loadDashboard() {


    updateProductCount();


    updateOrderStatistics();


    updateCustomerCount();


    updateRiderCount();


    displayRecentOrders();

}



/* =========================================================
   UPDATE PRODUCT COUNT
   ========================================================= */

function updateProductCount() {


    const productsElement =
        document.getElementById(
            "total-products"
        );


    if (!productsElement) {

        return;

    }


    const products =
        getLocalStorageArray(
            "quickBitesProducts"
        );


    productsElement.textContent =
        products.length;

}



/* =========================================================
   UPDATE ORDER STATISTICS
   ========================================================= */

function updateOrderStatistics() {


    const orders =
        getLocalStorageArray(
            "quickBitesOrders"
        );


    /* ================= TOTAL ORDERS ================= */

    const totalOrders =
        document.getElementById(
            "total-orders"
        );


    if (totalOrders) {

        totalOrders.textContent =
            orders.length;

    }



    /* ================= STATUS COUNTS ================= */

    let pending = 0;

    let preparing = 0;

    let delivery = 0;

    let completed = 0;


    orders.forEach(function (order) {


        const status =
            String(
                order.status || "Pending"
            ).toLowerCase();


        if (
            status === "pending"
        ) {

            pending++;

        }


        else if (
            status === "preparing"
        ) {

            preparing++;

        }


        else if (
            status === "out for delivery" ||
            status === "out_for_delivery" ||
            status === "delivery"
        ) {

            delivery++;

        }


        else if (
            status === "completed" ||
            status === "delivered"
        ) {

            completed++;

        }

    });



    /* ================= DISPLAY COUNTS ================= */

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
   UPDATE CUSTOMER COUNT
   ========================================================= */

function updateCustomerCount() {


    const customerElement =
        document.getElementById(
            "total-customers"
        );


    if (!customerElement) {

        return;

    }


    /*
        Customer data will be connected
        when the Admin Customers page
        is created.
    */

    const customers =
        getLocalStorageArray(
            "quickBitesCustomers"
        );


    customerElement.textContent =
        customers.length;

}



/* =========================================================
   UPDATE RIDER COUNT
   ========================================================= */

function updateRiderCount() {


    const riderElement =
        document.getElementById(
            "total-riders"
        );


    if (!riderElement) {

        return;

    }


    /*
        Rider data will be connected
        when the Admin Riders page
        is created.
    */

    const riders =
        getLocalStorageArray(
            "quickBitesRiders"
        );


    riderElement.textContent =
        riders.length;

}



/* =========================================================
   DISPLAY RECENT ORDERS
   ========================================================= */

function displayRecentOrders() {


    const orders =
        getLocalStorageArray(
            "quickBitesOrders"
        );


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


    /*
        Clear the table.
    */

    tableBody.innerHTML = "";



    /* =====================================================
       NO ORDERS
       ===================================================== */

    if (orders.length === 0) {


        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }


        return;

    }



    /* =====================================================
       ORDERS EXIST
       ===================================================== */

    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }



    /*
        Reverse the orders so the newest
        orders appear first.

        Only display the latest 5.
    */

    const recentOrders =
        [...orders]
            .reverse()
            .slice(0, 5);



    recentOrders.forEach(
        function (order) {


            const row =
                document.createElement("tr");


            /* ================= ORDER ID ================= */

            const orderId =
                order.id ||
                order.orderId ||
                "N/A";


            /* ================= CUSTOMER ================= */

            const customerName =
                order.customerName ||
                order.name ||
                "Customer";


            /* ================= ITEMS ================= */

            const itemCount =
                getOrderItemCount(order);


            /* ================= TOTAL ================= */

            const total =
                order.total ||
                order.grandTotal ||
                order.amount ||
                "Rs.0";


            /* ================= STATUS ================= */

            const status =
                order.status ||
                "Pending";



            /* ================= CREATE ROW ================= */

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
                    ${escapeHTML(String(total))}
                </td>

                <td>
                    ${createStatusBadge(status)}
                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}



/* =========================================================
   GET ORDER ITEM COUNT
   ========================================================= */

function getOrderItemCount(order) {


    /*
        Check order.items first.
    */

    if (
        Array.isArray(order.items)
    ) {


        return order.items.reduce(
            function (total, item) {


                return total +
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );

    }



    /*
        Some orders may use order.cart.
    */

    if (
        Array.isArray(order.cart)
    ) {


        return order.cart.reduce(
            function (total, item) {


                return total +
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );

    }


    return 0;

}



/* =========================================================
   CREATE ORDER STATUS BADGE
   ========================================================= */

function createStatusBadge(status) {


    const cleanStatus =
        String(status)
            .toLowerCase();


    let className =
        "pending";


    if (
        cleanStatus === "preparing"
    ) {

        className = "preparing";

    }


    else if (
        cleanStatus === "out for delivery" ||
        cleanStatus === "out_for_delivery" ||
        cleanStatus === "delivery"
    ) {

        className = "delivery";

    }


    else if (
        cleanStatus === "completed" ||
        cleanStatus === "delivered"
    ) {

        className = "completed";

    }


    return `

        <span class="order-badge ${className}">

            ${escapeHTML(status)}

        </span>

    `;

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



    /* =====================================================
       OPEN / CLOSE MENU
       ===================================================== */

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



    /* =====================================================
       CLOSE AFTER CLICKING LINK
       ===================================================== */

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
                function (event) {


                    event.preventDefault();


                    const confirmLogout =
                        confirm(
                            "Are you sure you want to logout?"
                        );


                    if (confirmLogout) {


                        /*
                            Authentication will be
                            added later with the backend.

                            For now, return to the
                            public homepage.
                        */

                        window.location.href =
                            "../public/index.html";

                    }

                }
            );

        }
    );

}



/* =========================================================
   LOCAL STORAGE ARRAY
   ========================================================= */

function getLocalStorageArray(key) {


    try {


        const value =
            localStorage.getItem(key);


        if (!value) {

            return [];

        }


        const parsed =
            JSON.parse(value);


        return Array.isArray(parsed)
            ? parsed
            : [];

    }


    catch (error) {


        console.error(
            `Error reading ${key}:`,
            error
        );


        return [];

    }

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
   HTML ESCAPE
   ========================================================= */

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