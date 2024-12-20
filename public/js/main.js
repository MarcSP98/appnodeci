const BASE_URL = window.location.origin; // Usará automáticamente la URL del servidor en producción

async function addUser(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;

    const newUser = new User(name, surname, email);

    document.getElementById("userForm").reset();

    try {
        const response = await fetch(`${BASE_URL}/users/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
        } else {
            console.error('Error adding user:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error adding user:', error.message);
    }
}

async function searchUserByEmail(event) {
    event.preventDefault();
    const userEmail = document.getElementById('userEmail').value;

    try {
        const response = await fetch(`${BASE_URL}/users/searchUserByEmail?userEmail=${userEmail}`);

        if (response.ok) {
            const userData = await response.json();
            const infoElement = document.getElementById("formattedInfo");
            const formattedInfo = Object.entries(userData)
                .map(([label, value]) => `${label}: ${value}`)
                .join('<br>');
            infoElement.innerHTML = formattedInfo;
        } else {
            console.error('Error retrieving user information:', response.status, response.statusText);
        }
    } catch (err) {
        console.error('Error retrieving user information:', err.message);
    }
}