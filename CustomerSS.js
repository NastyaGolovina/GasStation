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

createBtnEl.disabled = false;
deleteBtnEl.disabled = true;

empServEl.disabled = true;
materialEl.disabled = true;
custEl.disabled = true;

function fetchCustomersForCreate() {
    fetch("getCustomers.php")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            custEl.innerHTML = "";
            // For create, load only one user - assuming getCustomers.php returns only logged-in user or filter first
            if (data.customers && data.customers.length > 0) {
                // If multiple users returned, pick the one matching logged-in user id here if you know it
                // For now, just pick the first user (you can customize filtering if needed)
                const user = data.customers[0];
                const option = document.createElement("option");
                option.value = user.CustomerID;
                option.textContent = user.Name;
                custEl.appendChild(option);
                custEl.value = user.CustomerID;
            } else {
                custEl.innerHTML = `<option value="">No customer found</option>`;
            }
            custEl.disabled = true; // always disabled
        })
        .catch(err => {
            console.error("Error fetching customers:", err);
            custEl.innerHTML = `<option value="">Error loading customer</option>`;
            custEl.disabled = true;
        });
}
function fetchServices() {
    fetch("getServices.php")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            serviceEl.innerHTML = `<option value="">Select Service</option>`;
            data.services.forEach(service => {
                const option = document.createElement("option");
                option.value = service.ServiceID;
                option.textContent = service.Name;
                serviceEl.appendChild(option);
            });
        });
}

function fetchEmployeeServices() {
    fetch("getEmployeeServices.php")
        .then(res => res.json())
        .then(data => {
            console.log(data);
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
    dateEl.value = data.date || "";
    serviceEl.value = data.serviceid || "";
    descEl.value = data.description || "";
    custEl.innerHTML = ""; // clear before setting
    if (data.customerName && data.customer) {
        // Set the selected customer only, disabled dropdown
        const option = document.createElement("option");
        option.value = data.customer;
        option.textContent = data.customerName;
        custEl.appendChild(option);
        custEl.value = data.customer;
    } else {
        custEl.innerHTML = `<option value="">No customer</option>`;
    }
    statusEl.value = data.status || "";
    empServEl.value = data.employeeservice || "";
    materialEl.value = data.material || "";
}

function activateEditableFields(active) {
    [dateEl, serviceEl, descEl, statusEl].forEach(el => (el.disabled = !active));
    // Always keep these disabled
    empServEl.disabled = true;
    materialEl.disabled = true;
    custEl.disabled = true;  // always disabled
}

function removeActiveClass() {
    if (prevEl) prevEl.classList.remove("active");
}

function removeSubmitBtn() {
    const btn = document.getElementById("btn-submit");
    if (btn) btn.remove();
    const btnCreate = document.getElementById("btn-submit-create");
    if (btnCreate) btnCreate.remove();
}

function createSubmitBtn(text, id = "btn-submit") {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = id;
    btn.className = "w-100 btn btn-primary btn-lg mt-3";
    btn.innerText = text;
    formEl.appendChild(btn);
}

function fetchAndRenderSchedules() {
    fetch("CustomerSSData.php")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            listEl.innerHTML = "";
            const items = data.ScheduleServiceTable || [];

            items.forEach((item, index) => {
                const aEl = document.createElement("a");
                aEl.className = "list-group-item list-group-item-action py-3 lh-sm";
                Object.assign(aEl.dataset, {
                    scheduleId: item.ServiceScheduleID,
                    date: item.Date,
                    serviceid: item.ServiceID,
                    description: item.Description,
                    customer: item.CustomerID,
                    customerName: item.CustomerName,  // add this field from backend
                    status: item.Status,
                    employeeservice: item.EmployeeService,
                    material: item.Material,
                });

                const divHeader = document.createElement("div");
                divHeader.className = "d-flex w-100 align-items-center justify-content-between";

                const strongEl = document.createElement("strong");
                strongEl.innerText = `${item.Date} - ${item.ServiceName || "Unknown"} - ${
                    item.EmployeeServiceName || "No Employee"
                }`;

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
                        customerName: item.CustomerName,  // set customer name
                        status: item.Status,
                        employeeservice: item.EmployeeService,
                        material: item.Material,
                    });
                    activateEditableFields(false);
                    deleteBtnEl.disabled = false;
                }
            });

            if (items.length === 0) {
                formEl.reset();
                deleteBtnEl.disabled = true;
                removeSubmitBtn();
                activateEditableFields(false);
            }
        })
        .catch(err => console.error("Failed to load schedule data:", err));
}

