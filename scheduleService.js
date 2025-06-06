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

    // Fetch dropdown data
function fetchServices() {
    fetch("getServices.php")
        .then(res => res.json())
        .then(data => {
            serviceEl.innerHTML = `<option value="">Select Service</option>`;
            data.services.forEach(service => {
                const option = document.createElement("option");
                option.value = service.ServiceID;
                option.textContent = service.Name;
                serviceEl.appendChild(option);
            });
        });
}

    function fetchCustomer() {
    fetch("ssGetCustomers.php")
        .then(res => res.json())
        .then(data => {
            custEl.innerHTML = `<option value="">Select Customer</option>`;
            data.customers.forEach(customer => {
                const option = document.createElement("option");
                option.value = customer.CustomerID;
                option.textContent = customer.Name;
                custEl.appendChild(option);
            });
        });
}

    function fetchEmployeeServices() {
    fetch("getEmployeeServices.php")
        .then(res => res.json())
        .then(data => {
            empServEl.innerHTML = `<option value="">Select Employee Service</option>`;
            data.employees.forEach(emp => {
                const option = document.createElement("option");
                option.value = emp.UserID;
                option.textContent = emp.Name;
                empServEl.appendChild(option);
            });
        });
}

    function fillInputs(data) {
    dateEl.value = data.date;
    serviceEl.value = data.serviceid;
    descEl.value = data.description;
    custEl.value = data.customer;
    statusEl.value = data.status;
    empServEl.value = data.employeeservice || "";
    materialEl.value = data.material;
}

    function activateEditableFields(active) {
    empServEl.disabled = !active;
    materialEl.disabled = !active;
    dateEl.disabled = true;
    serviceEl.disabled = true;
    descEl.disabled = true;
    custEl.disabled = true;
    statusEl.disabled = true;
}

    function removeActiveClass() {
    if (prevEl) prevEl.classList.remove("active");
}

    function removeSubmitBtn() {
    const btn = document.getElementById("btn-submit");
    if (btn) btn.remove();
}

    function createSubmitBtn(text) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "btn-submit";
    btn.className = "w-100 btn btn-primary btn-lg mt-3";
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
        .then(data => {
            listEl.innerHTML = "";
            const items = data.ScheduleServiceTable || [];

            items.forEach((item, index) => {
                const aEl = document.createElement("a");
                aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
                aEl.dataset.scheduleId = item.ServiceScheduleID;
                aEl.dataset.date = item.Date;
                aEl.dataset.serviceid = item.ServiceID;
                aEl.dataset.description = item.Description;
                aEl.dataset.customer = item.CustomerID;
                aEl.dataset.status = item.Status;
                aEl.dataset.employeeservice = item.EmployeeService;
                aEl.dataset.material = item.Material;

                const divHeader = document.createElement("div");
                divHeader.className = "d-flex w-100 align-items-center justify-content-between";

                const strongEl = document.createElement("strong");
                strongEl.innerText = `${item.Date} - ${item.ServiceName || "Unknown"} - ${item.EmployeeServiceName || "No Employee"}`;

                divHeader.appendChild(strongEl);
                aEl.appendChild(divHeader);
                listEl.appendChild(aEl);

                if (index === 0) {
                    prevEl = aEl;
                    aEl.classList.add("active");
                    fillInputs({
                        date: item.Date,
                        serviceid: item.ServiceID,
                        description: item.Description,
                        customer: item.CustomerID,
                        status: item.Status,
                        employeeservice: item.EmployeeService,
                        material: item.Material
                    });
                    activateEditableFields(false);
                }
            });
        })
        .catch(err => console.error("Failed to load schedule data:", err));
}

    // Update button logic
    updateBtnEl.addEventListener("click", () => {
    if (prevEl) {
    activateEditableFields(true);
    removeSubmitBtn();
    createSubmitBtn("Update");

    fillInputs({
    date: prevEl.dataset.date,
    serviceid: prevEl.dataset.serviceid,
    description: prevEl.dataset.description,
    customer: prevEl.dataset.customer,
    status: prevEl.dataset.status,
    employeeservice: prevEl.dataset.employeeservice,
    material: prevEl.dataset.material
});
} else {
    alert("Please select an item first.");
}
});

    // List item click
    listEl.addEventListener("click", e => {
    formEl.classList.remove("was-validated");
    removeErrors();
    removeSubmitBtn();
    activateEditableFields(false);
    removeActiveClass();

    let el = e.target;
    while (el && !el.classList.contains("list-group-item")) {
    el = el.parentNode;
}

    if (!el) return;

    prevEl = el;
    el.classList.add("active");

    fillInputs({
    date: el.dataset.date,
    serviceid: el.dataset.serviceid,
    description: el.dataset.description,
    customer: el.dataset.customer,
    status: el.dataset.status,
    employeeservice: el.dataset.employeeservice,
    material: el.dataset.material
});
});

    // Submit handler
    document.addEventListener("click", e => {
    if (e.target.id === "btn-submit") {
    e.preventDefault();
    formEl.classList.add("was-validated");
    removeErrors();

    let valid = true;
    if (!empServEl.value) {
    setInvalid(empServEl, "Please select an employee service.");
    valid = false;
}
    if (!materialEl.value || materialEl.value.length > 100) {
    setInvalid(materialEl, "Invalid material.");
    valid = false;
}

    if (valid) {
    const formData = new FormData();
    formData.append("employee_service", empServEl.value);
    formData.append("material", materialEl.value);

    const id = prevEl.dataset.scheduleId;
    fetch(`ScheduleService.php?action=update&serviceSchedule_id=${id}`, {
    method: "POST",
    body: formData
})
    .then(res => res.json())
    .then(res => {
    if (res.success) {
    fetchAndRenderSchedules();
    empServEl.value = "";
    materialEl.value = "";
    removeSubmitBtn();
    activateEditableFields(false);
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
} else {
    alert(res.error || "Failed to update.");
}
});
}
}
});

    fetchServices();
    fetchCustomer();
    fetchEmployeeServices();
    fetchAndRenderSchedules();
