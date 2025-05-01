const loginInput = document.getElementById('login');
const passInput = document.getElementById('password');
const errorMassage = document.getElementById('errorDiv');
let fetchRequest = fetch("loginJson.php");
fetchRequest
    .then((response) => {
        return response.json();
    })
    .then((data) => {
         let password = data.password;
        let login = data.login;
        let isError = data.isError;
        if(isError) {
            loginInput.classList.add('is-invalid');
            loginInput.value = login;
            passInput.classList.add('is-invalid');
            passInput.value = password;

            const pEl = document.createElement('p');
            pEl.innerText = "Login or Password is invalid";
            errorMassage.appendChild(pEl);
        }
    });

