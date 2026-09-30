/* =========================================
   RIDER EARNINGS
   Backend connected
========================================= */

// const API_BASE_URL = "http://127.0.0.1:8080";

let earningsData = [];


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEarnings();

        const filter =
            document.getElementById(
                "earnings-filter"
            );

        if (filter) {

            filter.addEventListener(
                "change",
                filterEarnings
            );

        }

    }
);


/* =========================================
   LOAD EARNINGS
========================================= */

async function loadEarnings() {

    try {

        const currentRider =
            await loadCurrentRider();


        /* -----------------------------------------
           LOAD ALL DELIVERIES
        ----------------------------------------- */

        const deliveryResponse =
            await fetch(
                `${API_BASE_URL}/api/deliveries`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!deliveryResponse.ok) {

            throw new Error(
                `Failed to load deliveries: ${deliveryResponse.status}`
            );

        }


        const allDeliveries =
            await deliveryResponse.json();


        /* -----------------------------------------
           ONLY THIS RIDER'S COMPLETED DELIVERIES
        ----------------------------------------- */

        const completedDeliveries =
            allDeliveries.filter(
                delivery =>
                    Number(delivery.rider_id) ===
                        Number(currentRider.id) &&

                    String(
                        delivery.delivery_status
                    ).toUpperCase() ===
                        "DELIVERED"
            );


        /* -----------------------------------------
           LOAD ORDER INFORMATION
        ----------------------------------------- */

        earningsData =
            await Promise.all(
                completedDeliveries.map(
                    delivery =>
                        convertDeliveryToEarning(
                            delivery
                        )
                )
            );


        /*
         * Remove deliveries where the order
         * could not be loaded.
         */

        earningsData =
            earningsData.filter(
                item => item !== null
            );


        calculateEarnings();
        displayEarnings(
            getFilteredEarnings()
        );


    } catch (error) {

        console.error(
            "Error loading earnings:",
            error
        );


        displayEmptyEarnings();


        updateSummary(
            0,
            0,
            0,
            0
        );

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
   CONVERT DELIVERY TO EARNING
========================================= */

async function convertDeliveryToEarning(
    delivery
) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/orders/${delivery.order_id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load order ${delivery.order_id}`
            );

        }


        const order =
            await response.json();


        return {

            deliveryId:
                `D${delivery.delivery_id}`,

            order:
                `#QB${delivery.order_id}`,

            orderId:
                delivery.order_id,

            date:
                delivery.delivered_at,

            amount:
                Number(
                    order.delivery_fee || 0
                ),

            status:
                "Paid"

        };


    } catch (error) {

        console.error(
            `Could not load earning for delivery ${delivery.delivery_id}:`,
            error
        );

        return null;

    }

}


/* =========================================
   CALCULATE EARNINGS
========================================= */

function calculateEarnings() {

    const now =
        new Date();


    const today =
        earningsData
            .filter(
                item =>
                    isToday(item.date)
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.amount,
                0
            );


    const week =
        earningsData
            .filter(
                item =>
                    isThisWeek(item.date)
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.amount,
                0
            );


    const month =
        earningsData
            .filter(
                item =>
                    isThisMonth(item.date)
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.amount,
                0
            );


    const total =
        earningsData.reduce(
            (
                sum,
                item
            ) =>
                sum +
                item.amount,
            0
        );


    updateSummary(
        today,
        week,
        month,
        total
    );

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary(
    today,
    week,
    month,
    total
) {

    const todayElement =
        document.getElementById(
            "today-earnings"
        );

    const weeklyElement =
        document.getElementById(
            "weekly-earnings"
        );

    const monthlyElement =
        document.getElementById(
            "monthly-earnings"
        );

    const totalElement =
        document.getElementById(
            "total-earnings"
        );


    if (todayElement) {

        todayElement.textContent =
            formatCurrency(today);

    }


    if (weeklyElement) {

        weeklyElement.textContent =
            formatCurrency(week);

    }


    if (monthlyElement) {

        monthlyElement.textContent =
            formatCurrency(month);

    }


    if (totalElement) {

        totalElement.textContent =
            formatCurrency(total);

    }

}


/* =========================================
   FILTER EARNINGS
========================================= */

function filterEarnings() {

    displayEarnings(
        getFilteredEarnings()
    );

}


/* =========================================
   GET FILTERED EARNINGS
========================================= */

function getFilteredEarnings() {

    const filter =
        document.getElementById(
            "earnings-filter"
        )?.value || "all";


    if (filter === "all") {

        return earningsData;

    }


    if (filter === "today") {

        return earningsData.filter(
            item =>
                isToday(item.date)
        );

    }


    if (filter === "week") {

        return earningsData.filter(
            item =>
                isThisWeek(item.date)
        );

    }


    if (filter === "month") {

        return earningsData.filter(
            item =>
                isThisMonth(item.date)
        );

    }


    return earningsData;

}


/* =========================================
   DISPLAY EARNINGS
========================================= */

function displayEarnings(
    data
) {

    const tableBody =
        document.getElementById(
            "earnings-table-body"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center; padding:30px;">

                    No earnings found.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(
        item => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.deliveryId}
                </td>

                <td>
                    ${item.order}
                </td>

                <td>
                    ${formatDate(item.date)}
                </td>

                <td>
                    ${formatCurrency(item.amount)}
                </td>

                <td>

                    <span
                        class="earning-status paid">

                        ${item.status}

                    </span>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


/* =========================================
   EMPTY EARNINGS
========================================= */

function displayEmptyEarnings() {

    const tableBody =
        document.getElementById(
            "earnings-table-body"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="5"
                style="text-align:center; padding:30px;">

                Unable to load earnings.

            </td>

        </tr>

    `;

}


/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {

    return (
        "Rs." +
        Number(amount || 0).toFixed(2)
    );

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "N/A";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "N/A";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   TODAY
========================================= */

function isToday(dateValue) {

    if (!dateValue) {
        return false;
    }


    const date =
        new Date(dateValue);

    const now =
        new Date();


    return (
        date.getFullYear() ===
            now.getFullYear() &&

        date.getMonth() ===
            now.getMonth() &&

        date.getDate() ===
            now.getDate()
    );

}


/* =========================================
   THIS WEEK
========================================= */

function isThisWeek(dateValue) {

    if (!dateValue) {
        return false;
    }


    const date =
        new Date(dateValue);

    const now =
        new Date();


    /*
     * Monday is the first day of the week.
     */

    const day =
        now.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    const startOfWeek =
        new Date(now);


    startOfWeek.setHours(
        0,
        0,
        0,
        0
    );


    startOfWeek.setDate(
        now.getDate() -
        difference
    );


    return date >= startOfWeek &&
           date <= now;

}


/* =========================================
   THIS MONTH
========================================= */

function isThisMonth(dateValue) {

    if (!dateValue) {
        return false;
    }


    const date =
        new Date(dateValue);

    const now =
        new Date();


    return (
        date.getFullYear() ===
            now.getFullYear() &&

        date.getMonth() ===
            now.getMonth()
    );

}