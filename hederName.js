const nameEl = document.getElementById('userName');
fetch("userInfoJson.php")
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        nameEl.innerText = result.Name;
    });

