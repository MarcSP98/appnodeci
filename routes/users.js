const express = require('express');
const path = require('path'); // Importar 'path' para manejar rutas de archivos
const User = require('../models/users'); // Modelo de usuario
const router = express.Router();

// Middleware para analizar el cuerpo de la solicitud como JSON
router.use(express.json());

// Ruta principal para servir el archivo HTML desde la carpeta public
router.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public', 'index.html')); // Servir el archivo HTML
    } catch (err) {
        console.error('Error al servir archivo HTML:', err);
        res.status(500).json({ message: 'Error al cargar la página' });
    }
});

// Ruta para manejar las solicitudes GET para buscar usuarios por email
router.get('/searchUserByEmail', async (req, res) => {
    try {
        const { userEmail } = req.query; // Obtener el email del usuario

        // Validar que el parámetro userEmail exista
        if (!userEmail) {
            return res.status(400).json({ message: 'Email es obligatorio' });
        }

        const user = await User.findOne({ email: userEmail }); // Buscar usuario en la BD

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user); // Responder con el usuario encontrado
    } catch (err) {
        console.error('Error al buscar usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para manejar las solicitudes POST y agregar un usuario
router.post('/addUser', async (req, res) => {
    try {
        const { name, surname, email } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!name || !surname || !email) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        // Crear y guardar el nuevo usuario
        const newUser = new User({ name, surname, email });
        const userSaved = await newUser.save();

        res.status(201).json({
            message: 'Usuario guardado exitosamente',
            user: userSaved
        });
    } catch (err) {
        console.error('Error al guardar usuario:', err);

        // Manejar errores de validación específicos
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }

        res.status(500).json({ message: 'Error en la base de datos' });
    }
});

module.exports = router;