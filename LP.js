const nameEl = document.getElementById("name");
const createFormBtn = document.getElementById("create");
const updateFormBtn = document.getElementById("update");
const deleteFormBtn = document.getElementById("delete");
const listEl = document.getElementById('LPlist');
const formEl = document.getElementsByTagName("form")[0];
let prevEl = null;
let prevIsCreate = false;

// Function to activate or deactivate form inputs
function activateDeactivatedForm(isDisabled) {
    nameEl.disabled = isDisabled;
}

// Clear form inputs
function cleanInputEl() {
    nameEl.value = "";
}

// Fill form with the current loyalty program data
function fillInputEl(name) {
    nameEl.value = name;
}

// Function to populate the list with loyalty program names
function addElInList(id, name, i) {
    const aEl = document.createElement("a");
    const divHeader = document.createElement("div");
    const strongEl = document.createElement("strong");

    aEl.dataset.dataLoyaltyProgramId = id;
    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    strongEl.className = "mb";
    strongEl.innerText = name;
    divHeader.appendChild(strongEl);
    aEl.appendChild(divHeader);
    listEl.appendChild(aEl);
    if(i === 0) {
        prevEl = aEl;
        prevEl.classList.add('active');
    }
}

// Function to remove the active class from the previous selected element
function removeActiveClass() {
    if(prevEl !== null) {
        prevEl.classList.remove("active");
    }
}

// Remove the submit button if it exists
function removeBtn() {
    if(document.getElementById('btn-submit') !== null) {
        document.getElementById('btn-submit').remove();
    }
}

// Create the submit button dynamically
function createBtn(btnName) {
    const btnEl = document.createElement("button");
    btnEl.className = "w-100 btn btn-primary btn-lg";
    btnEl.type = "button";
    btnEl.id = 'btn-submit';
    btnEl.innerText = btnName;
    formEl.appendChild(btnEl);
}

// Remove error messages and invalid styling
function removeErrorMassage() {
    nameEl.classList.remove('is-invalid');
}

// Set error message and invalid styling
function setInvalid(el, errorText) {
    el.classList.add('is-invalid');
    el.nextElementSibling.innerHTML = errorText;
}

fetch("DBErrorLoyaltyProgramJson.php")
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        if(result.isError) {
            document.getElementById('errorMsg').style.display = 'inline';
            document.getElementById('errorMsg').innerText = "Something went wrong";
        }
    });

fetch("usersInfoJson.php")
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        let loyaltyPrograms = result.LoyaltyProgramTable;

        // Populate the loyalty programs list
        for(let i = 0; i < loyaltyPrograms.length; i++) {
            addElInList(loyaltyPrograms[i].LoyaltyProgramID, loyaltyPrograms[i].Name, i);
        }

        // Fill the form with the data of the first loyalty program
        if(loyaltyPrograms.length > 0) {
            fillInputEl(loyaltyPrograms[0].Name);
        }

        // Handle Create button
        createFormBtn.addEventListener('click', event => {
            prevIsCreate = true;
            removeErrorMassage();
            cleanInputEl();
            activateDeactivatedForm(false);
            removeBtn();
            createBtn('Create');
        });

        // Handle Update button
        updateFormBtn.addEventListener('click', event => {
            removeErrorMassage();
            if(prevEl !== null) {
                activateDeactivatedForm(false);
                removeBtn();
                createBtn('Update');
                fillInputEl(prevEl.querySelector('strong').innerText);
            } else {
                alert("You didn't choose anything. Choose a loyalty program to update.");
            }
        });

        // Handle Delete button
        deleteFormBtn.addEventListener('click', () => {
            if(prevEl) {
                removeErrorMassage();
                removeBtn();
                activateDeactivatedForm(true);
                if (confirm("Do you want to delete this loyalty program?")) {
                    window.location.href = `LP.php?lp_id=${prevEl.dataset.dataLoyaltyProgramId}&action=delete`;
                }
            } else {
                alert("You didn't choose anything. Choose a loyalty program to delete.");
            }
        });

        // Handle list item click (selecting loyalty program)
        listEl.addEventListener('click', event => {
            removeErrorMassage();
            activateDeactivatedForm(true);
            removeBtn();
            removeActiveClass();
            let currentEl = event.target;
            while(!currentEl.classList.contains('list-group-item')) {
                currentEl = currentEl.parentNode;
            }
            prevEl = currentEl;
            currentEl.classList.add('active');
            fillInputEl(currentEl.querySelector('strong').innerText);
        });

        // Handle form submission (Create or Update)
        document.addEventListener('click', event => {
            let nameFlag = true;
            removeErrorMassage();
            if(event.target.id === 'btn-submit') {
                if(event.target.innerText === 'Create' || event.target.innerText === 'Update') {
                    event.preventDefault();
                    if(nameEl.value !== '' && nameEl.value.length <= 100) {
                        formEl.method = "post";
                        if(event.target.innerText === 'Update') {
                            formEl.action = `LP.php?lp_id=${prevEl.dataset.dataLoyaltyProgramId}&action=update`;
                        } else {
                            formEl.action = `LP.php?action=create`;
                        }
                        formEl.submit();
                    } else {
                        setInvalid(nameEl, 'Name must be between 1 and 100 characters.');
                    }
                }
            }
        });
    });
