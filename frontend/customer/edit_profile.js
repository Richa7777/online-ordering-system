// ========================================
// ELEMENTS
// ========================================

const form = document.querySelector("#edit-profile-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const message = document.querySelector("#profile-message");


// ========================================
// LOAD CUSTOMER DATA
// ========================================

nameInput.value = quickBites.getCustomer(
    "customerName",
    "Susmita Tamang"
);

emailInput.value = quickBites.getCustomer(
    "customerEmail",
    "customer@example.com"
);

phoneInput.value = quickBites.getCustomer("customerPhone");
addressInput.value = quickBites.getCustomer("customerAddress");
cityInput.value = quickBites.getCustomer("customerCity");


// ========================================
// SAVE PROFILE
// ========================================

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const city = cityInput.value.trim();

    if (!name || !email) {
        quickBites.showMessage(
            message,
            "Please enter your name and email.",
            "red"
        );
        return;
    }

    quickBites.setCustomer({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        customerCity: city
    });

    quickBites.showMessage(
        message,
        "Profile updated successfully!",
        "green"
    );

    setTimeout(function () {
        window.location.href = "profile.html";
    }, 1000);
});


