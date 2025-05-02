fetch("userInfoJson.php")
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        document.getElementById('userName').innerText = result.Name;
    });

