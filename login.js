const loginInput = document.getElementById('login');
const passInput = document.getElementById('password');
const errorMassage = document.getElementById('errorDiv');
fetch("loginJson.php")
    .then((response) => {
        return response.json();

    })
    .then((result) => {
        console.log(result);
        let password = result.password;
        let login = result.login;
        let isError = result.isError;
        let errorMessage = result.ErrorMessage;
        if(isError) {
            loginInput.classList.add('is-invalid');
            loginInput.value = login;
            passInput.classList.add('is-invalid');
            passInput.value = password;

            const pEl = document.createElement('p');
            pEl.innerText = errorMessage;
            errorMassage.appendChild(pEl);
        }
    });

