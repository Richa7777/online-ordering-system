/* =========================================
   PAYMENT DATA
========================================= */

const payments = [

    {
        paymentId: "PAY1001",
        orderId: "QB993272",
        customer: "Susmita Tamang",
        amount: 550,
        method: "Cash on Delivery",
        date: "11 September 2026",
        status: "Completed"
    },

    {
        paymentId: "PAY1002",
        orderId: "QB126849",
        customer: "Priya Rai",
        amount: 1270,
        method: "eSewa",
        date: "11 September 2026",
        status: "Completed"
    },

    {
        paymentId: "PAY1003",
        orderId: "QB1003",
        customer: "John Smith",
        amount: 500,
        method: "Card",
        date: "10 September 2026",
        status: "Pending"
    },

    {
        paymentId: "PAY1004",
        orderId: "QB1004",
        customer: "Anita Sharma",
        amount: 750,
        method: "Khalti",
        date: "9 September 2026",
        status: "Completed"
    },

    {
        paymentId: "PAY1005",
        orderId: "QB1005",
        customer: "Richa Gurung",
        amount: 900,
        method: "Card",
        date: "8 September 2026",
        status: "Failed"
    },

    {
        paymentId: "PAY1006",
        orderId: "QB1006",
        customer: "Mingma Sherpa",
        amount: 650,
        method: "Cash on Delivery",
        date: "7 September 2026",
        status: "Refunded"
    }

];



/* =========================================
   ELEMENTS
========================================= */

const paymentTableBody =
    document.getElementById("payment-table-body");

const noResults =
    document.getElementById("no-results");

const searchInput =
    document.getElementById("payment-search");

const statusFilter =
    document.getElementById("status-filter");

const methodFilter =
    document.getElementById("method-filter");

const totalPayments =
    document.getElementById("total-payments");

const completedPayments =
    document.getElementById("completed-payments");

const pendingPayments =
    document.getElementById("pending-payments");

const totalRevenue =
    document.getElementById("total-revenue");

const modal =
    document.getElementById("payment-modal");

const modalClose =
    document.getElementById("modal-close");

const paymentDetails =
    document.getElementById("payment-details");



/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {

    return `Rs.${amount.toFixed(2)}`;

}



/* =========================================
   STATUS CLASS
========================================= */

function getStatusClass(status) {

    return status
        .toLowerCase()
        .replace(/\s+/g, "-");

}



/* =========================================
   DISPLAY PAYMENTS
========================================= */

function displayPayments(paymentList) {

    paymentTableBody.innerHTML = "";


    if (paymentList.length === 0) {

        noResults.style.display = "block";

        return;

    }


    noResults.style.display = "none";


    paymentList.forEach(payment => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="payment-id">

                    ${payment.paymentId}

                </span>

            </td>


            <td>

                <span class="order-id">

                    ${payment.orderId}

                </span>

            </td>


            <td>

                ${payment.customer}

            </td>


            <td>

                <span class="payment-amount">

                    ${formatCurrency(payment.amount)}

                </span>

            </td>


            <td>

                ${payment.method}

            </td>


            <td>

                ${payment.date}

            </td>


            <td>

                <span
                    class="payment-status ${getStatusClass(payment.status)}">

                    ${payment.status}

                </span>

            </td>


            <td>

                <button
                    class="view-payment-btn"
                    data-payment-id="${payment.paymentId}">

                    <i class="fa-solid fa-eye"></i>

                    View

                </button>

            </td>

        `;


        paymentTableBody.appendChild(row);

    });

}



/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {

    const total =
        payments.length;


    const completed =
        payments.filter(
            payment => payment.status === "Completed"
        ).length;


    const pending =
        payments.filter(
            payment => payment.status === "Pending"
        ).length;


    const revenue =
        payments
            .filter(
                payment =>
                    payment.status === "Completed"
            )
            .reduce(
                (sum, payment) =>
                    sum + payment.amount,
                0
            );


    totalPayments.textContent =
        total;


    completedPayments.textContent =
        completed;


    pendingPayments.textContent =
        pending;


    totalRevenue.textContent =
        formatCurrency(revenue);

}



/* =========================================
   FILTER PAYMENTS
========================================= */

function filterPayments() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    const selectedMethod =
        methodFilter.value;


    const filtered =
        payments.filter(payment => {


            const matchesSearch =
                payment.paymentId
                    .toLowerCase()
                    .includes(search)

                ||

                payment.orderId
                    .toLowerCase()
                    .includes(search)

                ||

                payment.customer
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                selectedStatus === "all"
                ||
                payment.status === selectedStatus;


            const matchesMethod =
                selectedMethod === "all"
                ||
                payment.method === selectedMethod;


            return (
                matchesSearch
                &&
                matchesStatus
                &&
                matchesMethod
            );

        });


    displayPayments(filtered);

}



/* =========================================
   OPEN PAYMENT DETAILS
========================================= */

function openPaymentDetails(paymentId) {

    const payment =
        payments.find(
            item => item.paymentId === paymentId
        );


    if (!payment) {

        return;

    }


    paymentDetails.innerHTML = `

        <div class="detail-row">

            <span>
                Payment ID
            </span>

            <span>
                ${payment.paymentId}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Order ID
            </span>

            <span>
                ${payment.orderId}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Customer
            </span>

            <span>
                ${payment.customer}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Amount
            </span>

            <span>
                ${formatCurrency(payment.amount)}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Payment Method
            </span>

            <span>
                ${payment.method}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Payment Date
            </span>

            <span>
                ${payment.date}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Status
            </span>

            <span>
                ${payment.status}
            </span>

        </div>

    `;


    modal.classList.add("active");

}



/* =========================================
   VIEW BUTTON EVENT
========================================= */

paymentTableBody.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".view-payment-btn"
            );


        if (!button) {

            return;

        }


        const paymentId =
            button.dataset.paymentId;


        openPaymentDetails(paymentId);

    }
);



/* =========================================
   FILTER EVENTS
========================================= */

searchInput.addEventListener(
    "input",
    filterPayments
);


statusFilter.addEventListener(
    "change",
    filterPayments
);


methodFilter.addEventListener(
    "change",
    filterPayments
);



/* =========================================
   CLOSE MODAL
========================================= */

modalClose.addEventListener(
    "click",
    function () {

        modal.classList.remove("active");

    }
);



/* =========================================
   CLOSE MODAL OUTSIDE
========================================= */

modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {

            modal.classList.remove("active");

        }

    }
);



/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
            &&
            modal.classList.contains("active")
        ) {

            modal.classList.remove("active");

        }

    }
);



/* =========================================
   INITIAL LOAD
========================================= */

updateSummary();

displayPayments(payments);