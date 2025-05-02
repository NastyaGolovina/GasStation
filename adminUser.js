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
    loyaltyEl.disabled = true;
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
    loyaltyEl.value = '';
}


function fillInputEl(name,address, nif , email, login, password, status, permission , loyaltyProgram) {
    nameEl.value = name;
    addressEl.value = address;
    nifEl.value = nif;
    emailEl.value = email;
    loginEl.value = login;
    passwordEl.value = password;
    statusEl.checked = +status;
    permissionEl.value = permission;
    loyaltyEl.value = loyaltyProgram;
}

function fillForm(currentEl,users,customers) {
    let lProgramID = '';
    for(let i = 0; i < users.length; i++) {
        if(users[i].UserID === currentEl.dataset.dataUserId) {
            if(users[i].PermissionID === "CUSTOMER") {
                for(let j = 0; j < customers.length ; j++) {
                    if(customers[j].UserID === users[i].UserID) {
                        lProgramID = customers[j].LoyaltyProgramID;
                    }
                }
            }
            fillInputEl(users[i].Name,users[i].Address, users[i].NIF, users[i].Email, users[i].Login,
                users[i].Password, users[i].Status, users[i].PermissionID , lProgramID);
        }
    }
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
    btnEl.type = "button";
    btnEl.id = 'btn-submit';
    btnEl.innerText = btnName;
    formEl.appendChild(btnEl);

}

function addElInList(id, name, login, i) {
    const aEl = document.createElement("a");
    const divHeader = document.createElement("div");
    const strongEl = document.createElement("strong");
    const divText = document.createElement("div");

    aEl.dataset.dataUserId = id;
    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    strongEl.className = "mb";
    divText.className = 'col-10 mb-1 small'
    strongEl.innerText = name;
    divHeader.appendChild(strongEl);
    divText.innerText = login;
    aEl.appendChild(divHeader);
    aEl.appendChild(divText);
    listEl.appendChild(aEl);
    if(i === 0) {
        prevEl = aEl;
        prevEl.classList.add('active');
    }
    // <a href="#" className="list-group-itemlist-group-item-actionpy-3lh-sm">
    //     <divclass="d-flexw-100align-items-centerjustify-content-between">
    //         <strongclass="mb-1">Listgroupitemheading</strong>
    //         <small>Tues</small>
    //     </div>
    //     <divclass="col-10mb-1small">Someplaceholdercontentinaparagraphbelowtheheadinganddate.</div>
    // </a>

}

function addOptions(parentEl, value, text) {
    const optionEl = document.createElement("option");
    optionEl.value = value;
    optionEl.innerText = text;
    parentEl.appendChild(optionEl);

}

function removeErrorMassage() {
    nameEl.classList.remove('is-invalid');
    addressEl.classList.remove('is-invalid');
    nifEl.classList.remove('is-invalid');
    emailEl.classList.remove('is-invalid');
    loginEl.classList.remove('is-invalid');
    passwordEl.classList.remove('is-invalid');
    statusEl.classList.remove('is-invalid');
    permissionEl.classList.remove('is-invalid');
    loyaltyEl.classList.remove('is-invalid');
}


