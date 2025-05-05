const nameEl = document.getElementById("name");
const descEl = document.getElementById("description");
const createFormBtn = document.getElementById("create");
const updateFormBtn = document.getElementById("update");
const deleteFormBtn = document.getElementById("delete");
const listEl = document.getElementById("LPlist");
const formEl = document.getElementsByTagName("form")[0];
let prevEl = null;
let prevIsCreate = false;

function activateDeactivatedForm(isDisabled) {
    nameEl.disabled = isDisabled;
    descEl.disabled = isDisabled;
}

function cleanInputEl() {
    nameEl.value = "";
    descEl.value = "";
}

function fillInputEl(name, description) {
    nameEl.value = name;
    descEl.value = description;
}

function addElInList(id, name, description, i) {
    const aEl = document.createElement("a");
    const divHeader = document.createElement("div");
    const strongEl = document.createElement("strong");

    aEl.dataset.dataLoyaltyProgramId = id;
    aEl.dataset.dataLoyaltyProgramName = name;
    aEl.dataset.dataLoyaltyProgramDesc = description;

    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    strongEl.className = "mb";
    strongEl.innerText = name;
    divHeader.appendChild(strongEl);
    aEl.appendChild(divHeader);
    listEl.appendChild(aEl);

    if (i === 0) {
        prevEl = aEl;
        prevEl.classList.add('active');
    }
}

function removeActiveClass() {
    if (prevEl !== null) {
        prevEl.classList.remove("active");
    }
}

function removeBtn() {
    const existing = document.getElementById('btn-submit');
    if (existing) existing.remove();
}

function createBtn(btnName) {
    const btnEl = document.createElement("button");
    btnEl.className = "w-100 btn btn-primary btn-lg";
    btnEl.type = "button";
    btnEl.id = 'btn-submit';
    btnEl.innerText = btnName;
    formEl.appendChild(btnEl);
}

function removeErrorMassage() {
    nameEl.classList.remove('is-invalid');
}

function setInvalid(el, errorText) {
    el.classList.add('is-invalid');
    el.nextElementSibling.innerHTML = errorText;
}

function fetchAndRenderLoyaltyPrograms() {
    fetch("usersInfoJson.php")
        .then(response => response.json())
        .then(result => {
            listEl.innerHTML = "";
            let loyaltyPrograms = result.LoyaltyProgramTable;

            for (let i = 0; i < loyaltyPrograms.length; i++) {
                addElInList(
                    loyaltyPrograms[i].LoyaltyProgramID,
                    loyaltyPrograms[i].Name,
                    loyaltyPrograms[i].Description,
                    i
                );
            }

            if (loyaltyPrograms.length > 0) {
                fillInputEl(loyaltyPrograms[0].Name, loyaltyPrograms[0].Description);
            }
        });
}

// Initial error check
fetch("DBErrorLoyaltyProgramJson.php")
    .then(res => res.json())
    .then(result => {
        if (result.isError) {
            document.getElementById('errorMsg').style.display = 'inline';
            document.getElementById('errorMsg').innerText = "Something went wrong";
        }
    });

// Initial list fetch
fetchAndRenderLoyaltyPrograms();

// Create
createFormBtn.addEventListener('click', () => {
    prevIsCreate = true;
    removeErrorMassage();
    cleanInputEl();
    activateDeactivatedForm(false);
    removeBtn();
    createBtn('Create');
});

// Update
updateFormBtn.addEventListener('click', () => {
    removeErrorMassage();
    if (prevEl) {
        activateDeactivatedForm(false);
        removeBtn();
        createBtn('Update');
        fillInputEl(
            prevEl.dataset.dataLoyaltyProgramName,
            prevEl.dataset.dataLoyaltyProgramDesc
        );
    } else {
        alert("You didn't choose anything. Choose a loyalty program to update.");
    }
});

// Delete
deleteFormBtn.addEventListener('click', () => {
    if (prevEl) {
        removeErrorMassage();
        removeBtn();
        activateDeactivatedForm(true);
        if (confirm("Do you want to delete this loyalty program?")) {
            fetch(`LP.php?lp_id=${prevEl.dataset.dataLoyaltyProgramId}&action=delete`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        fetchAndRenderLoyaltyPrograms();
                        cleanInputEl();
                    } else {
                        alert(data.error || "Delete failed.");
                    }
                });
        }
    } else {
        alert("You didn't choose anything. Choose a loyalty program to delete.");
    }
});

// List item click
listEl.addEventListener('click', event => {
    removeErrorMassage();
    activateDeactivatedForm(true);
    removeBtn();
    removeActiveClass();

    let currentEl = event.target;
    while (!currentEl.classList.contains('list-group-item')) {
        currentEl = currentEl.parentNode;
    }

    prevEl = currentEl;
    currentEl.classList.add('active');

    fillInputEl(
        currentEl.dataset.dataLoyaltyProgramName,
        currentEl.dataset.dataLoyaltyProgramDesc
    );
});

// Submit (Create/Update)
document.addEventListener('click', event => {
    removeErrorMassage();
    if (event.target.id === 'btn-submit') {
        event.preventDefault();

        if (nameEl.value && nameEl.value.length <= 100) {
            const formData = new FormData();
            formData.append("name", nameEl.value);
            formData.append("description", descEl.value);

            const actionType = event.target.innerText.toLowerCase();
            let url = `LP.php?action=${actionType}`;
            if (actionType === 'update') {
                url += `&lp_id=${prevEl.dataset.dataLoyaltyProgramId}`;
            }

            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        fetchAndRenderLoyaltyPrograms();
                        cleanInputEl();
                        activateDeactivatedForm(true);
                        removeBtn();
                    } else {
                        alert(data.error || "Operation failed.");
                    }
                });
        } else {
            setInvalid(nameEl, 'Name must be between 1 and 100 characters.');
        }
    }
});
