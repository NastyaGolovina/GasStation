const nameEl = document.getElementById("name");
const addressEl = document.getElementById("address");
const nifEl = document.getElementById("nif");
const emailEl = document.getElementById("email");
const loginEl = document.getElementById("login");
const passwordEl = document.getElementById("password");
const statusEl = document.getElementById("status");
const loyaltyEl = document.getElementById("loyalty-program");
const createFormBtn = document.getElementById("create");
const updateFormBtn = document.getElementById("update");
const deleteFormBtn = document.getElementById("delete");
const listEl = document.getElementById('userlist');
const permissionEl = document.getElementById("permission")
const formEl = document.getElementsByTagName("form")[0];
let prevEl = null;

function activateDeactivatedForm(isDisabled) {
    nameEl.disabled = isDisabled;
    addressEl.disabled = isDisabled;
    nifEl.disabled = isDisabled;
    emailEl.disabled = isDisabled;
    loginEl.disabled = isDisabled;
    passwordEl.disabled = isDisabled;
    statusEl.disabled = isDisabled;
    // loyaltyEl.disabled = isDisabled;
    permissionEl.disabled = isDisabled;
}


function cleanInputEl() {
    nameEl.value = "";
    addressEl.value = "";
    nifEl.value = "";
    emailEl.value = "";
    loginEl.value = "";
    passwordEl.value = "";
    statusEl.checked = false;
    permissionEl.value = '';
}


function fillInputEl(name,address, nif , email, login, password, status, permission , loyaltyprogram) {
    nameEl.value = name;
    addressEl.value = address;
    nifEl.value = nif;
    emailEl.value = email;
    loginEl.value = login;
    passwordEl.value = password;
    statusEl.checked = status;
    permissionEl.value = permission;
    loyaltyEl.value = loyaltyprogram;
}

function removeBtn() {
    if(document.getElementById('btn-submit') !== null) {
        document.getElementById('btn-submit').remove();
    }
}
function removeActiveClass() {
    if(prevEl !== null) {
        prevEl.classList.remove("active");
    }
}
function createBtn(btnName) {
    const btnEl = document.createElement("button");
    btnEl.className = "w-100 btn btn-primary btn-lg";
    btnEl.type = "submit";
    btnEl.id = 'btn-submit';
    btnEl.innerText = btnName;
    formEl.appendChild(btnEl);

}

console.log(listEl.childNodes);
console.log(formEl);

createFormBtn.addEventListener('click', event => {
    // removeActiveClass()
    // prevEl = null;
    cleanInputEl();
    activateDeactivatedForm(false);
    removeBtn();
    createBtn('Create');
})
updateFormBtn.addEventListener('click', event => {
    cleanInputEl();
    activateDeactivatedForm(false);
    removeBtn();
    createBtn('Update');
})
deleteFormBtn.addEventListener('click', event => {
    removeBtn();
})

listEl.addEventListener('click', event => {
    removeBtn();
    removeActiveClass();
    let currentEl = event.target;
    while(!currentEl.classList.contains('list-group-item')) {
        currentEl = currentEl.parentNode;
    }
    prevEl = currentEl;
    console.log(currentEl);
    currentEl.classList.add('active');

})

loyaltyEl.addEventListener('click', event => {
    if(document.getElementById('btn-submit') !== null) {
        if(loyaltyEl.value === 'CUSTOMER') {
            loyaltyEl.disabled = false;
        }
    }
    loyaltyEl.disabled = true;
})
