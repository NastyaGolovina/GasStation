const h1El = document.getElementsByTagName("h1")[0];
let fetchRequest = fetch("userInfoJson.php");
fetchRequest
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        h1El.innerText = `Hello ${result.Name}`;
    });

