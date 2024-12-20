async function addUser(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;

    const newUser = { name, surname, email }; // Objeto simple

    try {
        const response = await fetch('/users/addUser', { // Asegúrate de que esta ruta es válida
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Usuario agregado:', result);
    } catch (error) {
        console.error('Error al agregar usuario:', error);
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