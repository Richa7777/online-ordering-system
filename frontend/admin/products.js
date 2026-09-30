

let products = [];

let selectedCategory = "All";

let editingProductId = null;



/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeProducts();

        setupMobileMenu();

        setupProductSearch();

        setupCategoryFilters();

        setupProductModal();

        setupProductForm();

        setupLogout();

    }
);

async function initializeProducts() {

    try {

        // Load categories first
        const categoryResponse = await fetch(
            "http://localhost:8080/api/categories"
        );

        if (!categoryResponse.ok) {
            throw new Error("Could not load categories");
        }

        const categories = await categoryResponse.json();

        // Store categories for use when loading products
        window.quickBitesCategories = categories;

        // Load food items from MySQL through Spring Boot
        const productResponse = await fetch(
            "http://localhost:8080/api/food-items"
        );

        if (!productResponse.ok) {
            throw new Error("Could not load food items");
        }

        const data = await productResponse.json();

        // Convert backend format to the format
        // currently used by the Admin frontend
        products = data.map(product => {

            const category = categories.find(
                item =>
                    Number(item.categoryId) ===
                    Number(product.categoryId)
            );

            return {
                id: product.foodId,
                name: product.foodName,
                description: product.description || "",
                price: `Rs.${Number(product.price)}`,
                image: product.imageUrl || "",
                categoryId: product.categoryId,
                category: category
                    ? category.categoryName
                    : "Unknown",
                popular: product.isPopular === true,
                isAvailable: product.isAvailable
            };

        });

        loadProductCategories(categories);

        renderProducts();

    }
    catch (error) {

        console.error(
            "Error loading products from backend:",
            error
        );

        products = [];

        renderProducts();

    }

}

