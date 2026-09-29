// ========================================
// CUSTOMER PROFILE
// ========================================

const customerName = quickBites.getCustomer(
    "customerName",
    "Susmita Tamang"
);

const customerEmail = quickBites.getCustomer(
    "customerEmail",
    "customer@example.com"
);

const customerId = quickBites.getCustomer(
    "customerId",
    "CUS001"
);


// ========================================
// DISPLAY CUSTOMER DATA
// ========================================

document.querySelector("#customer-name").textContent =
    customerName;

document.querySelector("#profile-name").textContent =
    customerName;

document.querySelector("#profile-email").textContent =
    customerEmail;

document.querySelector("#profile-id").textContent =
    customerId;


// ========================================
// LOGOUT
// ========================================

const logoutBtn = document.querySelector("#logout-btn");

logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();

    window.location.href = "index.html";
});
