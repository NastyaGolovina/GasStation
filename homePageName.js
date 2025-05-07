const h1El = document.getElementsByTagName("h1")[0];
fetch("userInfoJson.php")
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        h1El.innerText = `Hello ${result.Name}`;
    });

