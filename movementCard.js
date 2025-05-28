const tableContainer = document.getElementById('table-container');
const tableBody = document.getElementById('table-body');
const  alertEl = document.getElementById('alertMsg');
const  alertMsgTextEl = document.getElementById('alertMsgText');


function addTableRow(movementCardID,date, points, customer, loyaltyCard, prize, loyaltyProgram,sale){
    const rowEl = document.createElement("tr");

    const movementCardIDTdEl = document.createElement('td')
    movementCardIDTdEl.innerText = movementCardID;
    rowEl.appendChild(movementCardIDTdEl);

    const dateTdEl = document.createElement('td')
    dateTdEl.innerText = date;
    rowEl.appendChild(dateTdEl);

    const pointsTdEl = document.createElement('td')
    pointsTdEl.innerText = points;
    rowEl.appendChild(pointsTdEl);

    const customerTdEl = document.createElement('td')
    customerTdEl.innerText = customer;
    rowEl.appendChild(customerTdEl);

    const loyaltyCardTdEl = document.createElement('td')
    loyaltyCardTdEl.innerText = loyaltyCard;
    rowEl.appendChild(loyaltyCardTdEl);

    const prizeTdEl = document.createElement('td')
    prizeTdEl.innerText = prize;
    rowEl.appendChild(prizeTdEl);

    const loyaltyProgramEl = document.createElement('td')
    loyaltyProgramEl.innerText = loyaltyProgram;
    rowEl.appendChild(loyaltyProgramEl);

    const saleTdEl = document.createElement('td')
    saleTdEl.innerText = sale;
    rowEl.appendChild(saleTdEl);


    tableBody.appendChild(rowEl)
}

fetch("movementCard.php")
    .then((response) => {
        return response.json();

    })
    .then((result) => {
        const movementCard = result.movement_card;
        console.log(Array.isArray(movementCard)  && movementCard.length > 0 )
        console.log(movementCard !== undefined)
        console.log(movementCard)
        if(movementCard.length > 0) {
            if(movementCard.length !== 1 || movementCard[0].MovementCardID !== undefined) {
                tableContainer.classList.remove('d-none');
                for(let i = 0; i < movementCard.length; i++) {
                    addTableRow(movementCard[i].MovementCardID, movementCard[i].Date, movementCard[i].PointsQnt,
                        movementCard[i].CustomerName, movementCard[i].LoyaltyCardID ,movementCard[i].PrizeProduct,
                        movementCard[i].LoyaltyProgramName, movementCard[i].SaleID);
                }
            } else {
                alertEl.style.display = 'block';
                alertMsgTextEl.innerText = "You don't have any movement on your card";
            }

        } else {
            alertEl.style.display = 'block';
            alertMsgTextEl.innerText = "You don't have any movement on your card";
        }
    });