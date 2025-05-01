const nameEl = document.getElementById('userName');
let fetchRequest = fetch("userInfoJson.php");
fetchRequest
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        nameEl.innerText = result.Name;
    });

