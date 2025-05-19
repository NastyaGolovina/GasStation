// Elements for form inputs
const productNameEl = document.getElementById('productname');
const priceEL = document.getElementById('price');
const stockEL = document.getElementById('stock');
const descriptionEL = document.getElementById('desc');
const typeEL = document.getElementById('type');
typeEL.addEventListener('change', updateConditionalFields);
const expirationDateEL = document.getElementById('expiration-date');
const minStockEL = document.getElementById('min-stock');
const listEl = document.getElementById('productlist');
const formEl = document.getElementsByTagName("form")[0];

// Buttons for CRUD actions
const createBtn = document.getElementById('create');
const updateBtn = document.getElementById('update');
const deleteBtn = document.getElementById('delete');

let prevEl = null;
let prevIsCreate = false;

function activateDeactivatedForm(isDisabled) {
    productNameEl.disabled = isDisabled;
    priceEL.disabled = isDisabled;
    stockEL.disabled = isDisabled;
    descriptionEL.disabled = isDisabled;
    typeEL.disabled = isDisabled;
    expirationDateEL.disabled = isDisabled;
    minStockEL.disabled = isDisabled;
}

function cleanInputEl() {
    productNameEl.value = "";
    priceEL.value = "";
    stockEL.value = "";
    descriptionEL.value = "";
    typeEL.value = "";
    expirationDateEL.value = '';
    minStockEL.value = '';
}

function fillInputEl(productName, price, stock, description, type, expirationDate, minStock) {
    productNameEl.value = productName;
    priceEL.value = price;
    stockEL.value = stock;
    descriptionEL.value = description;

    // ✅ Normalize and match type case-insensitively
    if (type && typeof type === 'string') {
        const normalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

        // Find matching option (case-insensitive)
        const match = Array.from(typeEL.options).find(
            opt => opt.value.toLowerCase() === normalized.toLowerCase()
        );

        typeEL.value = match ? match.value : '';
    } else {
        typeEL.value = '';
    }

    expirationDateEL.value = expirationDate || '';
    minStockEL.value = minStock || '';

    updateConditionalFields();
}



function addElInList(id, name, price, stock, description, type,expirationDate,minStock, i) {
    const aEl = document.createElement("a");
    const divHeader = document.createElement("div");
    const strongEl = document.createElement("strong");
    const divText = document.createElement("div");

    aEl.dataset.dataProductName = name;
    aEl.dataset.dataProductPrice = price;
    aEl.dataset.dataProductStock = stock;
    aEl.dataset.dataProductDescription = description;
    aEl.dataset.dataProductType = type;
    aEl.dataset.dataProductInforId = id;
    aEl.dataset.dataProductExpirationDate = expirationDate;
    aEl.dataset.dataProductMinStock = minStock;

    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    strongEl.className = "mb";
    divText.className = "col-10 mb-1 small";

    strongEl.innerText = name;
    divHeader.appendChild(strongEl);
    divText.innerText = description; // fixed from undefined 'login' to 'description'
    aEl.appendChild(divHeader);
    aEl.appendChild(divText);
    listEl.appendChild(aEl);

    // If this is the first product, mark it as active
    if (i === 0) {
        prevEl = aEl;
        prevEl.classList.add('active');
    }
}

function removeBtn() {
    const existing = document.getElementById('btn-submit');
    if (existing) {
        existing.remove();
    }
}

function removeActiveClass() {
    if(prevEl !== null) {
        prevEl.classList.remove("active");
    }
}

function createSubmitBtn(btnName) {
    const btnEl = document.createElement("button");
    btnEl.className = "w-100 btn btn-primary btn-lg";
    btnEl.type = "button";
    btnEl.id = 'btn-submit';
    btnEl.innerText = btnName;
    formEl.appendChild(btnEl);

}

function removeErrorMessage() {
    productNameEl.classList.remove('is-invalid');
    priceEL.classList.remove('is-invalid');
    stockEL.classList.remove('is-invalid');
    descriptionEL.classList.remove('is-invalid');
    typeEL.classList.remove('is-invalid');
}

