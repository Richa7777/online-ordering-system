/* =========================================
   QUICK BITES ADMIN - CATEGORIES
========================================= */

const CATEGORIES_KEY = "quickBitesCategories";
const PRODUCTS_KEY = "quickBitesProducts";

let categories = [];
let products = [];

let editingCategoryId = null;


/* =========================================
   DEFAULT CATEGORIES
========================================= */

const defaultCategories = [
    {
        id: 1,
        name: "Burgers",
        icon: "fa-burger"
    },
    {
        id: 2,
        name: "Pizza",
        icon: "fa-pizza-slice"
    },
    {
        id: 3,
        name: "Chicken",
        icon: "fa-drumstick-bite"
    },
    {
        id: 4,
        name: "Sandwiches",
        icon: "fa-bread-slice"
    },
    {
        id: 5,
        name: "Pasta",
        icon: "fa-bowl-food"
    },
    {
        id: 6,
        name: "Snacks",
        icon: "fa-cookie-bite"
    }
];


/* =========================================
   LOAD CATEGORIES
========================================= */

function loadCategories() {

    const savedCategories =
        localStorage.getItem(CATEGORIES_KEY);


    if (!savedCategories) {

        categories = defaultCategories;

        saveCategories();

    } else {

        try {

            categories = JSON.parse(savedCategories);

            if (!Array.isArray(categories)) {
                categories = [];
            }

        } catch (error) {

            console.error(
                "Could not read categories:",
                error
            );

            categories = [];

        }

    }

}


/* =========================================
   SAVE CATEGORIES
========================================= */

function saveCategories() {

    localStorage.setItem(
        CATEGORIES_KEY,
        JSON.stringify(categories)
    );

}


/* =========================================
   LOAD PRODUCTS
========================================= */

async function loadProducts() {

    const savedProducts =
        localStorage.getItem(PRODUCTS_KEY);


    if (savedProducts) {

        try {

            products = JSON.parse(savedProducts);

            if (!Array.isArray(products)) {
                products = [];
            }

            return;

        } catch (error) {

            console.error(
                "Could not read saved products:",
                error
            );

        }

    }


    /*
     * If products have not yet been saved to
     * localStorage, use products.json.
     */

    try {

        const response =
            await fetch("../public/products.json");


        if (!response.ok) {
            throw new Error("Could not load products");
        }


        products = await response.json();


        if (!Array.isArray(products)) {
            products = [];
        }


        localStorage.setItem(
            PRODUCTS_KEY,
            JSON.stringify(products)
        );


    } catch (error) {

        console.error(
            "Could not load products:",
            error
        );

        products = [];

    }

}


/* =========================================
   GET PRODUCT COUNT
========================================= */

function getProductCount(categoryName) {

    return products.filter(product => {

        return String(product.category || "")
            .toLowerCase() ===
            String(categoryName || "")
                .toLowerCase();

    }).length;

}


/* =========================================
   RENDER CATEGORIES
========================================= */

function renderCategories(categoryData = categories) {

    const categoryList =
        document.getElementById("category-list");

    const emptyCategories =
        document.getElementById("empty-categories");

    const categoryCount =
        document.getElementById("category-count");


    if (!categoryList) {
        return;
    }


    categoryList.innerHTML = "";


    /* Update count */

    if (categoryCount) {

        categoryCount.textContent =
            categoryData.length;

    }


    /* Empty state */

    if (categoryData.length === 0) {

        categoryList.style.display = "none";

        if (emptyCategories) {
            emptyCategories.style.display = "block";
        }

        return;

    }


    categoryList.style.display = "grid";

    if (emptyCategories) {
        emptyCategories.style.display = "none";
    }


    /* Create cards */

    categoryData.forEach(category => {

        categoryList.appendChild(
            createCategoryCard(category)
        );

    });

}


/* =========================================
   CREATE CATEGORY CARD
========================================= */

function createCategoryCard(category) {

    const card =
        document.createElement("article");

    card.className = "category-card";


    const productCount =
        getProductCount(category.name);


    card.innerHTML = `

        <div class="category-card-top">

            <div class="category-icon">

                <i class="fa-solid ${escapeHTML(category.icon)}"></i>

            </div>


            <div class="category-name">

                <h4>
                    ${escapeHTML(category.name)}
                </h4>

                <p>
                    Food Category
                </p>

            </div>

        </div>


        <div class="category-product-count">

            <span>
                Products
            </span>

            <strong>
                ${productCount}
            </strong>

        </div>


        <div class="category-actions">

            <button
                type="button"
                class="category-action-btn edit-category-btn"
            >

                <i class="fa-solid fa-pen"></i>

                Edit

            </button>


            <button
                type="button"
                class="category-action-btn delete-category-btn"
            >

                <i class="fa-solid fa-trash"></i>

                Delete

            </button>

        </div>

    `;


    /* Edit */

    card.querySelector(
        ".edit-category-btn"
    ).addEventListener(
        "click",
        function() {

            openEditModal(category);

        }
    );


    /* Delete */

    card.querySelector(
        ".delete-category-btn"
    ).addEventListener(
        "click",
        function() {

            deleteCategory(category.id);

        }
    );


    return card;

}


/* =========================================
   SEARCH CATEGORIES
========================================= */

