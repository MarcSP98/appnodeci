const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// URL de conexión a la base de datos
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/People';

// Conexión a la base de datos
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

// Importar rutas
const usersRouter = require('./routes/users');

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Middleware para permitir peticiones desde otros orígenes
app.use(cors());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

// Uso de rutas
app.use('/users', usersRouter);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});