function setInvalid(el, errorText) {
    el.classList.add('is-invalid');
    el.nextElementSibling.innerHTML = errorText;
}

// Initial error check
fetch("DBErrorProductJson.php")
    .then((response) => {
        return response.json();

    })
    .then((result) => {
        if(result.isError) {
            document.getElementById('errorMsg').style.display = 'inline';
            document.getElementById('errorMsg').innerText = "Something went wrong";
        }
    });

fetch("productInfoJson.php")
    .then((response) => response.json())
    .then((result) => {
        let productInfor = result.productInforTable;
        console.log(productInfor);

        for (let i = 0; i < productInfor.length; i++) {
            addElInList(
                productInfor[i].productInforID,
                productInfor[i].ProductName,
                productInfor[i].Price,
                productInfor[i].Stock,
                productInfor[i].Description,
                productInfor[i].Type,
                productInfor[i].ExpirationDate,
                productInfor[i].MinStock,
                i
            );
        }

        if (productInfor.length > 0) {
                fillInputEl(
                    productInfor[0].ProductName,
                    productInfor[0].Price,
                    productInfor[0].Stock,
                    productInfor[0].Description,
                    productInfor[0].Type,
                    productInfor[0].ExpirationDate,
                    productInfor[0].MinStock
        );
            updateConditionalFields();

        }
    });

//create
createBtn.addEventListener('click', event => {
    prevIsCreate = true;
    removeErrorMessage();
    cleanInputEl();
    activateDeactivatedForm(false);
    updateConditionalFields();
    removeBtn();
    createSubmitBtn('Create');
});

//update
updateBtn.addEventListener('click', event => {
    removeErrorMessage(); // Clear any visible error

    if (prevEl !== null) {
        activateDeactivatedForm(false); // Enable form fields

        // Enable expiration date only for product types
        if (typeEL.value === "Product") {
            expirationDateEL.disabled = false;
        }
        removeBtn();
        createSubmitBtn('Update');

        if (prevIsCreate) {
            prevIsCreate = false;
            fillInputEl(
                prevEl.dataset.dataProductName,
                prevEl.dataset.dataProductPrice,
                prevEl.dataset.dataProductStock,
                prevEl.dataset.dataProductDescription,
                prevEl.dataset.dataProductType,
                prevEl.dataset.dataProductExpirationDate,
                prevEl.dataset.dataProductMinStock
            );
        }

    } else {
        alert("You didn't choose anything. Please select a product to update.");
    }
});

//delete
deleteBtn.addEventListener('click', () => {
    console.log(prevIsCreate);
    if(prevIsCreate) {
     prevIsCreate = false;
       window.location.reload();
    } else {
        console.log(prevIsCreate);
        removeErrorMessage();
       if(prevEl !== null) {
          removeBtn();
          activateDeactivatedForm(true);
            if (confirm("Do you want to delete this product?")) {
                fetch(`operatorProduct.php?product_id=${prevEl.dataset.dataProductInforId}&action=delete`, {
                    method: 'POST'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert("Product deleted successfully!");
                            window.location.reload();
                        } else {
                            alert(data.error || "Failed to delete product.");
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        alert("Server error occurred.");
                    });
           }
        } else  {
            alert("You didn't choose nothing. Choose element to delete");
        }
    }
});

// List item click
listEl.addEventListener('click', event => {
    removeErrorMessage();
    activateDeactivatedForm(true);
    removeBtn();
    removeActiveClass();

    let currentEl = event.target;
    while (!currentEl.classList.contains('list-group-item')) {
        currentEl = currentEl.parentNode;
    }

    prevEl = currentEl;
    currentEl.classList.add('active');

    fillInputEl (
        currentEl.dataset.dataProductName,
        currentEl.dataset.dataProductPrice,
        currentEl.dataset.dataProductStock,
        currentEl.dataset.dataProductDescription,
        currentEl.dataset.dataProductType,
        currentEl.dataset.dataProductExpirationDate,
        currentEl.dataset.dataProductMinStock
    );

});

