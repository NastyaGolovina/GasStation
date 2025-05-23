const nameEl = document.getElementById("name");
const descEl = document.getElementById("des");
const statusEl = document.getElementById("status");
const durationEl = document.getElementById("duration");
const priorityEl = document.getElementById("priority");


const createFormBtn = document.getElementById("create");
const updateFormBtn = document.getElementById("update");
const deleteFormBtn = document.getElementById("delete");
const listEl = document.getElementById("Servicelist");
const formEl = document.querySelector("form.needs-validation");

let prevEl = null;

function activateDeactivatedForm(isDisabled) {
    nameEl.disabled = isDisabled;
    descEl.disabled = isDisabled;
    statusEl.disabled = isDisabled;
    durationEl.disabled = isDisabled;
    priorityEl.disabled = isDisabled;

}

function cleanInputEl() {
    nameEl.value = "";
    descEl.value = "";
    statusEl.checked = false;
    durationEl.value = "";
    priorityEl.value = "";

}

function fillInputEl(name, description, status,duration,priority) {
    nameEl.value = name;
    descEl.value = description;
    statusEl.checked = status === "1";
    durationEl.value = duration;
    priorityEl.value = priority;

}

function addElInList(id, name, description, status,duration,priority, i) {
    const aEl = document.createElement("a");
    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    aEl.dataset.serviceId = id;
    aEl.dataset.serviceName = name;
    aEl.dataset.serviceDesc = description;
    aEl.dataset.serviceStatus = status;
    aEl.dataset.serviceDuration = duration;
    aEl.dataset.servicePriority = priority;


    const divHeader = document.createElement("div");
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    const strongEl = document.createElement("strong");
    strongEl.innerText = name;
    divHeader.appendChild(strongEl);
    aEl.appendChild(divHeader);
    listEl.appendChild(aEl);

    if (i === 0) {
        prevEl = aEl;
        prevEl.classList.add("active");
    }
}

function removeActiveClass() {
    if (prevEl !== null) {
        prevEl.classList.remove("active");
    }
}

function removeBtn() {
    const existing = document.getElementById("btn-submit");
    if (existing) existing.remove();
}

function createBtn(btnName) {
    const btnEl = document.createElement("button");
    btnEl.className = "w-100 btn btn-primary btn-lg";
    btnEl.type = "button";
    btnEl.id = "btn-submit";
    btnEl.innerText = btnName;
    formEl.appendChild(btnEl);
}

function removeErrorMessages() {
    [nameEl, descEl].forEach(el => {
        el.classList.remove("is-invalid");
        el.nextElementSibling.innerText = "";
    });
}

function setInvalid(el, errorText) {
    el.classList.add("is-invalid");
    el.nextElementSibling.innerText = errorText;
}

function fetchAndRenderServices() {
    fetch("servicesInfoJson.php")
        .then(response => response.json())
        .then(result => {
            listEl.innerHTML = "";
            const services = result.ServiceTable;
            services.forEach((service, i) => {
                addElInList(service.ServiceID, service.Name, service.Description, service.Status,service.Duration,service.Priority, i);
            });
            if (services.length > 0) {
                fillInputEl(services[0].Name, services[0].Description, services[0].Status,services[0].Duration,services[0].Priority);
            }
        });
}

fetch("DBErrorServiceJson.php")
    .then(res => res.json())
    .then(result => {
        if (result.isError) {
            const errorMsg = document.getElementById("errorMsg");
            errorMsg.style.display = "block";
            errorMsg.innerText = "Something went wrong";
        }
    });

fetchAndRenderServices();

createFormBtn.addEventListener("click", () => {
    removeErrorMessages();
    formEl.classList.remove("was-validated");
    cleanInputEl();
    activateDeactivatedForm(false);
    removeBtn();
    createBtn("Create");
});

updateFormBtn.addEventListener("click", () => {
    removeErrorMessages();
    if (prevEl) {
        activateDeactivatedForm(false);
        removeBtn();
        createBtn("Update");
        fillInputEl(prevEl.dataset.serviceName, prevEl.dataset.serviceDesc, prevEl.dataset.serviceStatus,prevEl.dataset.serviceDuration,prevEl.dataset.servicePriority);
    } else {
        alert("You didn't choose anything. Choose a service to update.");
    }
});

deleteFormBtn.addEventListener("click", () => {
    if (prevEl) {
        removeErrorMessages();
        removeBtn();
        activateDeactivatedForm(true);
        if (confirm("Do you want to delete this service?")) {
            fetch(`Service.php?service_id=${prevEl.dataset.serviceId}&action=delete`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        fetchAndRenderServices();
                        cleanInputEl();
                    } else {
                        alert(data.error || "Delete failed.");
                    }
                });
        }
    } else {
        alert("You didn't choose anything. Choose a service to delete.");
    }
});

listEl.addEventListener("click", event => {
    removeErrorMessages();
    formEl.classList.remove("was-validated");
    activateDeactivatedForm(true);
    removeBtn();
    removeActiveClass();

    let currentEl = event.target;
    while (!currentEl.classList.contains("list-group-item")) {
        currentEl = currentEl.parentNode;
    }

    prevEl = currentEl;
    currentEl.classList.add("active");

    fillInputEl(
        currentEl.dataset.serviceName,
        currentEl.dataset.serviceDesc,
        currentEl.dataset.serviceStatus,
        currentEl.dataset.serviceDuration,
        currentEl.dataset.servicePriority
    );
});

document.addEventListener("click", event => {
    if (event.target.id === "btn-submit") {
        event.preventDefault();
        formEl.classList.add("was-validated");
        removeErrorMessages();

        let isValid = true;

        if (!nameEl.value || nameEl.value.length > 100) {
            setInvalid(nameEl, "Name must be between 1 and 100 characters.");
            isValid = false;
        }

        if (!descEl.value || descEl.value.length > 255) {
            setInvalid(descEl, "Description must be between 1 and 255 characters.");
            isValid = false;
        }

        if (isValid) {
            const formData = new FormData();
            formData.append("name", nameEl.value);
            formData.append("description", descEl.value);
            formData.append("status", statusEl.checked ? "1" : "0");
            formData.append("duration", durationEl.value);
            formData.append("priority", priorityEl.value);


            const actionType = event.target.innerText.toLowerCase();
            let url = `Service.php?action=${actionType}`;
            if (actionType === "update") {
                url += `&service_id=${prevEl.dataset.serviceId}`;
            }

            fetch(url, {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        fetchAndRenderServices();
                        cleanInputEl();
                        activateDeactivatedForm(true);
                        removeBtn();
                    } else {
                        alert(data.error || "Operation failed.");
                    }
                });
        }
    }
});
