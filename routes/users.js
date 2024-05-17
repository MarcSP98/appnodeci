const express = require('express');
const app = express();
const User = require('../models/users');

let cachedUsers = [];

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

app.get('/searchUserByEmail', async (req, res) => {
    try {
        // Obtener el correo electrónico del usuario de la consulta
        const userEmail = req.query.userEmail;

        // Buscar el usuario en la caché
        const cachedUser = cachedUsers.find(user => user.email === userEmail);

        // Si el usuario está en la caché, enviarlo como respuesta
        if (cachedUser) {
            console.log('User found in cache:', cachedUser); // Agrega este mensaje de registro
            return res.status(200).json(cachedUser);
        }

        // Si el usuario no está en la caché, buscarlo en la base de datos
        const user = await User.findOne({ email: userEmail });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Almacenar el usuario en la caché
        cachedUsers.push(user);
        console.log('User added to cache:', user); // Agrega este mensaje de registro

        // Enviar la información del estudiante como respuesta
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error searching for user' });
    }
})


// Ruta para manejar las solicitudes POST
app.post('/addUser', async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const { name, surname, email } = req.body;

        // Verificar si faltan campos obligatorios
        if (!name || !surname || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verificar si el correo electrónico ya está en uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already in use');
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Crear una nueva instancia de usuario
        const newUser = new User({ name, surname, email });

        // Guardar el usuario en la base de datos
        const userSaved = await newUser.save();

        // Almacenar el usuario en la caché
        cachedUsers.push(userSaved);
        console.log('User added to cache:', userSaved); // Agrega este mensaje de registro

        // Enviar una respuesta con el usuario guardado
        res.status(200).json({
            message: 'User saved successfully',
            user: userSaved
        });
    } catch (err) {
        // Manejar los errores de validación y de la base de datos
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({
            message: 'Database error'
        });
    }
});


module.exports = app;
