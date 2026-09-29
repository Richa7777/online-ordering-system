/* =========================================================
   QUICK BITES ADMIN PRODUCTS
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

const PRODUCTS_KEY = "quickBitesProducts";

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



/* =========================================================
   INITIALIZE PRODUCTS
   ========================================================= */

async function initializeProducts() {


    /*
        First check localStorage.

        If Admin has already added/edited/deleted
        products, we must use those products.
    */

    const savedProducts =
        localStorage.getItem(PRODUCTS_KEY);


    if (savedProducts) {


        try {

            products =
                JSON.parse(savedProducts);

        }
        catch (error) {

            console.error(
                "Could not read saved products:",
                error
            );

            products = [];

        }


        renderProducts();

        return;

    }



    /*
        If localStorage does not contain products,
        load the original products.json.
    */

    try {


        const response =
            await fetch("../public/products.json");


        if (!response.ok) {

            throw new Error(
                "Could not load products.json"
            );

        }


        products =
            await response.json();


        /*
            Save the original products to localStorage.

            This means future Admin changes will
            use localStorage instead of the JSON file.
        */

        saveProducts();


        renderProducts();

    }


    catch (error) {


        console.error(
            "Error loading products:",
            error
        );


        products = [];


        renderProducts();

    }

}



/* =========================================================
   SAVE PRODUCTS
   ========================================================= */

function saveProducts() {


    localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(products)
    );

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
        product.category;


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



/* =========================================================
   SAVE PRODUCT
   ========================================================= */

function saveProduct() {


    const name =
        document.getElementById(
            "product-name"
        ).value.trim();


    const price =
        document.getElementById(
            "product-price"
        ).value.trim();


    const category =
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



    /* =====================================================
       VALIDATION
       ===================================================== */

    if (
        !name ||
        !price ||
        !category ||
        !image
    ) {

        alert(
            "Please fill in all product fields."
        );

        return;

    }



    if (
        Number(price) < 0
    ) {

        alert(
            "Price cannot be negative."
        );

        return;

    }



    /* =====================================================
       EDIT EXISTING PRODUCT
       ===================================================== */

    if (
        editingProductId !== null
    ) {


        const productIndex =
            products.findIndex(
                function (product) {

                    return Number(product.id) ===
                        Number(editingProductId);

                }
            );


        if (
            productIndex !== -1
        ) {


            products[productIndex] = {

                ...products[productIndex],

                name: name,

                price: `Rs.${Number(price)}`,

                image: image,

                category: category,

                popular: popular

            };

        }

    }



    /* =====================================================
       ADD NEW PRODUCT
       ===================================================== */

    else {


        const newProductId =
            getNextProductId();


        const newProduct = {

            id: newProductId,

            name: name,

            price: `Rs.${Number(price)}`,

            image: image,

            category: category,

            popular: popular

        };


        products.push(
            newProduct
        );

    }



    /* =====================================================
       SAVE
       ===================================================== */

    saveProducts();


    /*
        Re-render the product cards.
    */

    renderProducts();


    /*
        Close modal.
    */

    closeProductModal();


    /*
        Inform the admin.
    */

    alert(
        editingProductId === null
            ? "Product added successfully."
            : "Product updated successfully."
    );

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



/* =========================================================
   DELETE PRODUCT
   ========================================================= */

function deleteProduct(productId) {


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



    /*
        Remove product.
    */

    products =
        products.filter(
            function (item) {

                return Number(item.id) !==
                    Number(productId);

            }
        );



    /*
        Save updated products.
    */

    saveProducts();


    /*
        Update screen.
    */

    renderProducts();


    alert(
        "Product deleted successfully."
    );

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
                function (event) {


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