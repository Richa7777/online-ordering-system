/* =========================================
   RIDER DASHBOARD
   Backend connected
========================================= */

const API_BASE_URL = "http://127.0.0.1:8080";

let deliveries = [];


/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    setupMobileMenu();
    setupLogout();
    loadDashboard();
    if (document.getElementById("today-deliveries")) {
        loadDashboard();
    }

});


/* =========================================
   LOAD DASHBOARD
========================================= */

async function loadDashboard() {

    try {

        /* -----------------------------------------
           GET CURRENT LOGGED-IN RIDER
        ----------------------------------------- */

        const currentRider =
            await loadCurrentRider();


        /* -----------------------------------------
           LOAD ALL DELIVERIES
        ----------------------------------------- */

        const response =
            await fetch(
                `${API_BASE_URL}/api/deliveries`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load deliveries: ${response.status}`
            );

        }


        const allDeliveries =
            await response.json();


        /* -----------------------------------------
           ONLY KEEP CURRENT RIDER'S DELIVERIES
        ----------------------------------------- */

        const riderDeliveries =
            allDeliveries.filter(
                delivery =>
                    Number(delivery.rider_id) ===
                    Number(currentRider.id)
            );


        /* -----------------------------------------
           LOAD RELATED ORDER DATA
        ----------------------------------------- */

        deliveries =
            await Promise.all(
                riderDeliveries.map(
                    delivery =>
                        convertDelivery(delivery)
                )
            );


        /* -----------------------------------------
           UPDATE DASHBOARD
        ----------------------------------------- */

        updateStatistics();

        displayRecentDeliveries();


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        displayEmptyDashboard();

    }

}


/* =========================================
   LOAD CURRENT RIDER
========================================= */

async function loadCurrentRider() {

    const response =
        await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


    if (!response.ok) {

        throw new Error(
            `Failed to load current rider: ${response.status}`
        );

    }


    return await response.json();

}


/* =========================================
   CONVERT DELIVERY
========================================= */

async function convertDelivery(delivery) {

    let order = null;

    let address = null;


    /* =========================================
       LOAD ORDER
    ========================================= */

    try {

        const orderResponse =
            await fetch(
                `${API_BASE_URL}/api/orders/${delivery.order_id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (orderResponse.ok) {

            order =
                await orderResponse.json();

        }

    } catch (error) {

        console.error(
            `Could not load order ${delivery.order_id}:`,
            error
        );

    }


    /* =========================================
       LOAD ADDRESS
    ========================================= */

    if (
        order &&
        order.address_id
    ) {

        try {

            const addressResponse =
                await fetch(
                    `${API_BASE_URL}/api/addresses/${order.address_id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (addressResponse.ok) {

                address =
                    await addressResponse.json();

            }

        } catch (error) {

            console.error(
                `Could not load address ${order.address_id}:`,
                error
            );

        }

    }


    /* =========================================
       RETURN FRONTEND DELIVERY OBJECT
    ========================================= */

    return {

        id:
            delivery.delivery_id,

        orderId:
            delivery.order_id,

        customer:
            order
                ? `Customer #${order.user_id}`
                : "Unknown Customer",

        address:
            address
                ? formatAddress(address)
                : "Address unavailable",

        status:
            delivery.delivery_status,


        /* -----------------------------------------
           FULL ORDER TOTAL

           Used by Recent Deliveries table.
        ----------------------------------------- */

        total:
            order
                ? Number(order.total_amount || 0)
                : 0,


        /* -----------------------------------------
           DELIVERY FEE

           Used for rider earnings.
        ----------------------------------------- */

        deliveryFee:
            order
                ? Number(order.delivery_fee || 0)
                : 0,


        assignedAt:
            delivery.assigned_at,

        deliveredAt:
            delivery.delivered_at

    };

}


/* =========================================
   FORMAT ADDRESS
========================================= */

function formatAddress(address) {

    return [

        address.addressLine,

        address.city

    ]
        .filter(
            value =>
                value &&
                String(value).trim() !== ""
        )
        .join(", ");

}


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const today =
        new Date();


    /* =========================================
       TODAY'S ASSIGNED DELIVERIES
    ========================================= */

    const todayDeliveries =
        deliveries.filter(
            delivery =>
                isSameDay(
                    delivery.assignedAt,
                    today
                )
        );


    /* =========================================
       PENDING DELIVERIES
    ========================================= */

    const pendingDeliveries =
        deliveries.filter(
            delivery =>
                delivery.status === "ASSIGNED"
        );


    /* =========================================
       COMPLETED DELIVERIES
    ========================================= */

    const completedDeliveries =
        deliveries.filter(
            delivery =>
                delivery.status === "DELIVERED"
        );


    /* =========================================
       TODAY'S EARNINGS
       
       Earnings are based on DELIVERY FEE,
       not the order total.

       For a delivered order:
       
       Order total = Rs.600
       Delivery fee = Rs.50

       Rider earnings = Rs.50
    ========================================= */

    const todayEarnings =
        deliveries
            .filter(
                delivery => {

                    if (
                        delivery.status !==
                        "DELIVERED"
                    ) {

                        return false;

                    }


                    /*
                     * Normally use deliveredAt.
                     *
                     * If deliveredAt is missing,
                     * use assignedAt as fallback.
                     */

                    const earningDate =
                        delivery.deliveredAt ||
                        delivery.assignedAt;


                    return isSameDay(
                        earningDate,
                        today
                    );

                }
            )
            .reduce(
                (
                    total,
                    delivery
                ) => {

                    return (
                        total +
                        Number(
                            delivery.deliveryFee || 0
                        )
                    );

                },
                0
            );


    /* =========================================
       GET DASHBOARD ELEMENTS
    ========================================= */

    const todayElement =
        document.getElementById(
            "today-deliveries"
        );


    const pendingElement =
        document.getElementById(
            "pending-deliveries"
        );


    const completedElement =
        document.getElementById(
            "completed-deliveries"
        );


    const earningsElement =
        document.getElementById(
            "today-earnings"
        );


    /* =========================================
       DISPLAY TODAY'S DELIVERIES
    ========================================= */

    if (todayElement) {

        todayElement.textContent =
            todayDeliveries.length;

    }


    /* =========================================
       DISPLAY PENDING DELIVERIES
    ========================================= */

    if (pendingElement) {

        pendingElement.textContent =
            pendingDeliveries.length;

    }


    /* =========================================
       DISPLAY COMPLETED DELIVERIES
    ========================================= */

    if (completedElement) {

        completedElement.textContent =
            completedDeliveries.length;

    }


    /* =========================================
       DISPLAY TODAY'S EARNINGS
    ========================================= */

    if (earningsElement) {

        earningsElement.textContent =
            `Rs.${todayEarnings.toFixed(2)}`;

    }

}


/* =========================================
   CHECK SAME DAY
========================================= */

function isSameDay(
    dateValue,
    date
) {

    if (!dateValue) {

        return false;

    }


    const dateObject =
        new Date(dateValue);


    if (
        Number.isNaN(
            dateObject.getTime()
        )
    ) {

        return false;

    }


    return (

        dateObject.getFullYear() ===
            date.getFullYear()

        &&

        dateObject.getMonth() ===
            date.getMonth()

        &&

        dateObject.getDate() ===
            date.getDate()

    );

}


/* =========================================
   DISPLAY RECENT DELIVERIES
========================================= */

function displayRecentDeliveries() {

    const tableBody =
        document.getElementById(
            "delivery-table-body"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = "";


    if (deliveries.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No deliveries found.
                </td>
            </tr>
        `;

        return;

    }


    /* -----------------------------------------
       SORT NEWEST ASSIGNMENTS FIRST
    ----------------------------------------- */

    const recentDeliveries =
        [...deliveries]
            .sort(
                (a, b) =>
                    new Date(
                        b.assignedAt || 0
                    ) -
                    new Date(
                        a.assignedAt || 0
                    )
            )
            .slice(0, 3);


    /* -----------------------------------------
       DISPLAY EACH DELIVERY
    ----------------------------------------- */

    recentDeliveries.forEach(
        delivery => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    #${delivery.orderId}
                </td>

                <td>
                    ${delivery.customer}
                </td>

                <td>
                    ${delivery.address}
                </td>

                <td>
                    <span class="status ${getStatusClass(delivery.status)}">
                        ${formatStatus(delivery.status)}
                    </span>
                </td>

                <td>
                    Rs.${Number(
                        delivery.total || 0
                    ).toFixed(2)}
                </td>

                <td>
                    <a
                        href="delivery_details.html?id=${delivery.id}"
                        class="view-btn"
                    >
                        <i class="fa-solid fa-eye"></i>
                    </a>
                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


/* =========================================
   FORMAT STATUS
========================================= */

function formatStatus(status) {

    switch (
        String(status).toUpperCase()
    ) {

        case "ASSIGNED":

            return "Pending";


        case "PICKED_UP":

            return "Picked Up";


        case "OUT_FOR_DELIVERY":

            return "Out for Delivery";


        case "DELIVERED":

            return "Delivered";


        default:

            return status || "Unknown";

    }

}


/* =========================================
   STATUS CSS CLASS
========================================= */

function getStatusClass(status) {

    switch (
        String(status).toUpperCase()
    ) {

        case "ASSIGNED":

            return "pending";


        case "PICKED_UP":

        case "OUT_FOR_DELIVERY":

            return "preparing";


        case "DELIVERED":

            return "delivered";


        default:

            return "";

    }

}


/* =========================================
   EMPTY DASHBOARD
========================================= */

function displayEmptyDashboard() {

    const tableBody =
        document.getElementById(
            "delivery-table-body"
        );


    if (tableBody) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    Unable to load deliveries.
                </td>
            </tr>
        `;

    }


    const today =
        document.getElementById(
            "today-deliveries"
        );


    const pending =
        document.getElementById(
            "pending-deliveries"
        );


    const completed =
        document.getElementById(
            "completed-deliveries"
        );


    const earnings =
        document.getElementById(
            "today-earnings"
        );


    if (today) {

        today.textContent = "0";

    }


    if (pending) {

        pending.textContent = "0";

    }


    if (completed) {

        completed.textContent = "0";

    }


    if (earnings) {

        earnings.textContent =
            "Rs.0.00";

    }

}


/* =========================================
   MOBILE MENU
========================================= */

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
                hamburger.querySelector(
                    "i"
                );


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
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileMenu.classList.remove(
                            "mobile-menu-active"
                        );

                    }
                );

            }
        );

}


/* =========================================
   LOGOUT
========================================= */

function setupLogout() {

    const logoutBtn =
        document.querySelector(
            "#logout-btn"
        );


    const mobileLogoutBtn =
        document.querySelector(
            "#mobile-logout-btn"
        );


    async function logout() {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {

            return;

        }


        /* -----------------------------------------
           INVALIDATE SPRING SECURITY SESSION
        ----------------------------------------- */

        try {

            await fetch(
                `${API_BASE_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (error) {
            console.error("Logout error:", error);
        }

        /* -----------------------------------------
           REDIRECT
        ----------------------------------------- */

        window.location.href =
            "../public/index.html";

    }


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                logout();

            }
        );

    }


    if (mobileLogoutBtn) {

        mobileLogoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                logout();

            }
        );

    }

}