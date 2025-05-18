const dateEl = document.getElementById("dt");
const serviceEl = document.getElementById("serv");
const descEl = document.getElementById("dst");
const custEl = document.getElementById("cst");
const statusEl = document.getElementById("status");
const empServEl = document.getElementById("es");
const materialEl = document.getElementById("mt");

const createBtnEl = document.getElementById("create");
const updateBtnEl = document.getElementById("update");
const deleteBtnEl = document.getElementById("delete");
const listEl = document.getElementById("SSlist");
const formEl = document.querySelector("form.needs-validation");

let prevEl = null;

createBtnEl.disabled = true;
deleteBtnEl.disabled = true;

function activateEditableFields(editable) {
    empServEl.disabled = !editable;
    materialEl.disabled = !editable;
    [dateEl, serviceEl, descEl, custEl, statusEl].forEach(el => el.disabled = true);
}

function cleanInputs() {
    empServEl.value = "";
    materialEl.value = "";
}

function fillInputs(data) {
    dateEl.value = data.Date;
    serviceEl.value = data.Service;
    descEl.value = data.Description;
    custEl.value = data.Customer;
    statusEl.value = data.Status;
    empServEl.value = data.EmployeeService;
    materialEl.value = data.Material;
}

function addListItem(data, index) {
    const aEl = document.createElement("a");
    aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
    aEl.dataset.scheduleId = data.ServiceScheduleID;

    Object.entries(data).forEach(([key, value]) => {
        aEl.dataset[key.toLowerCase()] = value;
    });

    const divHeader = document.createElement("div");
    divHeader.className = "d-flex w-100 align-items-center justify-content-between";
    const strongEl = document.createElement("strong");
    strongEl.innerText = `${data.Date} - ${data.Service}`;
    divHeader.appendChild(strongEl);
    aEl.appendChild(divHeader);
    listEl.appendChild(aEl);

    if (index === 0) {
        prevEl = aEl;
        prevEl.classList.add("active");
    }
}

function removeActiveClass() {
    if (prevEl) prevEl.classList.remove("active");
}

function removeSubmitBtn() {
    const existing = document.getElementById("btn-submit");
    if (existing) existing.remove();
}

function createSubmitBtn(text) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "btn-submit";
    btn.className = "w-100 btn btn-primary btn-lg";
    btn.innerText = text;
    formEl.appendChild(btn);
}

function removeErrors() {
    [empServEl, materialEl].forEach(el => {
        el.classList.remove("is-invalid");
        el.nextElementSibling.innerText = "";
    });
}

function setInvalid(el, message) {
    el.classList.add("is-invalid");
    el.nextElementSibling.innerText = message;
}

function fetchAndRenderSchedules() {
    fetch("ScheduleServiceData.php")
        .then(res => res.json())
        .then(result => {
            listEl.innerHTML = "";
            const schedules = result.ScheduleServiceTable;
            schedules.forEach((item, index) => addListItem(item, index));
            if (schedules.length > 0) fillInputs(schedules[0]);
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

fetchAndRenderSchedules();

updateBtnEl.addEventListener("click", () => {
    if (prevEl) {
        formEl.classList.remove("was-validated");
        removeErrors();
        activateEditableFields(true);
        removeSubmitBtn();
        createSubmitBtn("Update");
        fillInputs({
            Date: prevEl.dataset.date,
            Service: prevEl.dataset.service,
            Description: prevEl.dataset.description,
            Customer: prevEl.dataset.customer,
            Status: prevEl.dataset.status,
            EmployeeService: prevEl.dataset.employeeservice,
            Material: prevEl.dataset.material
        });
    } else {
        alert("Please select a schedule to update.");
    }
});

listEl.addEventListener("click", event => {
    formEl.classList.remove("was-validated");
    removeErrors();
    removeSubmitBtn();
    activateEditableFields(false);
    removeActiveClass();

    let currentEl = event.target;
    while (!currentEl.classList.contains("list-group-item")) {
        currentEl = currentEl.parentNode;
    }

    prevEl = currentEl;
    prevEl.classList.add("active");

    fillInputs({
        Date: currentEl.dataset.date,
        Service: currentEl.dataset.service,
        Description: currentEl.dataset.description,
        Customer: currentEl.dataset.customer,
        Status: currentEl.dataset.status,
        EmployeeService: currentEl.dataset.employeeservice,
        Material: currentEl.dataset.material
    });
});

document.addEventListener("click", event => {
    if (event.target.id === "btn-submit") {
        event.preventDefault();
        formEl.classList.add("was-validated");
        removeErrors();

        let valid = true;

        if (!empServEl.value || empServEl.value.length > 100) {
            setInvalid(empServEl, "Employee Service must be 1–100 characters.");
            valid = false;
        }

        if (!materialEl.value || materialEl.value.length > 100) {
            setInvalid(materialEl, "Material must be 1–100 characters.");
            valid = false;
        }

        if (valid) {
            const formData = new FormData();
            formData.append("employee_service", empServEl.value);
            formData.append("material", materialEl.value);

            const id = prevEl.dataset.scheduleId;  
            const url = `ScheduleService.php?action=update&serviceSchedule_id=${id}`;

            fetch(url, {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        fetchAndRenderSchedules();
                        cleanInputs();
                        activateEditableFields(false);
                        removeSubmitBtn();
                    } else {
                        alert(data.error || "Update failed.");
                    }
                });
        }
    }
});
