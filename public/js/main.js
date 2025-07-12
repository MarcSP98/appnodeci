const API_URL = location.origin;

class User {
  constructor(nombre, correo, contrasena) {
    this.nombre = nombre;
    this.correo = correo;
    this.contrasena = contrasena;
  }
}

document.getElementById("registroForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  const newUser = new User(nombre, correo, contrasena);

  try {
    const response = await fetch(`${API_URL}/users/addUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    alert(data.message || "Usuario registrado con éxito.");
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    alert("Error al registrar el usuario. Revisa la consola.");
  }
});