function loadProductCategories(categories) {

    const select =
        document.getElementById("product-category");

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            Select Category
        </option>
    `;

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category.categoryId;

        option.textContent =
            category.categoryName;

        select.appendChild(option);

    });

}

/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {


    const grid =
        document.getElementById(
            "admin-products-grid"
        );


    const noProducts =
        document.getElementById(
            "no-products"
        );


    const productCount =
        document.getElementById(
            "product-count"
        );


    if (!grid) {

        return;

    }


    /*
        Clear existing cards.
    */

    grid.innerHTML = "";



    /* =====================================================
       FILTER PRODUCTS
       ===================================================== */

    const searchInput =
        document.getElementById(
            "product-search"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filteredProducts =
        products.filter(
            function (product) {


                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchText);


                const matchesCategory =
                    selectedCategory === "All" ||
                    product.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );



    /* =====================================================
       PRODUCT COUNT
       ===================================================== */

    if (productCount) {


        if (filteredProducts.length === 1) {

            productCount.textContent =
                "1 product";

        }
        else {

            productCount.textContent =
                `${filteredProducts.length} products`;

        }

    }



    /* =====================================================
       NO PRODUCTS
       ===================================================== */

    if (filteredProducts.length === 0) {


        if (noProducts) {

            noProducts.style.display =
                "block";

        }


        return;

    }


    if (noProducts) {

        noProducts.style.display =
            "none";

    }



    /* =====================================================
       CREATE PRODUCT CARDS
       ===================================================== */

    filteredProducts.forEach(
        function (product) {

            const card =
                createProductCard(product);

            grid.appendChild(card);

        }
    );

}



/* =========================================================
   CREATE PRODUCT CARD
   ========================================================= */

function createProductCard(product) {


    const card =
        document.createElement("article");


    card.className =
        "admin-product-card";


    /*
        Convert image path for Admin.

        products.json uses:

        images/burger.png

        Admin is inside:

        admin/

        So we need:

        ../public/images/burger.png
    */

    const imagePath =
        getAdminImagePath(
            product.image
        );


    /*
        Remove Rs. from price if necessary
        and display it consistently.
    */

    const price =
        formatPrice(
            product.price
        );



    card.innerHTML = `


        ${
            product.popular
                ? `
                    <div class="popular-badge">

                        <i class="fa-solid fa-star"></i>

                        Popular

                    </div>
                  `
                : ""
        }


        <!-- Product Image -->

        <div class="admin-product-image">

            <img
                src="${escapeHTML(imagePath)}"
                alt="${escapeHTML(product.name)}"
                onerror="this.src='../public/images/food.png'"
            >

        </div>


        <!-- Product Information -->

        <div class="admin-product-info">


            <h3>

                ${escapeHTML(product.name)}

            </h3>


            <p class="admin-product-category">

                ${escapeHTML(product.category)}

            </p>


            <p class="admin-product-price">

                Rs.${escapeHTML(
                    String(price)
                )}

            </p>


            <!-- Product Actions -->

            <div class="product-actions">


                <!-- Edit -->

                <button
                    type="button"
                    class="product-action-btn edit-product-btn"
                    data-id="${product.id}"
                    title="Edit Product"
                >

                    <i class="fa-solid fa-pen"></i>

                </button>


                <!-- Delete -->

                <button
                    type="button"
                    class="product-action-btn delete-product-btn"
                    data-id="${product.id}"
                    title="Delete Product"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

    `;



    /* =====================================================
       EDIT BUTTON
       ===================================================== */

    const editButton =
        card.querySelector(
            ".edit-product-btn"
        );


    editButton.addEventListener(
        "click",
        function () {

            const productId =
                Number(
                    this.dataset.id
                );

            openEditProduct(
                productId
            );

        }
    );



    /* =====================================================
       DELETE BUTTON
       ===================================================== */

    const deleteButton =
        card.querySelector(
            ".delete-product-btn"
        );


    deleteButton.addEventListener(
        "click",
        function () {

            const productId =
                Number(
                    this.dataset.id
                );

            deleteProduct(
                productId
            );

        }
    );


    return card;

}



/* =========================================================
   IMAGE PATH
   ========================================================= */

function getAdminImagePath(image) {


    if (!image) {

        return "../public/images/food.png";

    }


    if (
        image.startsWith("../")
    ) {

        return image;

    }


    return `../public/${image}`;

}



/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(price) {


    return String(price)

        .replace(
            "Rs.",
            ""
        )

        .replace(
            /,/g,
            ""
        )

        .trim();

}



/* =========================================================
   SEARCH
   ========================================================= */

function setupProductSearch() {


    const searchInput =
        document.getElementById(
            "product-search"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            renderProducts();

        }
    );

}



/* =========================================================
   CATEGORY FILTERS
   ========================================================= */

function setupCategoryFilters() {


    const categoryButtons =
        document.querySelectorAll(
            ".product-category-btn"
        );


    categoryButtons.forEach(
        function (button) {


            button.addEventListener(
                "click",
                function () {


                    /*
                        Remove active from all.
                    */

                    categoryButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /*
                        Add active to selected.
                    */

                    this.classList.add(
                        "active"
                    );


                    /*
                        Save selected category.
                    */

                    selectedCategory =
                        this.dataset.category;


                    renderProducts();

                }
            );

        }
    );

}



/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function setupProductModal() {


    const openButton =
        document.getElementById(
            "open-add-product"
        );


    const closeButton =
        document.getElementById(
            "close-product-modal"
        );


    const cancelButton =
        document.getElementById(
            "cancel-product"
        );


    const modal =
        document.getElementById(
            "product-modal"
        );


    if (!modal) {

        return;

    }



    /* ================= OPEN ADD ================= */

    if (openButton) {


        openButton.addEventListener(
            "click",
            function () {

                openAddProduct();

            }
        );

    }



    /* ================= CLOSE ================= */

    if (closeButton) {


        closeButton.addEventListener(
            "click",
            function () {

                closeProductModal();

            }
        );

    }



    /* ================= CANCEL ================= */

    if (cancelButton) {


        cancelButton.addEventListener(
            "click",
            function () {

                closeProductModal();

            }
        );

    }



    /* ================= CLICK OUTSIDE ================= */

    modal.addEventListener(
        "click",
        function (event) {


            if (
                event.target === modal
            ) {

                closeProductModal();

            }

        }
    );



    /* ================= ESCAPE KEY ================= */

    document.addEventListener(
        "keydown",
        function (event) {


            if (
                event.key === "Escape"
            ) {

                closeProductModal();

            }

        }
    );

}



/* =========================================================
   OPEN ADD PRODUCT
   ========================================================= */

function openAddProduct() {


    editingProductId = null;


    const modalTitle =
        document.getElementById(
            "modal-title"
        );


    if (modalTitle) {

        modalTitle.textContent =
            "Add New Product";

    }


    clearProductForm();


    const modal =
        document.getElementById(
            "product-modal"
        );


    if (modal) {

        modal.classList.add("show");

    }



    /*
        Focus product name.
    */

    setTimeout(
        function () {

            const nameInput =
                document.getElementById(
                    "product-name"
                );


            if (nameInput) {

                nameInput.focus();

            }

        },
        100
    );

}



/* =========================================================
   OPEN EDIT PRODUCT
   ========================================================= */

function openEditProduct(productId) {


    const product =
        products.find(
            function (item) {

                return Number(item.id) ===
                    Number(productId);

            }
        );


    if (!product) {

        return;

    }


    editingProductId =
        Number(product.id);


    const modalTitle =
        document.getElementById(
            "modal-title"
        );


    if (modalTitle) {

        modalTitle.textContent =
            "Edit Product";

    }



    /* ================= FILL FORM ================= */

    document.getElementById(
        "product-id"
    ).value =
        product.id;


    document.getElementById(
        "product-name"
    ).value =
        product.name;


    document.getElementById(
        "product-price"
    ).value =
        formatPrice(
            product.price
        );


    document.getElementById(
    "product-category"
).value =
    product.categoryId;

    document.getElementById(
        "product-image"
    ).value =
        product.image;


    document.getElementById(
        "product-popular"
    ).checked =
        Boolean(product.popular);



    /* ================= SHOW MODAL ================= */

    const modal =
        document.getElementById(
            "product-modal"
        );


    if (modal) {

        modal.classList.add("show");

    }

}



/* =========================================================
   CLEAR FORM
   ========================================================= */

function clearProductForm() {


    const form =
        document.getElementById(
            "product-form"
        );


    if (form) {

        form.reset();

    }


    const idInput =
        document.getElementById(
            "product-id"
        );


    if (idInput) {

        idInput.value = "";

    }

}



/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeProductModal() {


    const modal =
        document.getElementById(
            "product-modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    editingProductId = null;


    clearProductForm();

}



/* =========================================================
   PRODUCT FORM
   ========================================================= */

function setupProductForm() {


    const form =
        document.getElementById(
            "product-form"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {


            event.preventDefault();


            saveProduct();

        }
    );

}

async function saveProduct() {

    const name =
        document.getElementById(
            "product-name"
        ).value.trim();

    const price =
        document.getElementById(
            "product-price"
        ).value.trim();

    const categoryId =
        document.getElementById(
            "product-category"
        ).value;

    const image =
        document.getElementById(
            "product-image"
        ).value.trim();

    const popular =
        document.getElementById(
            "product-popular"
        ).checked;


    // ==============================
    // VALIDATION
    // ==============================

    if (
        !name ||
        !price ||
        !categoryId ||
        !image
    ) {

        alert(
            "Please fill in all product fields."
        );

        return;

    }


    if (Number(price) < 0) {

        alert(
            "Price cannot be negative."
        );

        return;

    }


   const productData = {

    categoryId: Number(categoryId),

    foodName: name,

    description: "",

    price: Number(price),

    imageUrl: image,

    isAvailable: true,

    isPopular: popular

};


    try {

        let response;

        let isEditing =
            editingProductId !== null;


        // ==============================
        // EDIT
        // ==============================

        if (isEditing) {

            response = await fetch(
                `http://localhost:8080/api/food-items/${editingProductId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(productData)
                }
            );

        }


        // ==============================
        // ADD
        // ==============================

        else {

            response = await fetch(
                "http://localhost:8080/api/food-items",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(productData)
                }
            );

        }


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        // Get the updated item from backend
        const savedProduct =
            await response.json();


        console.log(
            "Saved to database:",
            savedProduct
        );


        // Reload products directly from MySQL
        await initializeProducts();


        closeProductModal();


        alert(
            isEditing
                ? "Product updated successfully."
                : "Product added successfully."
        );

    }
    catch (error) {

        console.error(
            "Error saving product:",
            error
        );

        alert(
            "Could not save the product to the database."
        );

    }

}


