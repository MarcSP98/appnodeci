// Configuració de l'API només per producció
const API_URL = 'https://appnodedeploy-ee314911a96d.herokuapp.com/public';

// Classe Usuari
class User {
  constructor(name, surname, email) {
    this.name = name;
    this.surname = surname;
    this.email = email;
  }
}

// Afegir usuari
async function addUser(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !surname || !email) {
    alert("Por favor, completa todos los campos");
    return;
  }

  const newUser = new User(name, surname, email);

  try {
    const response = await fetch(`${API_URL}/users/addUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || `Error: ${response.status}`);
    }

    const result = await response.json();
    alert('Usuario agregado correctamente');
    console.log('Usuario agregado:', result);
    document.getElementById("userForm").reset();

  } catch (error) {
    console.error('Error al agregar usuario:', error);
    alert(`Error al agregar el usuario: ${error.message}`);
  }
}

// Cercar usuari per email
async function searchUserByEmail(event) {
  event.preventDefault();

  const userEmail = document.getElementById('userEmail').value.trim();
  const infoElement = document.getElementById("formattedInfo");

  if (!userEmail) {
    alert("Por favor, ingresa un correo electrónico");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/searchUserByEmail?userEmail=${encodeURIComponent(userEmail)}`);

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || `Error: ${response.status}`);
    }

    const userData = await response.json();

    infoElement.innerHTML = Object.entries(userData)
      .map(([label, value]) => `<strong>${label}:</strong> ${value}`)
      .join('<br>');

  } catch (err) {
    console.error('Error al buscar usuario:', err);
    alert(`Error al buscar usuario: ${err.message}`);
  }
}