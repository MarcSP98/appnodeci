const express = require('express');
const User = require('../models/users');
const path = require('path'); // Importar path si es necesario para archivos estáticos

const router = express.Router();

// Middleware para analizar el cuerpo de la solicitud como JSON
router.use(express.json());

// Ruta principal para servir el archivo HTML desde la carpeta public
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Ruta para manejar las solicitudes GET para buscar usuarios por email
router.get('/searchUserByEmail', async (req, res) => {
    try {
        const userEmail = req.query.userEmail; // Obtener el email del usuario
        const user = await User.findOne({ email: userEmail }); // Buscar usuario en la BD

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); // Responder con el usuario encontrado
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error searching for user' });
    }
});

// Ruta para manejar las solicitudes POST y agregar un usuario
router.post('/addUser', async (req, res) => {
    try {
        const { name, surname, email } = req.body;

        if (!name || !surname || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email }); // Verificar si el email ya existe
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ name, surname, email });
        const userSaved = await newUser.save(); // Guardar usuario en la BD

        res.status(200).json({
            message: 'User saved successfully',
            user: userSaved
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;

