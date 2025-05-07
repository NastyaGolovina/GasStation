const saleIdEl = document.getElementById("sale-id");
const dateEl = document.getElementById("date");
const customerEl = document.getElementById("customer");
const totalAmountEl = document.getElementById("total-amount");
const itemListEl = document.getElementById("itemList");
const cardIdEl = document.getElementById("card-id");
const loyaltyEl = document.getElementById("loyalty-program");
const pointQtyEl = document.getElementById("point-qty");
const prizeEl = document.getElementById("prize");

const createFormBtn = document.getElementById("create");
const updateFormBtn = document.getElementById("update");
const deleteFormBtn = document.getElementById("delete");

const listEl = document.getElementById('saleList');
const formEl = document.getElementsByTagName("form")[0];

const addCardEl = document.getElementById('addCard');

let prevEl = null;
let prevIsCreate = false;

let cards = [];



function activateDeactivatedForm(isDisabled) {
    saleIdEl.disabled = true;
    dateEl.disabled = isDisabled;
    customerEl.disabled = isDisabled;
    totalAmountEl.disabled = true;
    cardIdEl.disabled = true;
    loyaltyEl.disabled = true;
    pointQtyEl.disabled = true;
    prizeEl.disabled = true;
}

function removeErrorMassage() {
    saleIdEl.classList.remove('is-invalid');
    dateEl.classList.remove('is-invalid');
    customerEl.classList.remove('is-invalid');
    totalAmountEl.classList.remove('is-invalid');
    cardIdEl.classList.remove('is-invalid');
    loyaltyEl.classList.remove('is-invalid');
    pointQtyEl.classList.remove('is-invalid');
    prizeEl.classList.remove('is-invalid');
}


function cleanInputEl() {
    saleIdEl.value = "";
    dateEl.value = "";
    customerEl.value = "";
    totalAmountEl.value = "0";
    cardIdEl.value = "";
    loyaltyEl.value = "";
    loyaltyEl.dataset.lpId = '';
    pointQtyEl.value = '';
    prizeEl.value = '';
}

function fillInputEl(saleId,date, customer , totalAmount, cardId, pointQty, prize, loyaltyProgram , lpid) {
    saleIdEl.value = saleId;
    dateEl.value = date;
    customerEl.value = customer;
    totalAmountEl.value = totalAmount;
    cardIdEl.value = cardId;
    loyaltyEl.value = loyaltyProgram;
    loyaltyEl.dataset.lpId = lpid;
    pointQtyEl.value = pointQty;
    prizeEl.value = prize;
}


