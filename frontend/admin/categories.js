let categories = [];
let products = [];
let editingCategoryId = null;


/* =========================================
   LOAD CATEGORIES FROM BACKEND
========================================= */

async function loadCategories() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/categories"
        );

        if (!response.ok) {

            throw new Error(
                `Could not load categories: ${response.status}`
            );

        }

        const data = await response.json();

        categories = data.map(category => ({

            id: category.categoryId,

            name: category.categoryName,

            icon: getCategoryIcon(
                category.categoryName
            )

        }));

    }

    catch (error) {

        console.error(
            "Error loading categories from backend:",
            error
        );

        categories = [];

    }

}


/* =========================================
   CATEGORY ICONS
========================================= */

function getCategoryIcon(categoryName) {

    const icons = {

        "Burgers": "fa-burger",

        "Pizza": "fa-pizza-slice",

        "Chicken": "fa-drumstick-bite",

        "Sandwiches": "fa-bread-slice",

        "Pasta": "fa-bowl-food",

        "Snacks": "fa-cookie-bite"

    };

    return icons[categoryName] || "fa-utensils";

}


/* =========================================
   LOAD PRODUCTS FROM BACKEND
========================================= */

async function loadProducts() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/food-items"
        );

        if (!response.ok) {

            throw new Error(
                `Could not load products: ${response.status}`
            );

        }

        const data = await response.json();

        products = data.map(product => ({

            id: product.foodId,

            name: product.foodName,

            categoryId: product.categoryId,

            category: getCategoryName(
                product.categoryId
            ),

            isAvailable: product.isAvailable

        }));

    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        products = [];

    }

}


/* =========================================
   GET CATEGORY NAME
========================================= */

function getCategoryName(categoryId) {

    const category =
        categories.find(
            item =>
                Number(item.id) ===
                Number(categoryId)
        );

    return category
        ? category.name
        : "";

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

function renderCategories(
    categoryData = categories
) {

    const categoryList =
        document.getElementById(
            "category-list"
        );

    const emptyCategories =
        document.getElementById(
            "empty-categories"
        );

    const categoryCount =
        document.getElementById(
            "category-count"
        );


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

        categoryList.style.display =
            "none";

        if (emptyCategories) {

            emptyCategories.style.display =
                "block";

        }

        return;

    }


    categoryList.style.display =
        "grid";


    if (emptyCategories) {

        emptyCategories.style.display =
            "none";

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
        document.createElement(
            "article"
        );

    card.className =
        "category-card";


    const productCount =
        getProductCount(
            category.name
        );


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

            deleteCategory(
                category.id
            );

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
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    if (!searchTerm) {

        renderCategories(
            categories
        );

        return;

    }


    const filteredCategories =
        categories.filter(
            category => {

                return String(
                    category.name || ""
                )
                    .toLowerCase()
                    .includes(searchTerm);

            }
        );


    renderCategories(
        filteredCategories
    );

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
    ).value =
        "fa-utensils";


    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   OPEN EDIT MODAL
========================================= */

function openEditModal(category) {

    editingCategoryId =
        category.id;


    document.getElementById(
        "category-id"
    ).value =
        category.id;


    document.getElementById(
        "category-name"
    ).value =
        category.name;


    document.getElementById(
        "category-icon"
    ).value =
        category.icon;


    document.getElementById(
        "modal-title"
    ).textContent =
        "Edit Category";


    document.getElementById(
        "category-modal"
    ).classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

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


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    editingCategoryId =
        null;

}


/* =========================================
   ADD / EDIT CATEGORY
========================================= */

async function saveCategory() {

    const name =
        document.getElementById(
            "category-name"
        ).value.trim();


    if (!name) {

        alert(
            "Please enter a category name."
        );

        return;

    }


    try {

        let response;


        /* =================================
           EDIT EXISTING CATEGORY
        ================================= */

        if (
            editingCategoryId !== null
        ) {

            response = await fetch(

                `http://localhost:8080/api/categories/${editingCategoryId}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            categoryName:
                                name

                        })

                }

            );

        }


        /* =================================
           ADD NEW CATEGORY
        ================================= */

        else {

            response = await fetch(

                "http://localhost:8080/api/categories",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            categoryName:
                                name

                        })

                }

            );

        }


        /* =================================
           CHECK BACKEND RESPONSE
        ================================= */

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Backend error:",
                errorText
            );


            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const savedCategory =
            await response.json();


        console.log(
            "Category saved to database:",
            savedCategory
        );


        /* =================================
           RELOAD FROM MYSQL
        ================================= */

        await loadCategories();

        await loadProducts();


        renderCategories();


        closeCategoryModal();


        alert(

            editingCategoryId !== null

                ? "Category updated successfully."

                : "Category added successfully."

        );

    }


    catch (error) {

        console.error(
            "Error saving category:",
            error
        );


        alert(
            "Could not save the category to the database."
        );

    }

}


/* =========================================
   DELETE CATEGORY
========================================= */

async function deleteCategory(id) {

    const category =
        categories.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!category) {

        return;

    }


    /* =================================
       CHECK PRODUCTS
    ================================= */

    const productCount =
        getProductCount(
            category.name
        );


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


    /* =================================
       CONFIRM DELETE
    ================================= */

    const confirmed =
        confirm(

            `Are you sure you want to delete "${category.name}"?`

        );


    if (!confirmed) {

        return;

    }


    try {

        /* =================================
           DELETE FROM MYSQL
        ================================= */

        const response =
            await fetch(

                `http://localhost:8080/api/categories/${id}`,

                {

                    method: "DELETE"

                }

            );


        /* =================================
           CHECK RESPONSE
        ================================= */

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Backend delete error:",
                errorText
            );


            throw new Error(
                `Server returned ${response.status}`
            );

        }


        /* =================================
           RELOAD FROM MYSQL
        ================================= */

        await loadCategories();

        await loadProducts();


        /* =================================
           KEEP SEARCH FILTER
        ================================= */

        filterCategories();


        alert(
            "Category deleted successfully."
        );

    }


    catch (error) {

        console.error(
            "Error deleting category:",
            error
        );


        alert(
            "Could not delete the category from the database."
        );

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

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


    if (
        !hamburger ||
        !mobileMenu
    ) {

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
                hamburger.querySelector(
                    "i"
                );


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
            link => {

                link.addEventListener(
                    "click",
                    function() {

                        mobileMenu.classList.remove(
                            "mobile-menu-active"
                        );

                    }
                );

            }
        );

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

                if (
                    event.target === modal
                ) {

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

        await loadCategories();


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

                if (
                    event.key === "Escape"
                ) {

                    closeCategoryModal();

                }

            }
        );

    }
);
