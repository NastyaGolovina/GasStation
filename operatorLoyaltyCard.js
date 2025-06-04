// Elements for form inputs
const loyaltyCardIdEL = document.getElementById('loyaltyCardID');
const customerIdEL = document.getElementById('customerID');
const pointsEL = document.getElementById('point');

const listEl = document.getElementById('loyaltyCardlist');
const formEl = document.getElementsByTagName("form")[0];

// Buttons for CRUD actions
const createBtn = document.getElementById('create');
const updateBtn = document.getElementById('update');
const deleteBtn = document.getElementById('delete');

let prevEl = null;
let prevIsCreate = false;
let customerIds = [];

function activateDeactivatedForm(isDisabled) {
    loyaltyCardIdEL.readOnly = true;
    customerIdEL.disabled = isDisabled;
    pointsEL.disabled = isDisabled;

}

function cleanInputEl() {
    loyaltyCardIdEL.value = "";
    customerIdEL.value = "";
    pointsEL.value = "";

}

function fillInputEl(loyaltyCardID,point, customerID ) {
    loyaltyCardIdEL.value = loyaltyCardID;
    pointsEL.value = point;
    customerIdEL.value = customerID;


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

function addOptions(parentEl, value, text) {
    const optionEl = document.createElement("option");
    optionEl.value = value;
    optionEl.innerText = text;
    parentEl.appendChild(optionEl);

}

function createSubmitBtn(btnName) {
    const btnEl = document.createElement("button");
    btnEl.className = "w-100 btn btn-primary btn-lg";
    btnEl.type = "button";
    btnEl.id = 'btn-submit';
    btnEl.innerText = btnName;
    formEl.appendChild(btnEl);

}

function addElInList( loyaltyCardId, point, customerId, customerName, i) {
    const aEl = document.createElement("a");
    const divHeader = document.createElement("div");
    const strongEl = document.createElement("strong");
    const divText = document.createElement("div");

    aEl.dataset.loyaltyCardId = loyaltyCardId;
    aEl.dataset.point= point;
    aEl.dataset.customerId = customerId;
    aEl.dataset.customerName = customerName;

    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    strongEl.className = "mb";
    divText.className = "col-10 mb-1 small";
    strongEl.innerText  = ` Points: ${point} | Customer: ${customerId}`;
    divHeader.appendChild(strongEl);
    aEl.appendChild(divHeader);
    aEl.appendChild(divText);
    listEl.appendChild(aEl);

    // If this is the first product, mark it as active
    if (i === 0) {
        prevEl = aEl;
        prevEl.classList.add('active');
    }
}

function removeErrorMessage() {
    loyaltyCardIdEL.classList.remove('is-invalid');
    customerIdEL.classList.remove('is-invalid');
    pointsEL.classList.remove('is-invalid');

}

function setInvalid(el, errorText) {
    el.classList.add('is-invalid');
    el.nextElementSibling.innerHTML = errorText;
}

// Initial error check
fetch("DBErrorLoyaltyCardJson.php")
    .then((response) => {
        return response.json();

    })
    .then((result) => {
        if(result.isError) {
            document.getElementById('errorMsg').style.display = 'inline';
            document.getElementById('errorMsg').innerText = "Something went wrong";
        }
    });

fetch("loyaltyCardInfoJson.php")
    .then((response) => response.json())
    .then((result) => {
        console.log(result);

        let customers = result.Customer;
        let loyaltyCardInfor = result.loyaltyCardTable;

        // Populate dropdown with customer names
        for (let i = 0; i < customers.length; i++) {
            addOptions(customerIdEL, customers[i].CustomerID, customers[i].Name);
        }

        //  Store customer IDs
        customerIds = loyaltyCardInfor.map(card => card.customerId);

        for (let i = 0; i < loyaltyCardInfor.length; i++) {
            addElInList(
                loyaltyCardInfor[i].loyaltyCardId,
                loyaltyCardInfor[i].point,
                loyaltyCardInfor[i].customerId,
                loyaltyCardInfor[i].customerName,
                i
            );
        }

        if (loyaltyCardInfor.length > 0) {
            fillInputEl(
                loyaltyCardInfor[0].loyaltyCardId,
                loyaltyCardInfor[0].point,
                loyaltyCardInfor[0].customerId

            );
            activateDeactivatedForm(true);

        }
    });

//create
createBtn.addEventListener('click', event => {
    prevIsCreate = true;
    removeErrorMessage();
    cleanInputEl();
    activateDeactivatedForm(false);
    removeBtn();
    createSubmitBtn('Create');
});

//update
updateBtn.addEventListener('click', () => {
    removeErrorMessage();
    if (prevEl) {
        activateDeactivatedForm(false);
        removeBtn();
        createSubmitBtn('Update');
        fillInputEl(
            prevEl.dataset.loyaltyCardId,
            prevEl.dataset.point,
            prevEl.dataset.customerId

        );
    } else {
        alert("You didn't choose anything. Choose a loyalty card to update.");
    }

});

//delete
deleteBtn.addEventListener('click', () => {
    console.log(prevIsCreate);
    if(prevIsCreate) {
        prevIsCreate = false;
    } else {
        console.log(prevIsCreate);
        removeErrorMessage();
        if(prevEl !== null) {
            removeBtn();
            activateDeactivatedForm(true);
            if (confirm("Do you want to delete this loyalty card?")) {
                fetch(`operatorLoyaltyCard.php?cardID=${prevEl.dataset.loyaltyCardId}&action=delete`, {
                    method: 'POST'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert("Loyalty card deleted successfully!");
                            location.reload();

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

// List item click for loyalty cards
listEl.addEventListener('click', event => {
    removeErrorMessage();
    activateDeactivatedForm(true);
    removeBtn();
    removeActiveClass();

    let currentEl = event.target;
    while (currentEl && !currentEl.classList.contains('list-group-item')) {
        currentEl = currentEl.parentNode;
    }

    if (!currentEl) return;

    prevEl = currentEl;
    currentEl.classList.add('active');

    fillInputEl(
        currentEl.dataset.loyaltyCardId,
        currentEl.dataset.point,
        currentEl.dataset.customerId

    );
});

//validation before submit
document.addEventListener('click', event => {
    removeErrorMessage();

    if (event.target.id === 'btn-submit') {
        const actionType = event.target.innerText.toLowerCase(); // 'create' or 'update'

        if (actionType === 'create' || actionType === 'update') {
            event.preventDefault();

            let isValid = true;

            const currentCustomerID = customerIdEL.value.trim();

            // customer ID validation
            if (!customerIdEL.value) {
                setInvalid(customerIdEL, 'Customer ID is required.');
                isValid = false;
            }
            // validation if this customer alr had card
            if (actionType === 'create' && customerIds.includes(currentCustomerID)) {
                setInvalid(customerIdEL, 'This customer already has a loyalty card.');
                isValid = false;
            }
            if (pointsEL.value === '' || pointsEL.value < 0) {
                setInvalid(pointsEL, 'Points must be a positive number.');
                isValid = false;
            }

            if (isValid) {
                const formData = new FormData();

                formData.append("CustomerID", currentCustomerID);
                formData.append("points", pointsEL.value);

                let url = `operatorLoyaltyCard.php?action=${actionType}`;
                if (actionType === 'update') {
                    url += `&cardID=${prevEl.dataset.loyaltyCardId}`;
                }

                fetch(url, {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert("Loyalty card saved successfully!");
                            location.reload();

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