function fillForm(currentEl,sale,customer, item, products) {

    lProgram = '';
    for(let i = 0; i < sale.length ; i++) {
        if(currentEl.dataset.dataSaleId === sale[i].SaleID) {
            if(sale[i].MovementCardID !== null) {
                for(let j = 0; j < customer.length ; j++) {
                    if(sale[i].LoyaltyProgramID === customer[j].LoyaltyProgramID) {
                        lProgram = customer[j].lpName;
                    }
                }
                fillInputEl(sale[i].SaleID, sale[i].Date , sale[i].CustomerID, sale[i].TotalAmount, sale[i].LoyaltyCardID,
                    sale[i].PointsQnt, sale[i].PrizeProductID, lProgram, sale[i].LoyaltyProgramID);
            } else {
                console.log( sale[i].CustomerID);
                fillInputEl(sale[i].SaleID, sale[i].Date , sale[i].CustomerID, sale[i].TotalAmount,
                    '', '', '', '');
            }
        }
    }

    for(let  k = 0 ; k < item.length; k++) {
        if(currentEl.dataset.dataSaleId === item[k].SaleID) {
            createCard(item[k].ItemID ,item[k].Qty , item[k].Price, item[k].ProductID, true, products);
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


function addElInList(saleId, date, i) {
    const aEl = document.createElement("a");
    const divHeader = document.createElement("div");
    const strongEl = document.createElement("strong");
    const divText = document.createElement("div");

    aEl.dataset.dataSaleId = saleId;
    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    strongEl.className = "mb";
    divText.className = 'col-10 mb-1 small'
    strongEl.innerText = `№ ${saleId}`;
    divHeader.appendChild(strongEl);
    divText.innerText = date;
    aEl.appendChild(divHeader);
    aEl.appendChild(divText);
    listEl.appendChild(aEl);
    if(i === 0) {
        prevEl = aEl;
        prevEl.classList.add('active');
    }
}

function addOptions(parentEl, value, text) {
    const optionEl = document.createElement("option");
    optionEl.value = value;
    optionEl.innerText = text;
    parentEl.appendChild(optionEl);

}

function removeCard() {
    for(let i = 0 ; i < cards.length ; i++) {
        cards[i].remove();
    }
}

function cardDisplay(display) {
    addCardEl.style.display = display;
}


function setInvalid(el, errorText) {
    el.classList.add('is-invalid');
    el.nextElementSibling.innerHTML = errorText;
}


function createCard(id, qty , price, product, disabled, products) {
    const cardEl = document.createElement("div");
    cardEl.dataset.cardid=id;
    // cardEl.dataset.card = "itemCard"
    cardEl.className = 'card m-3';
    cardEl.style.width = '18rem';
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const labelQtyEl = document.createElement("label");
    labelQtyEl.append('Quantity');
    labelQtyEl.className = "col-12 form-label";
    const  inputQtyEl = document.createElement("input");
    inputQtyEl.type = "text";
    inputQtyEl.className = "form-control";
    inputQtyEl.name ="qty[]";
    inputQtyEl.value = qty;
    inputQtyEl.disabled = disabled;
    const divQtyInvalid = document.createElement("div");
    divQtyInvalid.className = "invalid-feedback";

    labelQtyEl.appendChild(inputQtyEl);
    labelQtyEl.appendChild(divQtyInvalid);


    const labelPriceEl = document.createElement("label");
    labelPriceEl.className = "col-12 form-label";
    labelPriceEl.append('Price');
    const inputPriceEl = document.createElement("input");
    inputPriceEl.type = "text";
    inputPriceEl.className = "form-control";
    inputPriceEl.name ="price[]";
    inputPriceEl.value = price;
    inputPriceEl.disabled = true;
    const divPriceInvalid = document.createElement("div");
    divPriceInvalid.className = "invalid-feedback";

    labelPriceEl.appendChild(inputPriceEl);
    labelPriceEl.appendChild(divPriceInvalid);


    const labelProductEl = document.createElement("label");
    labelProductEl.append('Product');
    labelProductEl.className = "col-12 form-label";
    const selectEl = document.createElement("select");
    selectEl.className = "form-control";
    selectEl.name = "product[]";
    selectEl.disabled = disabled;
    addOptions(selectEl, '',  "Choose...");
    for(let j = 0 ; j < products.length; j++) {
        addOptions(selectEl, products[j].ProductID,  products[j].Name);
    }

    selectEl.value = product;
    const divProductInvalid = document.createElement("div");
    divProductInvalid.className = "invalid-feedback";

    labelProductEl.appendChild(selectEl);
    labelProductEl.appendChild(divProductInvalid);



    cardBody.appendChild(labelProductEl);
    cardBody.appendChild(labelQtyEl);
    cardBody.appendChild(labelPriceEl);

    cardEl.appendChild(cardBody);

    if (itemListEl.children.length > 1) {
        itemListEl.insertBefore(cardEl, itemListEl.children[1]);
    } else {
        itemListEl.appendChild(cardEl);
    }

    // itemListEl.appendChild(cardEl);

    cards.push(cardEl);
}
function addBtnToCard(card, name) {
    const  btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.type = 'button';
    btn.innerText = name;
    btn.dataset.idBtn = "item-btn";
    card.querySelector(".card-body").appendChild(btn);
}


function validateProduct(el) {
    if(el.value !== '') {
       return true
    }
    setInvalid(el, 'Select product for item');
    return  false;
}

function validateQty(el) {
    if(el.value !== '' && typeof +el.value === "number" &&  !el.value.includes('.') && +el.value >= 0) {
        return true
    }
    setInvalid(el, 'Put quantity of product');
    return  false;
}

fetch("saleInfoJson.php")
    .then((response) => {
        return response.json();

    })
    .then((result) => {
        console.log(result);
        let customer = result.Customer;
        let sale = result.Sale;
        let item = result.Item;
        let product = result.Product;

        for(let i = 0 ; i < sale.length ; i++) {
            addElInList( sale[i].SaleID,  sale[i].Date, i);
        }
        for(let j = 0 ; j < customer.length; j++) {
            addOptions(customerEl, customer[j].CustomerID,  customer[j].Name);
        }
        for(let j = 0 ; j < product.length; j++) {
            addOptions(prizeEl, product[j].ProductID,  product[j].Name);
        }

        if(sale.length > 0) {
            fillForm(prevEl,sale,customer, item, product);
        }





        createFormBtn.addEventListener('click', event => {
            removeCard();
            prevIsCreate = true;
            removeErrorMassage();
            cleanInputEl();
            activateDeactivatedForm(false);
            removeBtn();
            createBtn('Create');
            cardDisplay('inline');
        });

        addCardEl.addEventListener('click', e => {
            createCard('', '', '', '', false, product);
            addBtnToCard(cards[cards.length - 1],'Ok');
            cardDisplay('none');
        });

        document.addEventListener('click' , e => {

            if(e.target.dataset.idBtn === "item-btn") {
                if(e.target.innerText === 'Ok') {
                    let itemCost = 0;
                    let selectProduct = cards[cards.length - 1].getElementsByTagName("select")[0];
                    selectProduct.classList.remove('is-invalid');
                    let qty = cards[cards.length - 1].querySelector('input[name="qty[]"]');
                    qty.classList.remove('is-invalid');
                    if(validateProduct(selectProduct) && validateQty(qty)) {
                        let price = cards[cards.length - 1].querySelector('input[name="price[]"]');
                        for(let l = 0; l < product.length; l++) {
                            if(selectProduct.value === product[l].ProductID) {
                                itemCost = cards[cards.length - 1].querySelector('input[name="qty[]"]').value * product[l].ProductID;
                            }
                        }
                        price.value = itemCost;
                        totalAmountEl.value = + totalAmountEl.value + +itemCost;
                        e.target.remove();
                        addBtnToCard(cards[cards.length - 1],'Delete')
                        cardDisplay('inline');
                    }
                }
            }
        })




        updateFormBtn.addEventListener('click', event => {
            removeErrorMassage();
            if(prevEl !== null) {
                activateDeactivatedForm(false);
                // if(permissionEl.value === "CUSTOMER") {
                //     loyaltyEl.disabled = false;
                // }
                removeBtn();
                createBtn('Update');
                if(prevIsCreate) {
                    prevIsCreate = false;
                    // fillForm(prevEl,users,customers);
                    // if(permissionEl.value === "CUSTOMER") {
                    //     loyaltyEl.disabled = false;
                    // }
                }
            }  else {
                alert("You didn't choose nothing. Choose element ti update");
            }


        });




        deleteFormBtn.addEventListener('click', () => {
            console.log(prevIsCreate);
            if(prevIsCreate) {
                prevIsCreate = false;
                window.location.reload();
            } else {
                console.log(prevIsCreate);
                removeErrorMassage();
                if(prevEl !== null) {
                    removeBtn();
                    activateDeactivatedForm(true);
                    // if (confirm("Do you want to delete this user?")) {
                    //     window.location.href = `adminUser.php?user_id=${prevEl.dataset.dataUserId}&action=delete`;
                    // }
                } else  {
                    alert("You didn't choose nothing. Choose element to delete");
                }
            }
        });



        listEl.addEventListener('click', event => {
            cardDisplay('none');
            removeCard();
            prevIsCreate = false;
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
            fillForm(currentEl,sale,customer, item, product);

        });

        document.addEventListener('change', event => {
            pointQtyEl.disabled = true;
            prizeEl.disabled = true;
            cardIdEl.value = '';
            loyaltyEl.value = '';
            loyaltyEl.dataset.lpId = '';
            if(document.getElementById('btn-submit') !== null) {
                for(let a = 0 ; a < customer.length ; a++) {
                    if(event.target.value === customer[a].CustomerID) {
                        if(customer[a].LoyaltyCardID !== null) {
                            pointQtyEl.disabled = false;
                            prizeEl.disabled = false;
                            cardIdEl.value = customer[a].LoyaltyCardID;
                            loyaltyEl.value = customer[a].lpName;
                            loyaltyEl.dataset.lpId = customer[a].LoyaltyProgramID;
                        }
                    }
                }
            }
        });




    })