function setInvalid(el, errorText) {
    el.classList.add('is-invalid');
    el.nextElementSibling.innerHTML = errorText;
}
fetch("DBErrorUserJson.php")
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
        let users = result.userTable;
        let permissions = result.permissionTable;
        let customers = result.customerTable;
        let loyaltyProgram = result.LoyaltyProgramTable;
        console.log(users);
        console.log(permissions);
        console.log(customers);
        console.log(loyaltyProgram);

        for(let i = 0 ; i < users.length ; i++) {
            addElInList(users[i].UserID, users[i].Name, users[i].Login, i);
        }
        for(let j = 0 ; j < permissions.length; j++) {
            addOptions(permissionEl, permissions[j].PermissionID,  permissions[j].PermissionID);
        }
        for(let k = 0 ; k < loyaltyProgram.length; k++) {
            addOptions(loyaltyEl, loyaltyProgram[k].LoyaltyProgramID,  loyaltyProgram[k].Name);
        }
        if(users.length > 0) {
            fillForm(prevEl, users, customers);
        }




        createFormBtn.addEventListener('click', event => {
            // removeActiveClass()
            // prevEl = null;
            removeErrorMassage();
            cleanInputEl();
            activateDeactivatedForm(false);
            removeBtn();
            createBtn('Create');
        });


        updateFormBtn.addEventListener('click', event => {
            removeErrorMassage();
            if(prevEl !== null) {
                activateDeactivatedForm(false);
                if(permissionEl.value === "CUSTOMER") {
                    loyaltyEl.disabled = false;
                }
                removeBtn();
                createBtn('Update');
                if(nameEl.value === '') {
                    fillForm(prevEl,users,customers);
                    if(permissionEl.value === "CUSTOMER") {
                        loyaltyEl.disabled = false;
                    }
                }
            }  else {
                alert("You didn't choose nothing. Choose element ti update");
            }


        });



        deleteFormBtn.addEventListener('click', async event => {
            removeErrorMassage();
            if(prevEl !== null) {
                removeBtn();
                activateDeactivatedForm(true);
                if(nameEl.value === '') {
                    await fillForm(prevEl,users,customers);
                }
                if (confirm("Do you want to delete this user?")) {
                    window.location.href = `adminUser.php?user_id=${prevEl.dataset.dataUserId}&action=delete`;
                }
            } else  {
                alert("You didn't choose nothing. Choose element to delete");
            }
        });



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
            console.log(currentEl);
            currentEl.classList.add('active');
            fillForm(currentEl,users,customers);

        });




        document.addEventListener('change', event => {
            if(document.getElementById('btn-submit') !== null) {
                if(event.target.id === 'permission') {
                    if(event.target.value === "CUSTOMER" ) {
                        loyaltyEl.disabled = false;
                    } else {
                        loyaltyEl.value = '';
                        loyaltyEl.disabled = true;
                    }
                }
            }
        });





        document.addEventListener('click', event => {
            let loginFlag = true;
            removeErrorMassage();
            if(event.target.id === 'btn-submit') {
                if(event.target.innerText === 'Create' || event.target.innerText === 'Update') {
                    event.preventDefault();
                    if(nameEl.value !== '' && nameEl.value.length <= 100) {
                        if(addressEl.value !== '' && addressEl.value.length <= 255) {
                            console.log(typeof nifEl.value);
                            if(nifEl.value.length === 9 && typeof +nifEl.value === "number" &&  !nifEl.value.includes('.')) {
                                if(emailEl.value.length <= 100 && emailEl.value.includes('@')) {
                                    for (let i = 0 ; i < users.length; i++) {
                                        if(users[i].Login === loginEl.value) {
                                            if(event.target.innerText === 'Update') {
                                                if(users[i].UserID !== prevEl.dataset.dataUserId) {
                                                    loginFlag = false;
                                                    break;
                                                }
                                            } else {
                                                loginFlag = false;
                                            }
                                            break;
                                        }
                                    }
                                    if (loginFlag === true && loginEl.value !== '' && nameEl.value.length <= 30) {
                                        if(passwordEl.value.length <= 30 && passwordEl.value !== '') {
                                            if(permissionEl.value !== '') {
                                                if((permissionEl.value === 'CUSTOMER' && loyaltyEl.value !== "") || (permissionEl.value !== 'CUSTOMER')) {
                                                    formEl.method = "post";
                                                    if(event.target.innerText === 'Update') {
                                                        formEl.action = `adminUser.php?user_id=${prevEl.dataset.dataUserId}&action=update`;
                                                    } else {
                                                        formEl.action = `adminUser.php?action=create`;
                                                    }
                                                    formEl.submit();
                                                } else {
                                                    setInvalid(loyaltyEl,"Set Loyalty Program");
                                                }
                                            } else {
                                                setInvalid(permissionEl,"Set Permission");
                                            }
                                        } else  {
                                            setInvalid(passwordEl,"Password no more then 30 symbols");
                                        }
                                    } else {
                                        setInvalid(loginEl,"Login must be unique and no more then 30 symbols");
                                    }
                                } else {
                                    setInvalid(emailEl, 'Email is name@example.com (no more then 100 symbols)');
                                }
                            } else {
                                setInvalid(nifEl, 'NIF is nine-digit number');
                            }
                        } else {
                            setInvalid(addressEl, 'Address length from 1 to 255 symbols');
                        }
                    } else {
                        setInvalid(nameEl, 'Name length from 1 to 100 symbols');
                    }
                }
            }
        });
    });