//Type dropdown
function updateConditionalFields() {
    const selectedType = typeEL.value;

    if (selectedType === "Product") {
        expirationDateEL.disabled = false;
        minStockEL.disabled = true;
    } else if (selectedType === "Fuel") {
        minStockEL.disabled = false;
        expirationDateEL.disabled = true;
    } else {
        expirationDateEL.disabled = true;
        minStockEL.disabled = true;
    }
}

//document.addEventListener('change', event => {
//         if (event.target.id === 'type') {
//             const selectedType = event.target.value;
//
//             if (selectedType === "Product") {
//                 expirationDateEL.disabled = false;
//                 minStockEL.disabled = true;
//                 minStockEL.value = '';
//             } else if (selectedType === "Fuel") {
//                 minStockEL.disabled = false;
//                 expirationDateEL.disabled = true;
//                 expirationDateEL.value = '';
//             } else {
//                 // Reset both if something else is selected
//                 expirationDateEL.disabled = true;
//                 expirationDateEL.value = '';
//                 minStockEL.disabled = true;
//                 minStockEL.value = '';
//             }
//             }
// });

//validation before submit
    document.addEventListener('click', event => {
        removeErrorMessage();

        if (event.target.id === 'btn-submit') {
            const actionType = event.target.innerText.toLowerCase(); // 'create' or 'update'

            if (actionType === 'create' || actionType === 'update') {
                event.preventDefault();

                let isValid = true;

                // Product name validation
                if (!productNameEl.value || productNameEl.value.length > 100) {
                    setInvalid(productNameEl, 'Name must be between 1 and 100 characters.');
                    isValid = false;
                }

                // Description validation
                if (descriptionEL.value.length > 350) {
                    setInvalid(descriptionEL, 'Description must be 350 characters or less.');
                    isValid = false;
                }

                // Price validation
                if (priceEL.value === '' || priceEL.value < 0) {
                    setInvalid(priceEl, 'Price must be a positive number.');
                    isValid = false;
                }

                // Stock validation
                if (stockEL.value === '' || stockEL.value < 0) {
                    setInvalid(stockEL, 'Stock must be a positive number.');
                    isValid = false;
                }

                // Type validation
                if (typeEL.value !== 'Fuel' && typeEL.value !== 'Product') {
                    setInvalid(typeEl, 'Choose a valid type.');
                    isValid = false;
                }

                // Conditional validation
                if (typeEL.value === 'Fuel') {
                    if (minStockEL.value === '' || minStockEL.value < 0) {
                        setInvalid(minStockEl, 'Set a valid minimum stock value.');
                        isValid = false;
                    }
                } else if (typeEL.value === 'Product') {
                    if (!expirationDateEL.value) {
                        setInvalid(expirationDateEL, 'Set a valid expiration date.');
                        isValid = false;
                    }
                }

                if (isValid) {
                    const formData = new FormData();
                    formData.append("productname", productNameEl.value);
                    formData.append("price", priceEL.value);
                    formData.append("stock", stockEL.value);
                    formData.append("description", descriptionEL.value);
                    formData.append("type", typeEL.value);
                    formData.append("expirationDate", expirationDateEL.value);
                    formData.append("minStock", minStockEL.value);

                    let url = `operatorProduct.php?action=${actionType}`;
                    if (actionType === 'update') {
                        url += `&product_id=${prevEl.dataset.dataProductInforId}`;
                    }

                    fetch(url, {
                        method: 'POST',
                        body: formData
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                alert("Product saved successfully!");
                                cleanInputEl();
                                activateDeactivatedForm(true);
                                removeBtn();
                            } else {
                                alert(data.error || "Operation failed.");
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            alert("Server error occurred.");
                        });
                }
            }
        }
    });

