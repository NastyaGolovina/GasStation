const sendRequestBtn = document.getElementById("sendRequest");
const  refreshOutputBtn = document.getElementById("refreshOutput");
let requestId = '';


sendRequestBtn.addEventListener('click', () => {
    const code = document.getElementById('code').value;
    fetch('http://localhost:3000/api/runcode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            requestId = data.id;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

refreshOutputBtn.addEventListener('click', () => {
    if (!requestId) {
        alert('Please send a request first.');
        return;
    }

    fetch(`http://localhost:3000/api/runresult?id=${requestId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if(data.completed === true) {
                document.getElementById('output').innerHTML = data.output;
                requestId = '';
            } else {
                document.getElementById('output').innerText = "Processing...";
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});