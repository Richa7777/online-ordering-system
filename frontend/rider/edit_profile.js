const API_BASE_URL = "http://127.0.0.1:8080";

let currentUser = null;
let currentAddress = null;

const form = document.getElementById("edit-profile-form");
const message = document.getElementById("profile-message");

const nameInput = document.getElementById("rider-name");
const emailInput = document.getElementById("rider-email");
const phoneInput = document.getElementById("rider-phone");
const addressInput = document.getElementById("rider-address");


/* =========================================
   SHOW MESSAGE
========================================= */

function showMessage(text, type) {

    if (!message) {
        return;
    }

    message.textContent = text;
    message.className = `profile-message ${type}`;
}


/* =========================================
   LOAD CURRENT RIDER
========================================= */

async function loadProfile() {

    try {

        const userResponse = await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!userResponse.ok) {
            throw new Error(
                `Could not load profile: ${userResponse.status}`
            );
        }

        currentUser = await userResponse.json();

        console.log("Current rider:", currentUser);


        /* Fill user information */

        nameInput.value = currentUser.name || "";
        emailInput.value = currentUser.email || "";


        /* =====================================
           LOAD RIDER ADDRESS
        ===================================== */

        const addressResponse = await fetch(
            `${API_BASE_URL}/api/addresses/user/${currentUser.id}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!addressResponse.ok) {
            throw new Error(
                `Could not load address: ${addressResponse.status}`
            );
        }

        const addresses = await addressResponse.json();

        console.log("Rider addresses:", addresses);


        if (addresses.length > 0) {

            currentAddress = addresses[0];

            addressInput.value =
                currentAddress.addressLine || "";

            phoneInput.value =
                currentAddress.phone || "";

        } else {

            currentAddress = null;

            addressInput.value = "";
            phoneInput.value = "";

        }

    } catch (error) {

        console.error("Profile loading error:", error);

        showMessage(
            "Could not load profile information.",
            "error"
        );

    }
}


/* =========================================
   SAVE PROFILE
========================================= */

if (form) {

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();
        const newPhone = phoneInput.value.trim();
        const newAddress = addressInput.value.trim();


        /* =====================================
           VALIDATION
        ===================================== */

        if (
            newName === "" ||
            newEmail === "" ||
            newPhone === "" ||
            newAddress === ""
        ) {

            showMessage(
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        const saveButton =
            form.querySelector(".save-btn");

        if (saveButton) {

            saveButton.disabled = true;
            saveButton.textContent = "Saving...";

        }


        try {

            /* =====================================
               UPDATE USER
            ===================================== */

            const userResponse = await fetch(
                `${API_BASE_URL}/api/auth/me`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: newName,
                        email: newEmail
                    })
                }
            );


            if (!userResponse.ok) {

                const errorText =
                    await userResponse.text();

                throw new Error(
                    `Failed to update profile: ${userResponse.status} ${errorText}`
                );

            }


            const updatedUser =
                await userResponse.json();

            console.log(
                "Updated rider:",
                updatedUser
            );


            /* =====================================
               UPDATE ADDRESS
            ===================================== */

            if (currentAddress) {

                const addressResponse = await fetch(
                    `${API_BASE_URL}/api/addresses/${currentAddress.addressId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            userId: currentUser.id,
                            addressLine: newAddress,
                            city: currentAddress.city || "",
                            phone: newPhone
                        })
                    }
                );


                if (!addressResponse.ok) {

                    const errorText =
                        await addressResponse.text();

                    throw new Error(
                        `Failed to update address: ${addressResponse.status} ${errorText}`
                    );

                }

            } else {

                /* =====================================
                   CREATE ADDRESS
                ===================================== */

                const addressResponse = await fetch(
                    `${API_BASE_URL}/api/addresses`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            userId: currentUser.id,
                            addressLine: newAddress,
                            city: "",
                            phone: newPhone
                        })
                    }
                );


                if (!addressResponse.ok) {

                    const errorText =
                        await addressResponse.text();

                    throw new Error(
                        `Failed to create address: ${addressResponse.status} ${errorText}`
                    );

                }

            }


            /* =====================================
               SUCCESS
            ===================================== */

            showMessage(
                "Profile updated successfully!",
                "success"
            );


            setTimeout(function () {

                window.location.href =
                    "profile.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            showMessage(
                "Could not update profile. Please try again.",
                "error"
            );

        } finally {

            if (saveButton) {

                saveButton.disabled = false;

                saveButton.innerHTML =
                    '<i class="fa-solid fa-check"></i> Save Changes';

            }

        }

    });

}


/* =========================================
   LOAD PROFILE WHEN PAGE OPENS
========================================= */

loadProfile();