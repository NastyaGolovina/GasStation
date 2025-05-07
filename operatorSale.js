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
let prevIsUpdate = false;
let prevPointQty = 0;

let cards = [];



function activateDeactivatedForm(isDisabled) {
    saleIdEl.readOnly = true;
    dateEl.disabled = isDisabled;
    customerEl.disabled = isDisabled;
    totalAmountEl.readOnly = true;
    cardIdEl.readOnly = true;
    loyaltyEl.readOnly = true;
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
    prevPointQty = '';
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
    prevPointQty = pointQty;
    prizeEl.value = prize;
}


function fillForm(currentEl,sale,customer, item, products) {

    lProgram = '';
    for(let i = 0; i < sale.length ; i++) {
        if(currentEl.dataset.SaleId === sale[i].SaleID) {
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
        if(currentEl.dataset.SaleId === item[k].SaleID) {
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

    aEl.dataset.SaleId = saleId;
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

function removeCards() {
    for(let i = 0 ; i < cards.length ; i++) {
        cards[i].remove();
    }
    cards = [];
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
    cardEl.dataset.cardId=id;
    // cardEl.dataset.card = "itemCard"
    cardEl.className = 'card m-3';
    cardEl.style.width = '18rem';
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';


    const inputCardIdEl = document.createElement("input");
    inputCardIdEl.type = "hidden";
    inputCardIdEl.name ="cardId[]";
    inputCardIdEl.value = id;


    const labelQtyEl = document.createElement("label");
    labelQtyEl.append('Quantity');
    labelQtyEl.className = "col-12 form-label";
    const  inputQtyEl = document.createElement("input");
    inputQtyEl.type = "text";
    inputQtyEl.className = "form-control";
    inputQtyEl.name ="qty[]";
    inputQtyEl.value = qty;
    inputQtyEl.readOnly = disabled;
    const divQtyInvalid = document.createElement("div");
    divQtyInvalid.className = "invalid-feedback";

    labelQtyEl.appendChild(inputQtyEl);
    labelQtyEl.appendChild(divQtyInvalid);


    const labelPriceEl = document.createElement("label");
    labelPriceEl.className = "col-12 form-label";
    labelPriceEl.append('Price');
    const inputPriceEl = document.createElement("input");
    inputPriceEl.type = "text";
    inputPriceEl.name ="price[]";
    inputPriceEl.value = price;
    // inputPriceEl.disabled = true;
    inputPriceEl.readOnly = true;
    inputPriceEl.className = "form-control";
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


    cardBody.appendChild(inputCardIdEl);
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

// function deleteBtnFromCard() {
//     for(let i = 0 ; i < cards.length ; i++) {
//         cards[i].querySelector('button[data-idBtn="item-btn"]')[0].remove();
//     }
// }

function fillCustomerCard(selectEl, customer) {
    for(let a = 0 ; a < customer.length ; a++) {
        console.log(selectEl.value);
        console.log(customer[a].CustomerID);
        if(selectEl.value === customer[a].CustomerID) {
            if(customer[a].LoyaltyCardID !== null) {
                pointQtyEl.disabled = false;
                pointQtyEl.dataset.pointQty = customer[a].Points;
                prizeEl.disabled = false;
                cardIdEl.value = customer[a].LoyaltyCardID;
                loyaltyEl.value = customer[a].lpName;
                loyaltyEl.dataset.lpId = customer[a].LoyaltyProgramID;
            }
        }
    }
}




function validateDate() {
    if(dateEl.value !== '') {
        return true;
    }
    setInvalid(dateEl, 'Select date');
    return  false;
}

function validateCustomer() {
    if(customerEl.value !== '') {
        return true;
    }
    setInvalid(customerEl, 'Select customer');
    return  false;
}

function validateMovementCard() {
    if(cardIdEl.value !== '') {
        if(validatePointQtyEl()) {
            if(+pointQtyEl.value > 0 && prizeEl.value === '') {
                return true;
            } else if(+pointQtyEl.value > 0 && prizeEl.value !== '') {
                setInvalid(prizeEl, "'If you add points to card you can't select prize");
                return false;
            } else if(+pointQtyEl.value < 0 && prizeEl.value !== '') {
                return true;
            } else {
                setInvalid(prizeEl, 'If you subtract points to card select prize');
                return false;
            }
        } else {
            return  false;
        }
    } else {
        return true;
    }
}

function validatePointQtyEl() {
    if(cardIdEl.value !== '') {
        if(pointQtyEl.value !== '' && typeof +pointQtyEl.value === "number" &&  !pointQtyEl.value.includes('.')) {
            return true;
        } else {
            setInvalid(pointQtyEl, 'Add point quantity');
            return  false;
        }
    } else {
        return true
    }
}

function pointQtyValidation() {
    if(cardIdEl.value !== '') {
        if(validatePointQtyEl()) {
            if(+pointQtyEl.value < 0) {
                if((+pointQtyEl.dataset.pointQty + +pointQtyEl.value) > 0) {
                        return true
                } else {
                    setInvalid(pointQtyEl, `Your current balance is ${pointQtyEl.dataset.pointQty}`);
                    return  false;
                }
            } else {
                return true;
            }
        } else {
            return  false;
        }
    } else {
        return true;
    }
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
            removeCards();
            prevIsCreate = true;
            prevIsUpdate = false;
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
                    let isValid = true;
                    let itemCost = 0;
                    let selectProduct = cards[cards.length - 1].getElementsByTagName("select")[0];
                    selectProduct.classList.remove('is-invalid');
                    let qty = cards[cards.length - 1].querySelector('input[name="qty[]"]');
                    qty.classList.remove('is-invalid');
                    isValid = validateProduct(selectProduct) && isValid;
                    isValid =  validateQty(qty) && isValid;
                    if(isValid) {
                        let price = cards[cards.length - 1].querySelector('input[name="price[]"]');
                        for(let l = 0; l < product.length; l++) {
                            if(selectProduct.value === product[l].ProductID) {
                                itemCost = cards[cards.length - 1].querySelector('input[name="qty[]"]').value * product[l].ProductID;
                            }
                        }
                        price.value = itemCost;
                        totalAmountEl.value = + totalAmountEl.value + +itemCost;
                        e.target.remove();
                        qty.readOnly = true;
                        selectProduct.disabled = true;
                        addBtnToCard(cards[cards.length - 1],'Delete')
                        cardDisplay('inline');
                    }
                } else if (e.target.innerText === 'Delete') {
                    if(confirm("Do you want to delete this user?")) {
                        const currentCard = e.target.parentElement.parentElement;
                        totalAmountEl.value = +totalAmountEl.value - +currentCard.querySelector('input[name="price[]"]').value;
                        currentCard.remove();
                        cards.splice(cards.indexOf(currentCard), 1);
                    }


                }
            }
        })




        updateFormBtn.addEventListener('click', event => {
            prevIsUpdate = true;
            removeErrorMassage();
            cardDisplay('inline');
            if(prevEl !== null) {
                activateDeactivatedForm(false);
                removeBtn();
                createBtn('Update');
                fillCustomerCard(customerEl, customer);
                if(prevIsCreate) {
                    removeCards();
                    prevIsCreate = false;
                    fillForm(prevEl,sale,customer, item, product);
                    fillCustomerCard(customerEl, customer);
                }
                for(let f = 0 ; f < cards.length ; f++) {
                    addBtnToCard(cards[f],'Delete');
                }
            }  else {
                alert("You didn't choose anything. Choose element ti update");
            }


        });




        deleteFormBtn.addEventListener('click', () => {
            if(prevIsCreate || prevIsUpdate) {
                prevIsUpdate = false;
                prevIsCreate = false;
                window.location.reload();
            } else {
                removeErrorMassage();
                if(prevEl !== null) {
                    removeBtn();
                    activateDeactivatedForm(true);
                    if (confirm("Do you want to delete this user?")) {
                        window.location.href = `operatorSale.php?action=delete&sale_id=${prevEl.dataset.SaleId}`;
                    }
                } else  {
                    alert("You didn't choose nothing. Choose element to delete");
                }
            }
        });



        listEl.addEventListener('click', event => {
            cardDisplay('none');
            removeCards();
            prevIsCreate = false;
            prevIsUpdate = false;
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
            if (event.target === customerEl) {
                pointQtyEl.disabled = true;
                prizeEl.disabled = true;
                cardIdEl.value = '';
                loyaltyEl.value = '';
                loyaltyEl.dataset.lpId = '';
                pointQtyEl.value = '';
                prizeEl.value = '';
                if(document.getElementById('btn-submit') !== null) {

                    fillCustomerCard(event.target, customer);
                }
            }
        });









    document.addEventListener('click',event=>{
        removeErrorMassage();
        if(event.target.id==='btn-submit'){
            if(event.target.innerText==='Create'||event.target.innerText==='Update'){
                event.preventDefault();

                let isValid=true;
                isValid=validateDate()&&isValid;
                isValid=validateCustomer()&&isValid;
                isValid=validateMovementCard()&&isValid;
                isValid = pointQtyValidation() && isValid;


                if(isValid){
                    formEl.method="post";
                    const lpId= loyaltyEl.dataset.lpId !== undefined ? loyaltyEl.dataset.lpId : -1;
                    if(event.target.innerText==='Update'){
                        console.log('a');
                        formEl.action=`operatorSale.php?sale_id=${prevEl.dataset.SaleId}&action=update&lp_id=${lpId}&
                        prev_point_qty=${prevPointQty}`;
                    }else{
                        formEl.action=`operatorSale.php?action=create&lp_id=${lpId}`;
                    }
                    for(let j = 0 ; j < cards.length ; j++) {
                        cards[j].getElementsByTagName("select")[0].disabled = false;
                    }
                    formEl.submit();
                }
            }
        }
    });





    });

fetch("DBErrorOperatorSale.php")
    .then((response) => {
        return response.json();

    })
    .then((result) => {
        if(result.isError) {
            document.getElementById('errorMsg').style.display = 'inline';
            document.getElementById('errorMsg').innerText = "Something went wrong";
        }
    });
