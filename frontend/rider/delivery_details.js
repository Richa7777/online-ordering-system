/* =========================================
   DELIVERY DETAILS
========================================= */

const acceptButton =
    document.querySelector("#accept-btn");

const completeButton =
    document.querySelector("#complete-btn");

const deliveryStatus =
    document.querySelector("#delivery-status");

const deliveryMessage =
    document.querySelector("#delivery-message");



/* =========================================
   ACCEPT DELIVERY
========================================= */

if (acceptButton) {

    acceptButton.addEventListener("click", function () {

        deliveryStatus.textContent = "Accepted";

        deliveryStatus.style.background = "#d4edda";

        deliveryStatus.style.color = "#155724";


        deliveryMessage.textContent =
            "Delivery accepted successfully.";


        acceptButton.disabled = true;

        completeButton.disabled = false;

    });

}



/* =========================================
   COMPLETE DELIVERY
========================================= */

if (completeButton) {

    completeButton.addEventListener("click", function () {

        deliveryStatus.textContent = "Delivered";

        deliveryStatus.style.background = "#d4edda";

        deliveryStatus.style.color = "#155724";


        deliveryMessage.textContent =
            "Delivery marked as completed.";


        completeButton.disabled = true;

    });

}