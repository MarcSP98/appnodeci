const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.MONGODB_URI || "mongodb+srv://msp98msp:mspolot98@my-cluster.ozuqhwl.mongodb.net/?retryWrites=true&w=majority&appName=my-cluster"

// Verifica si la variable MONGODB_URI está configurada
if (!BASE_URL) {
    console.error('Error: La variable de entorno MONGODB_URI no está configurada.');
    process.exit(1); // Finaliza el proceso si no está configurada
}

// Conexión a MongoDB Atlas
mongoose.connect(BASE_URL)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err);
        process.exit(1);
    });

// Middleware
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
    console.log(`Servidor escuchando en http://localhost:${port}`);
});