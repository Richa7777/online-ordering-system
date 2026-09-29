/* =========================================
   RIDER EARNINGS
========================================= */


/* =========================================
   EARNINGS DATA
========================================= */

const earningsData = [

    {
        deliveryId: "D1001",
        order: "#QB1001",
        date: "16 Sep 2026",
        amount: 150,
        period: "today",
        status: "Paid"
    },

    {
        deliveryId: "D1002",
        order: "#QB1002",
        date: "16 Sep 2026",
        amount: 100,
        period: "today",
        status: "Paid"
    },

    {
        deliveryId: "D1003",
        order: "#QB1003",
        date: "15 Sep 2026",
        amount: 150,
        period: "week",
        status: "Paid"
    },

    {
        deliveryId: "D1004",
        order: "#QB1004",
        date: "15 Sep 2026",
        amount: 120,
        period: "week",
        status: "Paid"
    },

    {
        deliveryId: "D1005",
        order: "#QB1005",
        date: "14 Sep 2026",
        amount: 130,
        period: "week",
        status: "Paid"
    }

];



/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {

    return "Rs." + amount.toLocaleString();

}



/* =========================================
   CALCULATE EARNINGS
========================================= */

function calculateEarnings() {

    const today =
        earningsData
            .filter(item => item.period === "today")
            .reduce(
                (total, item) => total + item.amount,
                0
            );


    const week =
        earningsData
            .filter(
                item =>
                    item.period === "today" ||
                    item.period === "week"
            )
            .reduce(
                (total, item) => total + item.amount,
                0
            );


    const total =
        earningsData.reduce(
            (sum, item) => sum + item.amount,
            0
        );


    document.getElementById(
        "today-earnings"
    ).textContent =
        formatCurrency(today);


    document.getElementById(
        "weekly-earnings"
    ).textContent =
        formatCurrency(week);


    document.getElementById(
        "total-earnings"
    ).textContent =
        formatCurrency(total);

}



/* =========================================
   FILTER EARNINGS
========================================= */

function filterEarnings() {

    const filter =
        document.getElementById(
            "earnings-filter"
        ).value;


    const tableBody =
        document.getElementById(
            "earnings-table-body"
        );


    tableBody.innerHTML = "";


    let filteredData;


    if (filter === "all") {

        filteredData = earningsData;

    } else {

        filteredData =
            earningsData.filter(
                item => item.period === filter
            );

    }


    filteredData.forEach(item => {

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
                ${item.date}
            </td>

            <td>
                ${formatCurrency(item.amount)}
            </td>

            <td>

                <span class="earning-status paid">
                    ${item.status}
                </span>

            </td>

        `;


        tableBody.appendChild(row);

    });


    if (filteredData.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center; padding:30px;">

                    No earnings found.

                </td>

            </tr>

        `;

    }

}



/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        calculateEarnings();


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