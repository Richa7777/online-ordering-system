/* =========================================
   RIDER DELIVERIES
========================================= */


/* =========================================
   DELIVERY DATA
========================================= */

const deliveries = [

    {
        id: "DL1001",
        order: "QB1001",
        customer: "John Smith",
        address: "Thamel, Kathmandu",
        date: "16 September 2026",
        status: "Pending"
    },

    {
        id: "DL1002",
        order: "QB1002",
        customer: "Priya Rai",
        address: "Baneshwor, Kathmandu",
        date: "16 September 2026",
        status: "In Delivery"
    },

    {
        id: "DL1003",
        order: "QB1003",
        customer: "Anita Sharma",
        address: "Lalitpur, Kathmandu",
        date: "15 September 2026",
        status: "Delivered"
    },

    {
        id: "DL1004",
        order: "QB1004",
        customer: "Ram Gurung",
        address: "Balaju, Kathmandu",
        date: "15 September 2026",
        status: "Delivered"
    }

];



/* =========================================
   ELEMENTS
========================================= */

const tableBody =
    document.getElementById("delivery-table-body");

const statusFilter =
    document.getElementById("status-filter");



/* =========================================
   DISPLAY DELIVERIES
========================================= */

function displayDeliveries(data) {

    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No deliveries found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(delivery => {

        let statusClass = "";

        if (delivery.status === "Pending") {

            statusClass = "status-pending";

        }

        else if (delivery.status === "In Delivery") {

            statusClass = "status-delivery";

        }

        else if (delivery.status === "Delivered") {

            statusClass = "status-delivered";

        }


        const isCompleted =
            delivery.status === "Delivered";


        tableBody.innerHTML += `

            <tr>

                <td>
                    <span class="delivery-id">
                        ${delivery.id}
                    </span>
                </td>


                <td>
                    ${delivery.order}
                </td>


                <td>
                    <span class="customer-name">
                        ${delivery.customer}
                    </span>
                </td>


                <td>
                    <span class="delivery-address">
                        ${delivery.address}
                    </span>
                </td>


                <td>
                    ${delivery.date}
                </td>


                <td>

                    <span class="delivery-status ${statusClass}">
                        ${delivery.status}
                    </span>

                </td>


                <td>

                    <button
                        class="delivery-action ${isCompleted ? "completed" : ""}"
                        data-id="${delivery.id}"
                        ${isCompleted ? "disabled" : ""}>

                        ${
                            isCompleted
                                ? "Completed"
                                : "Update Status"
                        }

                    </button>

                </td>

            </tr>

        `;

    });

}



/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {

    const total =
        deliveries.length;


    const pending =
        deliveries.filter(
            delivery => delivery.status === "Pending"
        ).length;


    const active =
        deliveries.filter(
            delivery => delivery.status === "In Delivery"
        ).length;


    const completed =
        deliveries.filter(
            delivery => delivery.status === "Delivered"
        ).length;


    document.getElementById(
        "total-deliveries"
    ).textContent = total;


    document.getElementById(
        "pending-deliveries"
    ).textContent = pending;


    document.getElementById(
        "active-deliveries"
    ).textContent = active;


    document.getElementById(
        "completed-deliveries"
    ).textContent = completed;

}



/* =========================================
   FILTER
========================================= */

statusFilter.addEventListener(
    "change",
    function () {

        const selectedStatus =
            this.value;


        if (selectedStatus === "all") {

            displayDeliveries(deliveries);

        }

        else {

            const filtered =
                deliveries.filter(
                    delivery =>
                        delivery.status === selectedStatus
                );


            displayDeliveries(filtered);

        }

    }
);



/* =========================================
   UPDATE DELIVERY STATUS
========================================= */

tableBody.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(".delivery-action");


        if (!button || button.disabled) {
            return;
        }


        const deliveryId =
            button.dataset.id;


        const delivery =
            deliveries.find(
                item => item.id === deliveryId
            );


        if (!delivery) {
            return;
        }


        if (delivery.status === "Pending") {

            delivery.status = "In Delivery";

        }

        else if (delivery.status === "In Delivery") {

            delivery.status = "Delivered";

        }


        updateSummary();


        const selectedStatus =
            statusFilter.value;


        if (selectedStatus === "all") {

            displayDeliveries(deliveries);

        }

        else {

            displayDeliveries(
                deliveries.filter(
                    item =>
                        item.status === selectedStatus
                )
            );

        }

    }
);



/* =========================================
   HAMBURGER MENU
========================================= */

const hamburger =
    document.querySelector(".hamburger");

const mobileMenu =
    document.querySelector(".mobile-menu");


if (hamburger && mobileMenu) {

    hamburger.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            mobileMenu.classList.toggle(
                "mobile-menu-active"
            );


            const icon =
                hamburger.querySelector("i");


            icon.classList.toggle("fa-bars");

            icon.classList.toggle("fa-xmark");

        }
    );


    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(link => {

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



/* =========================================
   LOGOUT
========================================= */

function logout() {

    window.location.href =
        "../public/index.html";

}


const logoutButton =
    document.getElementById("logout-btn");


const mobileLogoutButton =
    document.getElementById("mobile-logout-btn");


const footerLogout =
    document.getElementById("footer-logout");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}


if (mobileLogoutButton) {

    mobileLogoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}


if (footerLogout) {

    footerLogout.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}



/* =========================================
   INITIAL LOAD
========================================= */

displayDeliveries(deliveries);

updateSummary();