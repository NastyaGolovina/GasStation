// Elements for pump UI
const pumpIdEL = document.getElementById('pumpID');
const fuelLevelBarEl = document.getElementById('fuelLevel');
const fuelTypeEl = document.getElementById('fuelType');
const statusEl = document.getElementById('status');
const pumpListEl = document.getElementById('fuellist');

const errorMsgEl = document.getElementById('errorMsg');

let prevEl = null;

function activatePumpForm(isDisabled) {
    pumpIdEL.readOnly = true;
    fuelTypeEl.disabled = isDisabled;
    statusEl.disabled = isDisabled;
}

function fillInputEl(pumpID, fuelLevel, fuelType, status) {
    const level = Math.max(0, Math.min(parseInt(fuelLevel), 100));
    pumpIdEL.value = pumpID || '';
    fuelLevelBarEl.style.width = `${level}%`;
    fuelLevelBarEl.textContent = `${level}%`;
    fuelTypeEl.value = fuelType || '';
    statusEl.value = status || '';
}

function removeActiveClass() {
    if(prevEl !== null) {
        prevEl.classList.remove("active");
    }
}

function showError(message) {
    const errorMsgEl = document.getElementById('errorMsg');
    errorMsgEl.style.display = 'inline';
    errorMsgEl.innerText = message;
}

function addPumpToList(pumpID,fuelLevel ,fuelType,status,  i) {
    const aEl = document.createElement("a");
    const divHeader = document.createElement("div");
    const strongEl = document.createElement("strong");
    const divText = document.createElement("div");

    // Set dataset for click behavior
    aEl.dataset.pumpID = pumpID;
    aEl.dataset.fuelLevel = fuelLevel;
    aEl.dataset.fuelType = fuelType;
    aEl.dataset.status = status;

    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    strongEl.className = "mb";
    divText.className = "col-10 mb-1 small";

    strongEl.innerText = `Type: ${fuelType} | Status: ${status}`;
    divHeader.appendChild(strongEl);
    aEl.appendChild(divHeader);
    aEl.appendChild(divText);
    pumpListEl.appendChild(aEl);

    if (i === 0) {
        prevEl = aEl;
        prevEl.classList.add('active');
    }
}

fetch("DBErrorPumpJson.php")
    .then((response) => {
        return response.json();

    })
    .then((result) => {
        if(result.isError) {
            document.getElementById('errorMsg').style.display = 'inline';
            document.getElementById('errorMsg').innerText = "Something went wrong";
        }
    });

// Fetch and render pump list
fetch("pumpInfoJson.php")
    .then((response) => response.json())
    .then((result) => {
        let pumpInfo = result.pumpTable;
        console.log(pumpInfo);

        for (let i = 0; i < pumpInfo.length; i++) {
            addPumpToList(
                    pumpInfo[i].pumpID,
                    pumpInfo[i].fuelLevel,
                    pumpInfo[i].fuelType,
                    pumpInfo[i].status,
                i
            );
        }

        if (pumpInfo.length > 0) {
            fillInputEl(
                pumpInfo[0].pumpID,
                pumpInfo[0].fuelLevel,
                pumpInfo[0].fuelType,
                pumpInfo[0].status
            );
            activatePumpForm(true);
        }
    })
    .catch((err) => {
        console.error(err);
        showError("Server error occurred.");
    });


// Click to view pump details
pumpListEl.addEventListener("click", (event) => {
    let currentEl = event.target;
    while (currentEl && !currentEl.classList.contains("list-group-item")) {
        currentEl = currentEl.parentNode;
    }

    if (currentEl) {
        removeActiveClass();
        prevEl = currentEl;
        currentEl.classList.add("active");

        fillInputEl(
            currentEl.dataset.pumpID,
            currentEl.dataset.fuelLevel,
            currentEl.dataset.fuelType,
            currentEl.dataset.status
        );

        activatePumpForm(true); // Keep inputs readonly
    }
});