function filterCategories() {

    const searchInput =
        document.getElementById(
            "category-search"
        );


    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    if (!searchTerm) {

        renderCategories(categories);

        return;

    }


    const filteredCategories =
        categories.filter(category => {

            return String(category.name || "")
                .toLowerCase()
                .includes(searchTerm);

        });


    renderCategories(filteredCategories);

}


/* =========================================
   OPEN ADD MODAL
========================================= */

function openAddModal() {

    editingCategoryId = null;


    const modal =
        document.getElementById(
            "category-modal"
        );

    const title =
        document.getElementById(
            "modal-title"
        );

    const form =
        document.getElementById(
            "category-form"
        );


    title.textContent =
        "Add Category";


    form.reset();


    document.getElementById(
        "category-icon"
    ).value = "fa-utensils";


    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================================
   OPEN EDIT MODAL
========================================= */

function openEditModal(category) {

    editingCategoryId =
        category.id;


    document.getElementById(
        "category-id"
    ).value = category.id;


    document.getElementById(
        "category-name"
    ).value = category.name;


    document.getElementById(
        "category-icon"
    ).value = category.icon;


    document.getElementById(
        "modal-title"
    ).textContent =
        "Edit Category";


    document.getElementById(
        "category-modal"
    ).classList.add("active");


    document.body.style.overflow = "hidden";

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeCategoryModal() {

    const modal =
        document.getElementById(
            "category-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove("active");

    document.body.style.overflow = "";

    editingCategoryId = null;

}


/* =========================================
   SAVE CATEGORY
========================================= */

function saveCategory(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "category-name"
        ).value.trim();


    const icon =
        document.getElementById(
            "category-icon"
        ).value;


    if (!name) {

        alert(
            "Please enter a category name."
        );

        return;

    }


    /*
     * Check for duplicate category names.
     */

    const duplicate =
        categories.some(category => {

            return (
                category.name.toLowerCase() ===
                name.toLowerCase() &&
                category.id !== editingCategoryId
            );

        });


    if (duplicate) {

        alert(
            "A category with this name already exists."
        );

        return;

    }


    /*
     * EDIT
     */

    if (editingCategoryId !== null) {

        const category =
            categories.find(
                item =>
                    item.id ===
                    editingCategoryId
            );


        if (category) {

            /*
             * If the category name changes,
             * update matching products too.
             */

            const oldName =
                category.name;


            category.name = name;

            category.icon = icon;


            if (
                oldName.toLowerCase() !==
                name.toLowerCase()
            ) {

                products.forEach(product => {

                    if (
                        String(product.category || "")
                            .toLowerCase() ===
                        oldName.toLowerCase()
                    ) {

                        product.category = name;

                    }

                });


                localStorage.setItem(
                    PRODUCTS_KEY,
                    JSON.stringify(products)
                );

            }

        }


        saveCategories();

        closeCategoryModal();

        filterCategories();

        alert(
            "Category updated successfully."
        );

        return;

    }


    /*
     * ADD
     */

    const newId =
        categories.length > 0
            ? Math.max(
                ...categories.map(
                    category =>
                        Number(category.id) || 0
                )
            ) + 1
            : 1;


    const newCategory = {

        id: newId,

        name: name,

        icon: icon

    };


    categories.push(newCategory);


    saveCategories();

    closeCategoryModal();

    filterCategories();


    alert(
        "Category added successfully."
    );

}


/* =========================================
   DELETE CATEGORY
========================================= */

function deleteCategory(id) {

    const category =
        categories.find(
            item => item.id === id
        );


    if (!category) {
        return;
    }


    const productCount =
        getProductCount(category.name);


    /*
     * Do not allow deletion if products
     * are currently using this category.
     */

    if (productCount > 0) {

        alert(
            `"${category.name}" contains ${productCount} product${productCount === 1 ? "" : "s"}. Move or edit those products before deleting this category.`
        );

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${category.name}"?`
        );


    if (!confirmed) {
        return;
    }


    categories =
        categories.filter(
            item => item.id !== id
        );


    saveCategories();

    filterCategories();


    alert(
        "Category deleted successfully."
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    const hamburger =
        document.querySelector(
            ".hamburger"
        );

    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );


    if (!hamburger || !mobileMenu) {
        return;
    }


    hamburger.addEventListener(
        "click",
        function(event) {

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
        .forEach(link => {

            link.addEventListener(
                "click",
                function() {

                    mobileMenu.classList.remove(
                        "mobile-menu-active"
                    );

                }
            );

        });

}


/* =========================================
   MODAL EVENTS
========================================= */

function setupModalEvents() {

    const modal =
        document.getElementById(
            "category-modal"
        );


    const closeButton =
        document.getElementById(
            "close-category-modal"
        );


    const cancelButton =
        document.getElementById(
            "cancel-category-btn"
        );


    const form =
        document.getElementById(
            "category-form"
        );


    const addButton =
        document.getElementById(
            "add-category-btn"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            openAddModal
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCategoryModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeCategoryModal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            saveCategory
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function(event) {

                if (event.target === modal) {

                    closeCategoryModal();

                }

            }
        );

    }

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        loadCategories();

        await loadProducts();

        renderCategories();

        setupModalEvents();

        setupMobileMenu();


        /* Search */

        const searchInput =
            document.getElementById(
                "category-search"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterCategories
            );

        }


        /* Escape key */

        document.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Escape") {

                    closeCategoryModal();

                }

            }
        );

    }
);