/* =========================================================
   GET NEXT PRODUCT ID
   ========================================================= */

function getNextProductId() {


    if (
        products.length === 0
    ) {

        return 1;

    }


    const ids =
        products.map(
            function (product) {

                return Number(
                    product.id
                ) || 0;

            }
        );


    return Math.max(...ids) + 1;

}

async function deleteProduct(productId) {

    const product =
        products.find(
            function (item) {

                return Number(item.id) ===
                    Number(productId);

            }
        );


    if (!product) {
        return;
    }


    const confirmDelete =
        confirm(
            `Are you sure you want to delete "${product.name}"?`
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:8080/api/food-items/${productId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        // Reload directly from database
        await initializeProducts();


        alert(
            "Product deleted successfully."
        );

    }
    catch (error) {

        console.error(
            "Error deleting product:",
            error
        );

        alert(
            "Could not delete the product from the database."
        );

    }

}



/* =========================================================
   MOBILE MENU
   ========================================================= */

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
                hamburger.querySelector("i");


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



/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {


    const logoutLinks =
        document.querySelectorAll(
            ".admin-logout, .mobile-logout"
        );


    logoutLinks.forEach(
        function (logoutLink) {


            logoutLink.addEventListener(
                "click",
                async function (event) {


                    event.preventDefault();


                    const confirmLogout =
                        confirm(
                            "Are you sure you want to logout?"
                        );


                    if (
                        confirmLogout
                    ) {


                        /*
                            Authentication will be
                            connected later.

                            For now return to public page.
                        */

                        try {
                            await fetch(
                                "http://127.0.0.1:8080/api/auth/logout",
                                {
                                    method: "POST",
                                    credentials: "include"
                                }
                            );
                        } catch (error) {
                            console.error("Logout error:", error);
                        }

                        window.location.href =
                            "../public/index.html";

                    }

                }
            );

        }
    );

}



/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}