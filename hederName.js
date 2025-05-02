console.log("hii")
fetch("userInfoJson.php")
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        console.log(result);
        document.getElementById('userName').innerText = result.Name;
    });

