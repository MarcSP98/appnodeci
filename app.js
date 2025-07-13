const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv').config();

// Puerto del servidor
const port = process.env.PORT;

// URL de conexión a MongoDB Atlas, usando variable de entorno MONGODB_URI si está configurada
const MONGO_URI = process.env.MONGODB_URI;

// Middleware CORS
app.use(cors());

// Verifica si la variable MONGODB_URI está configurada
if (!MONGO_URI) {
    console.error('Error: La variable de entorno MONGODB_URI no está configurada.');
    process.exit(1); // Finaliza el proceso si no está configurada
}

// Conexión a MongoDB Atlas
mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => {
        console.error('Error al conectar a  MongoDB:', err);
        process.exit(1); // Finaliza el proceso si no se puede conectar
    });

// Middleware para manejar datos JSON
app.use(express.json());

// Servir archivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en ${port}`);
});