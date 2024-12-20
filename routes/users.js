const express = require('express')
const app = express()
const User = require('../models/users')

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json())

// Ruta principal para servir el archivo HTML desde la carpeta public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Ruta para manejar las solicitudes GET para buscar estudiantes
app.get('/searchUserByEmail', async (req, res) => {
    try {
        // Obtener el identificador del estudiante de la consulta
        const userEmail = req.query.userEmail
        // Realizar la búsqueda del estudiante en la base de datos
        const user = await User.findOne({email: userEmail})

        // Verificar si el estudiante existe
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Enviar la información del estudiante como respuesta
        res.status(200).json(user)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error searching for user' })
    }
})


// Ruta para manejar las solicitudes POST
app.post('/addUser', async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const { name, surname, email } = req.body

        // Verificar si faltan campos obligatorios
        if (!name || !surname || !email) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

         // Verificar si el correo electrónico ya está en uso
         const existingUser = await User.findOne({ email })
         if (existingUser) {
            console.log('Email already in use')
             return res.status(400).json({ message: 'Email already in use' })
         }

        // Crear una nueva instancia de usuario
        const newUser = new User({ name, surname, email })

        // Guardar el usuario en la base de datos
        const userSaved = await newUser.save()

        // Enviar una respuesta con el usuario guardado
        res.status(200).json({
            message: 'User saved successfully',
            user: userSaved
        })
    } catch (err) {
        // Manejar los errores de validación y de la base de datos
        console.error(err)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({
            message: 'Database error'
        })
    }
    
   
})


module.exports = app


