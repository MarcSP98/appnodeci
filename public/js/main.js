const API_URL = location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://appnodedeploy-ee314911a96d.herokuapp.com';

const response = await fetch(`${API_URL}/users/addUser`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newUser),
});
class User {
    constructor(name, surname, email) {
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
}

async function addUser(event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email = document.getElementById("email").value.trim();

    // Validar datos
    if (!name || !surname || !email) {
        console.error("Todos los campos son obligatorios");
        alert("Por favor, completa todos los campos");
        return;
    }

    const newUser = new User(name, surname, email);

    try {
        // Aquí estás utilizando BASE_URL que ya ha sido importada correctamente
        const response = await fetch(`${API_URL}/users/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || `Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Usuario agregado:', result);
        alert('Usuario agregado correctamente');
        document.getElementById("userForm").reset();
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert(`Error al agregar el usuario: ${error.message}`);
    }
}

async function searchUserByEmail(event) {
    event.preventDefault();
    const userEmail = document.getElementById('userEmail').value.trim();

    if (!userEmail) {
        console.error("El campo de correo electrónico está vacío");
        alert("Por favor, ingresa un correo electrónico");
        return;
    }

    try {
        // Asegúrate de que BASE_URL ya esté inicializada antes de ser utilizada
        const response = await fetch(`${API_URL}/users/searchUserByEmail?userEmail=${encodeURIComponent(userEmail)}`);

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || `Error: ${response.status}`);
        }

        const userData = await response.json();
        const infoElement = document.getElementById("formattedInfo");

        const formattedInfo = Object.entries(userData)
            .map(([label, value]) => `<strong>${label}:</strong> ${value}`)
            .join('<br>');

        infoElement.innerHTML = formattedInfo;
    } catch (err) {
        console.error('Error al buscar usuario:', err);
        alert(`Error al buscar usuario: ${err.message}`);
    }
}