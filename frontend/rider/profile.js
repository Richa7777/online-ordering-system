/* =========================================
   RIDER PROFILE
   Backend connected
========================================= */

let currentRider = null;
let currentAddress = null;


/* =========================================
   LOAD PROFILE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadRiderProfile();

        setupProfileActions();

    }
);


/* =========================================
   LOAD RIDER PROFILE
========================================= */

async function loadRiderProfile() {

    try {

        /* -----------------------------------------
           LOAD CURRENT USER
        ----------------------------------------- */

        const userResponse =
            await fetch(
                `${API_BASE_URL}/api/auth/me`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!userResponse.ok) {

            throw new Error(
                `Failed to load rider: ${userResponse.status}`
            );

        }


        currentRider =
            await userResponse.json();


        /* -----------------------------------------
           LOAD RIDER ADDRESS / PHONE
        ----------------------------------------- */

        try {

            const addressResponse =
                await fetch(
                    `${API_BASE_URL}/api/addresses/user/${currentRider.id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (addressResponse.ok) {

                const addresses =
                    await addressResponse.json();


                /*
                 * Use the first address for the
                 * rider's phone number.
                 */

                if (
                    Array.isArray(addresses) &&
                    addresses.length > 0
                ) {

                    currentAddress =
                        addresses[0];

                }

            }

        } catch (addressError) {

            console.warn(
                "Could not load rider address:",
                addressError
            );

        }


        displayRiderProfile();

    } catch (error) {

        console.error(
            "Error loading rider profile:",
            error
        );


        showProfileMessage(
            "Could not load profile.",
            "error"
        );

    }

}


/* =========================================
   DISPLAY RIDER PROFILE
========================================= */

function displayRiderProfile() {

    if (!currentRider) {
        return;
    }


    const riderName =
        document.getElementById(
            "rider-name"
        );

    const riderId =
        document.getElementById(
            "rider-id"
        );

    const riderEmail =
        document.getElementById(
            "rider-email"
        );

    const riderPhone =
        document.getElementById(
            "rider-phone"
        );


    if (riderName) {

        riderName.textContent =
            currentRider.name || "Rider";

    }


    if (riderId) {

        riderId.textContent =
            currentRider.id
                ? `RD${String(currentRider.id).padStart(4, "0")}`
                : "N/A";

    }


    if (riderEmail) {

        riderEmail.textContent =
            currentRider.email || "N/A";

    }


    if (riderPhone) {

        riderPhone.textContent =
            currentAddress?.phone || "Not provided";

    }


    /*
     * Vehicle and joined date are not stored
     * in the current database schema.
     *
     * Keep the existing HTML values for now.
     */

}


/* =========================================
   SETUP PROFILE ACTIONS
========================================= */

function setupProfileActions() {

    const editProfileButton =
        document.getElementById(
            "edit-profile-btn"
        );

    const cancelEditButton =
        document.getElementById(
            "cancel-edit-btn"
        );

    const editProfileForm =
        document.getElementById(
            "edit-profile-form"
        );


    /* -----------------------------------------
       OPEN EDIT PROFILE
    ----------------------------------------- */

    if (editProfileButton) {

        editProfileButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openEditProfile();

            }
        );

    }


    /* -----------------------------------------
       CANCEL EDIT
    ----------------------------------------- */

    if (cancelEditButton) {

        cancelEditButton.addEventListener(
            "click",
            function () {

                closeEditProfile();

            }
        );

    }


    /* -----------------------------------------
       SAVE PROFILE
    ----------------------------------------- */

    if (editProfileForm) {

        editProfileForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await saveProfile();

            }
        );

    }

}


/* =========================================
   OPEN EDIT PROFILE
========================================= */

function openEditProfile() {

    if (!currentRider) {
        return;
    }


    const profileView =
        document.getElementById(
            "profile-view"
        );

    const profileEdit =
        document.getElementById(
            "profile-edit"
        );


    if (profileView) {

        profileView.style.display =
            "none";

    }


    if (profileEdit) {

        profileEdit.style.display =
            "block";

    }


    const editName =
        document.getElementById(
            "edit-name"
        );

    const editEmail =
        document.getElementById(
            "edit-email"
        );

    const editPhone =
        document.getElementById(
            "edit-phone"
        );

    const editVehicle =
        document.getElementById(
            "edit-vehicle"
        );

    const editRiderId =
        document.getElementById(
            "edit-rider-id"
        );


    if (editName) {

        editName.value =
            currentRider.name || "";

    }


    if (editEmail) {

        editEmail.value =
            currentRider.email || "";

    }


    if (editPhone) {

        editPhone.value =
            currentAddress?.phone || "";

    }


    if (editVehicle) {

        /*
         * Vehicle is not currently stored
         * in the database.
         *
         * Keep whatever is already selected.
         */

        editVehicle.value =
            editVehicle.value || "Motorcycle";

    }


    if (editRiderId) {

        editRiderId.value =
            currentRider.id
                ? `RD${String(currentRider.id).padStart(4, "0")}`
                : "";

    }


    const password =
        document.getElementById(
            "edit-password"
        );

    const confirmPassword =
        document.getElementById(
            "edit-confirm-password"
        );


    if (password) {
        password.value = "";
    }


    if (confirmPassword) {
        confirmPassword.value = "";
    }


    const message =
        document.getElementById(
            "profile-message"
        );


    if (message) {

        message.textContent = "";

        message.className =
            "profile-message";

    }

}


/* =========================================
   CLOSE EDIT PROFILE
========================================= */

function closeEditProfile() {

    const profileView =
        document.getElementById(
            "profile-view"
        );

    const profileEdit =
        document.getElementById(
            "profile-edit"
        );


    if (profileEdit) {

        profileEdit.style.display =
            "none";

    }


    if (profileView) {

        profileView.style.display =
            "block";

    }

}


/* =========================================
   SAVE PROFILE
========================================= */

async function saveProfile() {

    if (!currentRider) {
        return;
    }


    const newName =
        document.getElementById(
            "edit-name"
        ).value.trim();


    const newEmail =
        document.getElementById(
            "edit-email"
        ).value.trim();


    const newPhone =
        document.getElementById(
            "edit-phone"
        ).value.trim();


    const newPassword =
        document.getElementById(
            "edit-password"
        ).value;


    const confirmPassword =
        document.getElementById(
            "edit-confirm-password"
        ).value;


    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (
        newName === "" ||
        newEmail === "" ||
        newPhone === ""
    ) {

        showProfileMessage(
            "Please fill in all required fields.",
            "error"
        );

        return;

    }


    if (
        newPassword !== "" &&
        newPassword !== confirmPassword
    ) {

        showProfileMessage(
            "Passwords do not match.",
            "error"
        );

        return;

    }


    const saveButton =
        document.getElementById(
            "save-profile-btn"
        );


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.textContent =
            "Saving...";

    }


    try {

        /* =====================================
           UPDATE USER
        ===================================== */

        const updatedUser =
            {
                ...currentRider,
                name: newName,
                email: newEmail
            };


        /*
         * Only send password when the user
         * actually entered a new one.
         */

        if (newPassword !== "") {

            updatedUser.password =
                newPassword;

        }


        const userResponse =
            await fetch(
                `${API_BASE_URL}/api/auth/me`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body:
                        JSON.stringify(
                            updatedUser
                        )
                }
            );


        if (!userResponse.ok) {

            const errorText =
                await userResponse.text();


            throw new Error(
                `Profile update failed: ${userResponse.status} ${errorText}`
            );

        }


        currentRider =
            await userResponse.json();


        /* =====================================
   UPDATE PHONE
===================================== */

if (currentAddress) {

    const addressResponse =
        await fetch(
            `${API_BASE_URL}/api/addresses/${currentAddress.addressId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                credentials: "include",

                body:
                    JSON.stringify({
                        ...currentAddress,
                        phone: newPhone
                    })
            }
        );


    if (!addressResponse.ok) {

        throw new Error(
            `Phone update failed: ${addressResponse.status}`
        );

    }


    currentAddress =
        await addressResponse.json();

} else {

    /*
     * No address exists yet, so create
     * the first address for this rider.
     */

    const addressResponse =
        await fetch(
            `${API_BASE_URL}/api/addresses`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                credentials: "include",

                body:
                    JSON.stringify({
                        userId: currentRider.id,
                        addressLine: "Not provided",
                        city: "",
                        phone: newPhone
                    })
            }
        );


    if (!addressResponse.ok) {

        const errorText =
            await addressResponse.text();

        throw new Error(
            `Phone creation failed: ${addressResponse.status} ${errorText}`
        );

    }


    currentAddress =
        await addressResponse.json();

}

        /* =====================================
           REFRESH DISPLAY
        ===================================== */

        displayRiderProfile();


        showProfileMessage(
            "Profile updated successfully!",
            "success"
        );


        setTimeout(
            function () {

                closeEditProfile();

            },
            1000
        );


    } catch (error) {

        console.error(
            "Error updating rider profile:",
            error
        );


        showProfileMessage(
            "Could not update profile.",
            "error"
        );


    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.innerHTML =
                `<i class="fa-solid fa-check"></i> Save Changes`;

        }

    }

}


/* =========================================
   PROFILE MESSAGE
========================================= */

function showProfileMessage(
    message,
    type
) {

    const profileMessage =
        document.getElementById(
            "profile-message"
        );


    if (!profileMessage) {
        return;
    }


    profileMessage.textContent =
        message;


    profileMessage.className =
        `profile-message ${type}`;

}