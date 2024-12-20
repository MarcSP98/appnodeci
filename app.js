const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // Importa el módulo 'path'

const app = express();
const port = process.env.PORT || 3000;

// URL de conexión a la base de datos
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/People';

// Conexión a la base de datos
mongoose.connect(mongoURI)
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

// Importar rutas
const usersRouter = require('./routes/users');

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

app.use(cors());

// Middleware para servir archivos estáticos desde la carpeta 'public'
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));
// Rutas
app.use('/users', usersRouter);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});