listEl.addEventListener("click", e => {
    formEl.classList.remove("was-validated");
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
    deleteBtnEl.disabled = false;

    fillInputs({
        date: el.dataset.date,
        serviceid: el.dataset.serviceid,
        description: el.dataset.description,
        customer: el.dataset.customer,
        customerName: el.dataset.customerName,  // pass customer name
        status: el.dataset.status,
        employeeservice: el.dataset.employeeservice,
        material: el.dataset.material,
    });
});

updateBtnEl.addEventListener("click", () => {
    if (!prevEl) return alert("Please select an item first.");
    activateEditableFields(true);
    custEl.disabled = true; // keep customer disabled always
    removeSubmitBtn();
    createSubmitBtn("Update");
});

createBtnEl.addEventListener("click", () => {
    formEl.reset();
    formEl.classList.remove("was-validated");
    activateEditableFields(true);
    custEl.disabled = true;  // always disabled
    removeSubmitBtn();
    createSubmitBtn("Create", "btn-submit-create");
    deleteBtnEl.disabled = true;
    fetchCustomersForCreate();  // fill customer dropdown with logged-in user only
});

document.addEventListener("click", e => {
    if (!["btn-submit", "btn-submit-create"].includes(e.target.id)) return;

    e.preventDefault();
    formEl.classList.add("was-validated");

    let valid = dateEl.value && serviceEl.value && custEl.value && statusEl.value;

    if (!valid) {
        alert("Please fill all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append("employee_service", empServEl.value);
    formData.append("material", materialEl.value);
    formData.append("date", dateEl.value);
    formData.append("service_id", serviceEl.value);
    formData.append("description", descEl.value);
    formData.append("customer_id", custEl.value);
    formData.append("status", statusEl.value);

    function handleResponse(res) {
        return res.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error("Invalid JSON response from server:", text);
                alert("Server returned an invalid response. Check console for details.");
                throw new Error("Invalid JSON response");
            }
        });
    }

    if (e.target.id === "btn-submit-create") {
        fetch("CustomerSS.php?action=create", {
            method: "POST",
            body: formData,
        })
            .then(handleResponse)
            .then(res => {
                if (res.success) {
                    fetchAndRenderSchedules();
                    formEl.reset();
                    removeSubmitBtn();
                    new bootstrap.Modal(document.getElementById("successModal")).show();
                    deleteBtnEl.disabled = false;
                } else {
                    alert(res.error || "Create failed.");
                }
            })
            .catch(err => console.error("Create error:", err));
    } else {
        const id = prevEl.dataset.scheduleId;
        fetch(`CustomerSS.php?action=update&serviceSchedule_id=${id}`, {
            method: "POST",
            body: formData,
        })
            .then(handleResponse)
            .then(res => {
                if (res.success) {
                    fetchAndRenderSchedules();
                    removeSubmitBtn();
                    activateEditableFields(false);
                    new bootstrap.Modal(document.getElementById("successModal")).show();
                } else {
                    alert(res.error || "Update failed.");
                }
            })
            .catch(err => console.error("Update error:", err));
    }
});

deleteBtnEl.addEventListener("click", () => {
    if (!prevEl) return alert("Select an item first.");
    const id = prevEl.dataset.scheduleId;
    if (!confirm("Are you sure you want to delete this item?")) return;

    const formData = new FormData();
    formData.append("serviceSchedule_id", id);

    fetch("CustomerSS.php?action=delete", {
        method: "POST",
        body: formData,
    })
        .then(res => res.text())
        .then(text => {
            try {
                const res = JSON.parse(text);
                if (res.success) {
                    fetchAndRenderSchedules();
                    formEl.reset();
                    removeSubmitBtn();
                    deleteBtnEl.disabled = true;
                } else {
                    alert(res.error || "Delete failed.");
                }
            } catch (e) {
                console.error("Invalid JSON response on delete:", text);
                alert("Server error on delete.");
            }
        })
        .catch(err => console.error("Delete error:", err));
});

fetchServices();
fetchEmployeeServices();
fetchAndRenderSchedules();
fetchCustomersForCreate();
