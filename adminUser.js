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

let userTable = [];

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

function fillForm(currentEl,users,customers) {
    let lProgramID = '';
    for(let i = 0; i < users.length; i++) {
        if(users[i].UserID === currentEl.dataset.dataUserId) {
            if(users[i].Permission === "CUSTOMER") {
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
    btnEl.type = "submit";
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
        if(users.length > 0) {
            fillForm(prevEl, users, customers);
        }
        for(let j = 0 ; j < permissions.length; j++) {
            addOptions(permissionEl, permissions[j].PermissionID,  permissions[j].PermissionID);
        }
        for(let k = 0 ; k < loyaltyProgram.length; k++) {
            addOptions(loyaltyEl, loyaltyProgram[k].LoyaltyProgramID,  loyaltyProgram[k].Name);
        }




        createFormBtn.addEventListener('click', event => {
            // removeActiveClass()
            // prevEl = null;
            cleanInputEl();
            activateDeactivatedForm(false);
            removeBtn();
            createBtn('Create');
        });


        updateFormBtn.addEventListener('click', event => {
            if(prevEl !== null) {
                activateDeactivatedForm(false);
                removeBtn();
                createBtn('Update');
                if(nameEl.value === '') {
                    fillForm(prevEl,users,customers);
                }
            }  else {
                alert("You didn't choose nothing. Choose element ti update");
            }


        });



        deleteFormBtn.addEventListener('click', event => {
            if(prevEl !== null) {
                removeBtn();
                activateDeactivatedForm(true);
            } else  {
                alert("You didn't choose nothing. Choose element to delete");
            }
        });



        listEl.addEventListener('click', event => {
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
                        loyaltyEl.disabled = true;
                    }
                }
            }
        });





        // document.addEventListener('click', event => {
        //     if(event.target.id === 'btn-submit') {
        //         if(event.target.innerText === 'Create') {
        //             event.preventDefault();
        //             console.log(formEl.getElementsByTagName("input")[0].value);
        //             console.log(nameEl.value);
        //             // const md_id = 123;
        //
        //             // formEl.method = "post";
        //             // formEl.action = `login.php?md_id=${md_id}`;
        //             // formEl.submit();
        //         }
        //     }
        // });
    });



