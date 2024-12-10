async function GetAllData() {
    let data = fetch('https://jsonplaceholder.org/users')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    return response.json();
    })
    .then(user => {
        console.log(user);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
    return data;
}
async function GetData(number) {
    let data = fetch(`https://jsonplaceholder.org/users?id=${number}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    return response.json();
    })
    .then(user => {
        console.log(user);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
    return data;
}

function start() {
    let id = document.getElementById("id").value;
    if (id) {
        GetData(id);
    } else {
        console.error('Please enter a valid user ID.');
    }
}

document.getElementById("fetchButton").addEventListener("click", start);